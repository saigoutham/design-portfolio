#!/usr/bin/env node
// award-site skills audit: checks the capability registry (references/skills.md) against
// skills.lock.json, what is installed on this machine, the skills each stage file names,
// and the `skill` lines in every site's docs/decisions.md (the only proof a skill ran).
//
//   npm run skills            the audit
//   npm run skills -- --all   also list every installed skill with its listing cost

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(here, "..");
function findRoot(start) {
  for (let dir = start; dir !== path.dirname(dir); dir = path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, "skills.lock.json"))) return dir;
  }
  return null;
}
const root = findRoot(process.cwd()) || findRoot(here);
if (!root) {
  console.error("Can't find skills.lock.json. Run this from inside the design-portfolio repo.");
  process.exit(1);
}
const lock = JSON.parse(fs.readFileSync(path.join(root, "skills.lock.json"), "utf8"));
const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");

const pinned = new Map();
for (const s of lock.skills) pinned.set(s.name, { kind: "skill", mode: s.mode, pack: s.pack || null });
for (const a of lock.agents) pinned.set(a.name, { kind: "agent", mode: a.mode, pack: null });
for (const l of lock.library) pinned.set(l.name, { kind: "library", mode: l.mode, pack: l.mode === "fetch" ? "library" : null });
for (const e of lock.external) {
  pinned.set(e.pack, { kind: "external", mode: "external", pack: e.pack });
  for (const n of e.provides || []) pinned.set(n, { kind: "external", mode: "external", pack: e.pack });
}
pinned.set("award-site", { kind: "skill", mode: "own", pack: null });

const installed = (name) => {
  const p = pinned.get(name);
  if (!p) return false;
  if (p.kind === "agent") return fs.existsSync(path.join(root, ".claude", "agents", `${name}.md`));
  if (p.kind === "library") return fs.existsSync(path.join(root, "library", name));
  if (p.kind === "external") return null;
  return fs.existsSync(path.join(root, ".claude", "skills", name, "SKILL.md"));
};

// Registry: backticked names in the first cell of each table row, before "## Environment".
const registry = read(path.join(skillRoot, "references", "skills.md"));
const envAt = registry.indexOf("\n## Environment");
const registered = new Set();
for (const line of (envAt >= 0 ? registry.slice(0, envAt) : registry).split("\n")) {
  if (!line.startsWith("| ")) continue;
  const first = line.split("|")[1] || "";
  for (const m of first.matchAll(/`([a-z0-9][\w.-]*)`/g)) registered.add(m[1]);
}

// Router rows: stage id ("0".."9" or "every") -> row text.
const routerText = (registry.split("\n## Router")[1] || "").split("\n## ")[0];
const router = new Map();
for (const line of routerText.split("\n")) {
  const m = line.match(/^\| (\d|every) \|/);
  if (m) router.set(m[1], line);
}
const inRow = (id, name) => new RegExp(`(?<![\\w-])${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w-])`).test(router.get(id) || "");

// Skills each stage file (and floor.md, which runs at stage 4) names in bold.
const stageDir = path.join(skillRoot, "references", "stages");
const named = new Map();
const files = [...fs.readdirSync(stageDir).map((f) => path.join(stageDir, f)), path.join(skillRoot, "references", "floor.md")];
for (const f of files) {
  const base = path.basename(f, ".md");
  const stage = base === "floor" ? "4" : base[0];
  for (const m of read(f).matchAll(/\*\*([a-z0-9][a-z0-9-]*)\*\*/g)) {
    const n = m[1];
    if (!named.has(n)) named.set(n, new Map());
    named.get(n).set(base, stage);
  }
}

// Execution evidence: `- <date> · skill <name> · stage <n> · <output>` in any site's decisions.md.
const ran = new Map();
const sitesDir = path.join(root, "sites");
for (const site of fs.existsSync(sitesDir) ? fs.readdirSync(sitesDir) : []) {
  const text = read(path.join(sitesDir, site, "docs", "decisions.md"));
  for (const m of text.matchAll(/^- (\d{4}-\d{2}-\d{2}) · skill ([\w-]+) · stage (\d)(.*)$/gm)) {
    const r = ran.get(m[2]) || { count: 0, backfilled: 0, sites: new Set(), last: "" };
    r.count++; if (/\(backfilled/.test(m[4])) r.backfilled++;
    r.sites.add(site); if (m[1] > r.last) r.last = m[1];
    ran.set(m[2], r);
  }
}

// Listing cost: an installed skill's description sits in every session's skill list.
const listingTokens = (name) => {
  const text = read(path.join(root, ".claude", "skills", name, "SKILL.md"));
  const fm = text.split(/^---\s*$/m)[1] || "";
  const at = fm.indexOf("description:");
  if (at < 0) return 0;
  return Math.round(fm.slice(at).split(/\n[\w-]+:/)[0].length / 4);
};

const skills = [...pinned].filter(([, p]) => p.kind === "skill").map(([n]) => n);
const on = skills.filter(installed);
const cost = on.reduce((t, n) => t + listingTokens(n), 0);
const packsOn = [...new Set(on.map((n) => pinned.get(n).pack).filter(Boolean))];

console.log(`Installed: ${on.length} of ${skills.length} pinned skills (packs on: ${packsOn.join(", ") || "none"}). Skill-list cost: ~${cost} tokens in every session.`);

const ranList = [...ran].sort((a, b) => b[1].count - a[1].count);
console.log(`\nRan (logged): ${ranList.length ? ranList.map(([n, r]) => `${n} ×${r.count}${r.backfilled ? ` (${r.backfilled} backfilled)` : ""}`).join(", ") : "nothing logged yet"}`);
const idle = on.filter((n) => !ran.has(n) && n !== "award-site");
console.log(`Installed, never logged as run: ${idle.length}${idle.length ? `: ${idle.join(", ")}` : ""}`);

const problems = [];
for (const n of pinned.keys()) if (!registered.has(n)) problems.push(`pinned but not in the registry: ${n}`);
for (const n of registered) if (!pinned.has(n)) problems.push(`in the registry but not pinned: ${n}`);
for (const [n, where] of named) {
  if (!pinned.has(n)) { problems.push(`named in ${[...where.keys()].join(", ")} but not pinned: ${n}`); continue; }
  if (!registered.has(n) && !["skill", "agent"].includes(pinned.get(n).kind)) continue;
  for (const [file, stage] of where) if (!inRow(stage, n) && !inRow("every", n)) problems.push(`${file} names ${n}, but the router's stage ${stage} row doesn't`);
}
for (const n of ran.keys()) if (!pinned.has(n)) problems.push(`logged as run but not pinned: ${n}`);
console.log(problems.length ? `\nCheck:\n  ${problems.join("\n  ")}` : "\nRegistry, lock, stage files and logs agree.");

if (process.argv.includes("--all")) {
  console.log("\nInstalled skills, listing cost (tokens):");
  for (const n of on.sort((a, b) => listingTokens(b) - listingTokens(a))) console.log(`  ${String(listingTokens(n)).padStart(4)}  ${n}${pinned.get(n).pack ? `  (pack ${pinned.get(n).pack})` : ""}`);
}
