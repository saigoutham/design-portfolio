#!/usr/bin/env node
// Usage: npm run gate -- <site> <gate>. Exits 1 and lists what is missing when a visual isn't ready to show.
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
const [site, gate] = process.argv.slice(2);
if (!site || !gate) { console.error("usage: npm run gate -- <site> <gate>"); process.exit(2); }
const gates = JSON.parse(readFileSync(new URL("../references/gates.json", import.meta.url)));
const g = gates[gate]; if (!g) { console.error(`unknown gate: ${gate}`); process.exit(2); }
const root = join("sites", site);
const log = existsSync(join(root, "docs/decisions.md")) ? readFileSync(join(root, "docs/decisions.md"), "utf8") : "";
const ranLines = log.split("\n").filter((l) => /\bran\b/.test(l));
const glob = (pat) => {
  const dir = join(root, dirname(pat)), re = new RegExp("^" + pat.split("/").pop().replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$");
  return existsSync(dir) ? readdirSync(dir).filter((f) => re.test(f)).map((f) => join(dir, f)) : [];
};
const missing = [];
for (const s of g.skills) if (!ranLines.some((l) => l.includes(s))) missing.push(`skill not logged as ran: ${s}`);
for (const f of g.files) { const n = glob(f.glob).length; if (n < f.min) missing.push(`${f.glob}: ${n}/${f.min} (${f.why})`); }
if (g.pass) {
  const n = glob(g.pass.glob).filter((f) => readFileSync(f, "utf8").includes(g.pass.pattern)).length;
  if (n < g.pass.min) missing.push(`${g.pass.pattern} in ${g.pass.glob}: ${n}/${g.pass.min} (${g.pass.why})`);
}
if (missing.length) { console.log(`GATE ${gate} FAIL for ${site}. Don't show it. Missing:`); missing.forEach((m) => console.log(" - " + m)); process.exit(1); }
console.log(`GATE ${gate} PASS for ${site}.`);
