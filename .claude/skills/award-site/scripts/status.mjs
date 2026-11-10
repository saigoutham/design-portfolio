#!/usr/bin/env node
// award-site status: where each site stands and what the next phase needs. Opens no site docs beyond the log.
//   npm run status            every site, one line each
//   npm run status -- <site>  one site: phases, problems, next step
// Reads `- <date> · phase <n> <name> · done` lines in docs/decisions.md. Sites logged with the old
// ten-stage pipeline (`stage <n>`) are mapped onto phases, and a phase only counts if its files exist.
import fs from "node:fs";
import path from "node:path";

let root = process.cwd();
while (root !== path.dirname(root) && !fs.existsSync(path.join(root, "skills.lock.json"))) root = path.dirname(root);
if (!fs.existsSync(path.join(root, "skills.lock.json"))) { console.error("Run this inside the design-portfolio repo."); process.exit(1); }

const PHASES = [
  { n: 0, name: "start", leaves: ["CLAUDE.md", "docs/decisions.md", "package.json"], legacy: 0 },
  { n: 1, name: "brief", leaves: ["PRODUCT.md", "docs/brief.md"], legacy: 1, gate: 1 },
  { n: 2, name: "concept", leaves: ["docs/concept.md", "docs/art.md"], legacy: 3 },
  { n: 3, name: "hero", leaves: ["DESIGN.md", "docs/hero-approved"], legacy: 4, gate: 2 },
  { n: 4, name: "build", leaves: ["docs/spec.md"], legacy: 7 },
  { n: 5, name: "ship", leaves: ["docs/qa.md"], legacy: 9, gate: 3 },
];
const GATES = { 1: "the brief", 2: "the concept and the working hero", 3: "the production URL" };

function read(name) {
  const dir = path.join(root, "sites", name);
  const log = path.join(dir, "docs", "decisions.md");
  const info = { name, dir, track: "?", done: new Set(), gates: new Set(), blocked: null, problems: [] };
  if (!fs.existsSync(log)) { info.problems.push("no docs/decisions.md"); return info; }
  const text = fs.readFileSync(log, "utf8");
  info.track = (text.match(/^Track:\s*(\w+)/m) || [])[1] || "?";
  let legacy = -1, m;
  for (const line of text.split("\n")) {
    if ((m = line.match(/· phase (\d) [\w-]+ · done/))) info.done.add(Number(m[1]));
    else if ((m = line.match(/· phase (\d) [\w-]+ · blocked:?\s*(.*)$/))) info.blocked = { n: Number(m[1]), why: m[2] };
    else if ((m = line.match(/· stage (\d) [\w-]+ · done/))) legacy = Math.max(legacy, Number(m[1]));
    else if ((m = line.match(/· gate (\d) · approved/))) info.gates.add(Number(m[1]));
  }
  const has = (f) => fs.existsSync(path.join(dir, f));
  for (const p of PHASES) {
    const files = p.leaves.every(has);
    if (!info.done.has(p.n) && legacy >= p.legacy && files) info.done.add(p.n);
    else if (info.done.has(p.n) && !files) info.problems.push(`phase ${p.n} ${p.name} is logged done but ${p.leaves.filter((f) => !has(f)).join(", ")} is missing`);
    else if (legacy >= p.legacy && !files) info.carry = (info.carry || []).concat(`phase ${p.n} ${p.name}: old pipeline finished it, but ${p.leaves.filter((f) => !has(f)).join(", ")} doesn't exist yet`);
  }
  info.next = PHASES.find((p) => !info.done.has(p.n)) || null;
  if (info.blocked && info.done.has(info.blocked.n)) info.blocked = null;
  const prev = info.next && PHASES[info.next.n - 1];
  if (info.track === "client" && prev && prev.gate && !info.gates.has(prev.gate)) info.waiting = `Gate ${prev.gate}: client approval of ${GATES[prev.gate]}`;
  return info;
}

const sitesDir = path.join(root, "sites");
const all = fs.existsSync(sitesDir) ? fs.readdirSync(sitesDir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name).sort() : [];
const want = process.argv[2];
if (!want) {
  if (!all.length) console.log("No sites yet. Start one: npm run new-site -- <name> --own|--client");
  for (const s of all) { const i = read(s); console.log(`${s.padEnd(26)} ${i.track.padEnd(6)} ${i.next ? `next: phase ${i.next.n} ${i.next.name}` : "all phases done"}${i.blocked ? "  BLOCKED" : ""}${i.problems.length ? `  (${i.problems.length} problem${i.problems.length > 1 ? "s" : ""})` : ""}`); }
  process.exit(0);
}
if (!all.includes(want)) { console.error(`No site "${want}". Sites: ${all.join(", ") || "none"}`); process.exit(1); }
const i = read(want);
console.log(`${i.name} (${i.track} track)`);
for (const p of PHASES) console.log(`  ${i.done.has(p.n) ? "done" : i.next && i.next.n === p.n ? "NEXT" : "    "}  ${p.n} ${p.name}`);
for (const c of i.carry || []) console.log(`Carry-over: ${c}`);
for (const p of i.problems) console.log(`Problem: ${p}`);
if (i.blocked) console.log(`Blocked at phase ${i.blocked.n}: ${i.blocked.why}`);
if (i.waiting) console.log(`Waiting on ${i.waiting}`);
const cap = path.join(root, "system", "capabilities.json");
if (fs.existsSync(cap)) { const r = JSON.parse(fs.readFileSync(cap, "utf8")).rungs; console.log(`Art rungs open: ${Object.keys(r).filter((k) => r[k].open).join(", ")}`); }
else console.log("No system/capabilities.json yet: run npm run probe");
console.log(i.next ? `\nNext: phase ${i.next.n} ${i.next.name} → read .claude/skills/award-site/references/phases/${i.next.n}-${i.next.name}.md` : `\nAll phases done. When award scores arrive: /award-site learn ${i.name}`);
