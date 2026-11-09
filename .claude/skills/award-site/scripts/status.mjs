#!/usr/bin/env node
// award-site: where each site stands, and what the next stage needs.
//
//   npm run status            one line per site
//   npm run status -- <site>  one site in detail
//
// Reads the stage log in each site's docs/decisions.md (format: references/templates.md).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const findRoot = (start) => {
  for (let d = start; d !== path.dirname(d); d = path.dirname(d)) {
    if (fs.existsSync(path.join(d, "skills.lock.json"))) return d;
  }
  return null;
};
const root = findRoot(process.cwd()) || findRoot(here);
if (!root) {
  console.error("Can't find the design-portfolio root (skills.lock.json).");
  process.exit(1);
}

const STAGES = [
  { n: 0, name: "setup", file: "0-setup.md", needs: [] },
  { n: 1, name: "intake", file: "1-intake.md", needs: [] },
  { n: 2, name: "research", file: "2-research.md", needs: ["docs/brief.md", "PRODUCT.md"], gate: 1 },
  { n: 3, name: "concept", file: "3-concept.md", needs: ["docs/research.md"] },
  { n: 4, name: "direction", file: "4-direction.md", needs: ["docs/concept.md"] },
  { n: 5, name: "assets", file: "5-assets.md", needs: ["DESIGN.md"], gate: 2 },
  { n: 6, name: "spec", file: "6-spec.md", needs: ["docs/assets.md"] },
  { n: 7, name: "build", file: "7-build.md", needs: ["docs/spec.md"] },
  { n: 8, name: "verify", file: "8-verify.md", needs: ["package.json"] },
  { n: 9, name: "launch", file: "9-launch.md", needs: ["docs/qa.md"], jury: true },
];
const GATE_NAMES = { 1: "client approval of the brief", 2: "client approval of the concept and working hero", 3: "client approval of the production URL" };

function sites() {
  const dir = path.join(root, "sites");
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) out.push({ name: e.name, dir: path.join(dir, e.name) });
    else if (e.name.endsWith(".md") && e.name !== "README.md") {
      const text = fs.readFileSync(path.join(dir, e.name), "utf8");
      const local = (text.match(/^Local:\s*(.+)$/m) || [])[1];
      const repo = (text.match(/^Repo:\s*(.+)$/m) || [])[1];
      out.push({ name: e.name.replace(/\.md$/, ""), dir: local ? path.resolve(root, local.trim()) : null, repo });
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

function read(site) {
  const info = { ...site, track: "?", done: new Map(), blocked: null, gates: new Map(), jury: null, decisions: [], skills: new Map() };
  const file = site.dir && path.join(site.dir, "docs", "decisions.md");
  if (!file || !fs.existsSync(file)) {
    info.missing = site.dir && fs.existsSync(site.dir) ? "no docs/decisions.md" : `not cloned here${site.repo ? `: ${site.repo}` : ""}`;
    return info;
  }
  const text = fs.readFileSync(file, "utf8");
  info.track = ((text.match(/^Track:\s*(\w+)/m) || [])[1] || "?").toLowerCase();
  for (const line of text.split("\n")) {
    let m;
    if ((m = line.match(/^- (\d{4}-\d{2}-\d{2}) · stage (\d) [\w-]+ · (.+)$/))) {
      const [, date, n, state] = m;
      if (state.startsWith("done")) info.done.set(Number(n), date);
      else if (state.startsWith("blocked")) info.blocked = { stage: Number(n), date, why: state.replace(/^blocked:?\s*/, "") };
    } else if ((m = line.match(/^- (\d{4}-\d{2}-\d{2}) · gate (\d) · (approved|changes requested)(?: · (.*))?$/))) {
      info.gates.set(Number(m[2]), { date: m[1], state: m[3], note: m[4] || "" });
    } else if ((m = line.match(/^- (\d{4}-\d{2}-\d{2}) · skill ([\w-]+) · stage (\d)/))) {
      const n = Number(m[3]);
      if (!info.skills.has(n)) info.skills.set(n, new Set());
      info.skills.get(n).add(m[2]);
    } else if ((m = line.match(/^- (\d{4}-\d{2}-\d{2}) · jury · (pass|fail) · ([\d.]+)/))) {
      info.jury = { date: m[1], pass: m[2] === "pass", estimate: Number(m[3]) };
    } else if (/^- \d{4}-\d{2}-\d{2} · /.test(line) && !/· (stage|gate|jury|skill) /.test(line)) {
      info.decisions.push(line.slice(2));
    }
  }
  const last = Math.max(-1, ...info.done.keys());
  info.next = STAGES.find((s) => s.n === last + 1) || null;
  if (info.blocked && info.blocked.stage <= last) info.blocked = null;
  return info;
}

// The skill each stage can't be done without. A done stage with no skill line for it
// means the skill never ran (SKILL.md, "Running a stage"), so status says so.
const LEAD_SKILL = { 1: "brainstorming", 3: "brainstorming", 4: "ui-ux-pro-max", 6: "writing-plans", 7: "subagent-driven-development", 8: "jury" };

// What each finished stage must have left behind. Cheap checks, so status never has to open files.
const LEFT_BEHIND = {
  0: { files: ["CLAUDE.md", "docs/decisions.md", "package.json"], fingerprint: true },
  1: { files: ["PRODUCT.md", "docs/brief.md"] },
  2: { files: ["docs/research.md"] },
  3: { files: ["docs/concept.md"], headings: { "docs/concept.md": ["## Journey", "## Grammar", "## Signature move", "## Feeling curve", "## Fingerprint check"] } },
  4: { files: ["DESIGN.md", "docs/hero-approved"], glob: ["design-system", "MASTER.md"] },
  5: { files: ["docs/assets.md"] },
  6: { files: ["docs/spec.md"] },
  8: { files: ["docs/qa.md"] },
};

function health(info) {
  const out = [];
  // A day of slack, so a log written in India late at night isn't "in the future" by UTC.
  const tomorrow = new Date(Date.now() + 864e5).toISOString().slice(0, 10);
  for (const [n, date] of info.done) {
    if (date > tomorrow) out.push(`stage ${n} is logged on ${date}, which is in the future`);
    const want = LEFT_BEHIND[n];
    if (!want) continue;
    for (const f of want.files) if (!fs.existsSync(path.join(info.dir, f))) out.push(`stage ${n} is done but ${f} is missing`);
    for (const [f, heads] of Object.entries(want.headings || {})) {
      const p = path.join(info.dir, f);
      if (!fs.existsSync(p)) continue;
      const text = fs.readFileSync(p, "utf8");
      const gone = heads.filter((h) => !text.includes(h));
      if (gone.length) out.push(`${f} lacks ${gone.map((h) => h.replace(/^## /, "")).join(", ")}`);
    }
    if (want.glob) {
      const [dir, file] = want.glob;
      const base = path.join(info.dir, dir);
      const found = fs.existsSync(base) && fs.readdirSync(base).some((d) => fs.existsSync(path.join(base, d, file)));
      if (!found) out.push(`stage ${n} is done but ${dir}/<site>/${file} is missing`);
    }
    if (want.fingerprint) {
      const fp = path.join(root, "system", "FINGERPRINTS.md");
      if (!fs.existsSync(fp) || !new RegExp(`^\\| ${info.name} \\|`, "m").test(fs.readFileSync(fp, "utf8"))) out.push(`no row for ${info.name} in system/FINGERPRINTS.md`);
    }
  }
  return out;
}

function blockers(info) {
  const out = [];
  const s = info.next;
  if (!s || !info.dir) return out;
  for (const need of s.needs) if (!fs.existsSync(path.join(info.dir, need))) out.push(`missing ${need}`);
  if (s.gate && info.track === "client") {
    const g = info.gates.get(s.gate);
    if (!g || g.state !== "approved") out.push(`gate ${s.gate} not logged: ${GATE_NAMES[s.gate]}`);
  }
  if (s.jury && !(info.jury && info.jury.pass)) out.push(info.jury ? `jury failed at ${info.jury.estimate}; fix and rerun /award-site jury` : "no passing jury yet");
  if (info.blocked) out.push(`blocked: ${info.blocked.why}`);
  return out;
}

const want = process.argv[2];
const all = sites().map(read);
if (!all.length) {
  console.log("No sites yet. Start one: /award-site new <site> --client|--own");
  process.exit(0);
}

if (!want) {
  for (const i of all) {
    if (i.missing) { console.log(`${i.name.padEnd(22)} ${i.missing}`); continue; }
    const last = Math.max(-1, ...i.done.keys());
    const b = blockers(i);
    const h = health(i);
    const nextTxt = i.next ? `next: ${i.next.n} ${i.next.name}` : "launched";
    const flag = h.length ? ` · ${h.length} check${h.length > 1 ? "s" : ""} failing` : b.length ? ` · ${b[0]}` : "";
    console.log(`${i.name.padEnd(22)} ${i.track.padEnd(6)} stage ${last} done · ${nextTxt}${flag}`);
  }
  process.exit(0);
}

const info = all.find((i) => i.name === want);
if (!info) {
  console.log(`No site called "${want}". Sites: ${all.map((i) => i.name).join(", ")}`);
  process.exit(1);
}
if (info.missing) {
  console.log(`${info.name}: ${info.missing}`);
  process.exit(0);
}
console.log(`${info.name} · ${info.track} track · ${path.relative(root, info.dir) || info.dir}`);
for (const s of STAGES) {
  const d = info.done.get(s.n);
  if (d) console.log(`  done  ${s.n} ${s.name.padEnd(10)} ${d}`);
}
for (const [n, g] of [...info.gates].sort()) console.log(`  gate  ${n} ${g.state} ${g.date}${g.note ? ` (${g.note})` : ""}`);
if (info.jury) console.log(`  jury  ${info.jury.pass ? "pass" : "fail"} ${info.jury.estimate} ${info.jury.date}`);
const unlogged = Object.entries(LEAD_SKILL).filter(([n, sk]) => info.done.has(Number(n)) && !(info.skills.get(Number(n)) || new Set()).has(sk));
if (unlogged.length) console.log(`\nNo skill line for: ${unlogged.map(([n, sk]) => `stage ${n} ${sk}`).join(", ")}. Log it if it ran (with "(backfilled)" if logged late); if it didn't, the stage was skipped, not done.`);
if (!info.next) {
  console.log("\nAll stages done. Next: /award-site learn " + info.name + " when award scores arrive.");
  process.exit(0);
}
const b = blockers(info);
const h = health(info);
if (h.length) console.log(`\nChecks failing (fix before moving on):\n${h.map((x) => `  - ${x}`).join("\n")}`);
console.log(`\nNext: stage ${info.next.n} ${info.next.name} (references/stages/${info.next.file})`);
console.log(b.length ? `Blocked by:\n${b.map((x) => `  - ${x}`).join("\n")}` : "Ready: every input exists.");
if (info.decisions.length) console.log(`\nRecent decisions:\n${info.decisions.slice(-3).map((d) => `  ${d}`).join("\n")}`);
