#!/usr/bin/env node
// award-site: where every site stands. One line per site; detail comes from `npm run phase -- <site>`.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../../..");
const only = process.argv[2];
if (only) { try { process.stdout.write(execFileSync("node", [path.join(here, "phase.mjs"), only], { encoding: "utf8" })); } catch (e) { process.stdout.write(e.stdout || ""); } process.exit(0); }
const sites = fs.existsSync(path.join(root, "sites")) ? fs.readdirSync(path.join(root, "sites")).filter((s) => fs.statSync(path.join(root, "sites", s)).isDirectory()) : [];
for (const s of sites) {
  if (!fs.existsSync(path.join(root, "sites", s, "docs/state.json"))) { console.log(`${s}: no phase set. Run: npm run phase -- ${s} start <n>`); continue; }
  let out = ""; try { out = execFileSync("node", [path.join(here, "phase.mjs"), s], { encoding: "utf8" }); } catch (e) { out = e.stdout || ""; }
  const steps = out.split("\n").filter((l) => /^\s+\[( |x)\]/.test(l)), open = steps.filter((l) => l.includes("[ ]") && !/optional|client only/.test(l));
  console.log(`${out.split("\n")[0]} · ${steps.length - open.length}/${steps.length} · next: ${open[0] ? open[0].trim().slice(4) : "phase done"}`);
}
