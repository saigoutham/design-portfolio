#!/usr/bin/env node
// award-site: the phase checklist, the gate and phase changes. One source for all three: references/phases/<n>-<name>.json.
//
//   npm run phase -- <site> start <n> [--own|--client]   set the phase and print its checklist (turn it into the task list)
//   npm run phase -- <site>                              the checklist with what's done
//   npm run phase -- <site> check                        exit 1 if a required step has no evidence
//   npm run phase -- <site> done                         check, then log the phase and move to the next one
//   npm run phase -- <site> guard <file>...              exit 2 if sending these files would skip a step (used by the hook)
//
// A step counts as done only when its output files exist (and contain what "has" asks for).
// Evidence comes from files the work writes, not from log lines.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../../..");
const phasesDir = path.join(here, "../references/phases");
const PHASES = fs.readdirSync(phasesDir).filter((f) => f.endsWith(".json")).sort()
  .map((f) => ({ file: f, ...JSON.parse(fs.readFileSync(path.join(phasesDir, f), "utf8")) }));

const [site, cmd = "list", ...rest] = process.argv.slice(2);
if (!site) { console.error("usage: npm run phase -- <site> [start <n>|check|done|guard <file>...]"); process.exit(2); }
const siteDir = path.join(root, "sites", site);
if (!fs.existsSync(siteDir)) { console.error(`No site folder: sites/${site}`); process.exit(2); }
const stateFile = path.join(siteDir, "docs/state.json");
const readState = () => (fs.existsSync(stateFile) ? JSON.parse(fs.readFileSync(stateFile, "utf8")) : null);
const writeState = (s) => { fs.mkdirSync(path.dirname(stateFile), { recursive: true }); fs.writeFileSync(stateFile, JSON.stringify(s, null, 2) + "\n"); };
const today = () => new Date().toISOString().slice(0, 10);

function glob(pattern) {
  const full = path.join(siteDir, pattern);
  const dir = path.dirname(full), base = path.basename(full);
  if (!fs.existsSync(dir)) return [];
  const re = new RegExp("^" + base.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$");
  // a "*" in a directory part (e.g. .jury/*/critic.md) is expanded one level
  if (dir.includes("*")) return [];
  return fs.readdirSync(dir).filter((f) => re.test(f)).map((f) => path.join(dir, f));
}
function globDeep(pattern) {
  if (!pattern.split("/").slice(0, -1).some((p) => p.includes("*"))) return glob(pattern);
  const parts = pattern.split("/");
  let paths = [siteDir];
  for (const part of parts) {
    const re = new RegExp("^" + part.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$");
    paths = paths.flatMap((p) => (fs.existsSync(p) && fs.statSync(p).isDirectory() ? fs.readdirSync(p).filter((f) => re.test(f)).map((f) => path.join(p, f)) : []));
  }
  return paths;
}

function stepStatus(step) {
  const missing = [];
  for (const o of step.out) {
    let files = globDeep(o.glob);
    if (o.has) files = files.filter((f) => fs.statSync(f).isFile() && fs.readFileSync(f, "utf8").includes(o.has));
    const min = o.min || 1;
    if (files.length < min) missing.push(`${o.glob}${o.has ? ` containing "${o.has}"` : ""}: ${files.length}/${min}`);
  }
  return { done: missing.length === 0, missing };
}

const phaseOf = (n) => PHASES.find((p) => p.phase === Number(n));
const required = (p, state) => p.steps.filter((s) => !s.optional && !(s.client_only && state.track !== "client"));

const lock = JSON.parse(fs.readFileSync(path.join(root, "skills.lock.json"), "utf8"));
function availability(name) {
  // returns null when fine, or a fix line
  if (/^(agent:|npm |user|you$)/.test(name)) return null;
  const skill = name.split(" ")[0];
  if (skill.startsWith("library/")) return fs.existsSync(path.join(root, skill)) ? null : `${skill} missing: npm run setup -- --with library`;
  if (fs.existsSync(path.join(root, ".claude/skills", skill)) || fs.existsSync(path.join(root, ".claude/agents", `${skill}.md`))) return null;
  const item = [...lock.skills, ...lock.agents].find((s) => s.name === skill);
  if (item && item.pack) return `${skill} not installed: npm run setup -- --with ${item.pack}`;
  if (item) return `${skill} missing from disk: npm run setup -- --vendor`;
  return `${skill} is not in skills.lock.json: pin it or change this step`;
}

function print(p, state) {
  console.log(`${site} · phase ${p.phase} ${p.name} (${state.track || "own"} track) · leaves ${p.leaves}`);
  for (const s of p.steps) {
    const st = stepStatus(s);
    const tag = s.optional ? " (optional)" : s.client_only && state.track !== "client" ? " (client only)" : "";
    console.log(`  ${st.done ? "[x]" : "[ ]"} ${s.id} ${s.do}${tag}\n        by: ${s.by.join(", ")}`);
    if (!st.done) s.by.map(availability).filter(Boolean).forEach((m) => console.log(`        ! ${m}`));
    if (!st.done) st.missing.forEach((m) => console.log(`        missing: ${m}`));
  }
}

const state = readState();
if (cmd === "start") {
  const n = Number(rest[0]); const p = phaseOf(n);
  if (!p) { console.error(`No phase ${rest[0]}`); process.exit(2); }
  const track = rest.includes("--client") ? "client" : rest.includes("--own") ? "own" : state?.track || "own";
  if (state && state.phase < n) {
    const prev = phaseOf(state.phase), open = required(prev, state).filter((s) => !stepStatus(s).done);
    if (open.length) { console.log(`Phase ${prev.phase} ${prev.name} isn't done. Open steps: ${open.map((s) => s.id).join(", ")}. Finish them or run done.`); process.exit(1); }
  }
  writeState({ phase: n, track, started: today() });
  print(p, { track });
  console.log("\nMake each open step a task now. Nothing from this phase is shown until its guards pass.");
  process.exit(0);
}
if (!state) { console.log(`${site}: no docs/state.json. Run: npm run phase -- ${site} start <n>`); process.exit(cmd === "list" ? 0 : 1); }
const p = phaseOf(state.phase);

if (cmd === "list") { print(p, state); process.exit(0); }
if (cmd === "check" || cmd === "done") {
  const open = required(p, state).map((s) => ({ s, st: stepStatus(s) })).filter((x) => !x.st.done);
  if (open.length) {
    console.log(`PHASE ${p.phase} ${p.name} NOT DONE for ${site}:`);
    open.forEach(({ s, st }) => console.log(`  ${s.id} ${s.do}\n    ${st.missing.join("\n    ")}`));
    process.exit(1);
  }
  if (cmd === "check") { console.log(`PHASE ${p.phase} ${p.name} complete for ${site}.`); process.exit(0); }
  fs.appendFileSync(path.join(siteDir, "docs/decisions.md"), `- ${today()} · phase ${p.phase} ${p.name} · done\n`);
  const next = phaseOf(state.phase + 1);
  if (next) { writeState({ ...state, phase: next.phase, started: today() }); console.log(`Phase ${p.phase} done. Now phase ${next.phase} ${next.name}:`); print(next, state); }
  else console.log(`Phase ${p.phase} done. The site is shipped.`);
  process.exit(0);
}
if (cmd === "guard") {
  // Sending a file that a step guards needs that step and every required step before it in the phase.
  const files = rest.map((f) => path.relative(siteDir, path.resolve(f)));
  const blocks = [];
  for (const f of files) {
    const idx = p.steps.findIndex((s) => (s.guards || []).some((g) => new RegExp("^" + g.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$").test(f)));
    if (idx < 0) continue;
    const need = required({ steps: p.steps.slice(0, idx + 1) }, state);
    const open = need.filter((s) => !stepStatus(s).done);
    if (open.length) blocks.push(`${f}: open steps ${open.map((s) => `${s.id} (${s.do})`).join("; ")}`);
  }
  if (blocks.length) { console.error(`Blocked by award-site phase ${p.phase} ${p.name}: this would show work that skipped steps.\n${blocks.join("\n")}\nDo the steps, or lead the message with "Below the floor:" if the user asked to see it anyway.`); process.exit(2); }
  process.exit(0);
}
console.error(`Unknown command: ${cmd}`); process.exit(2);
