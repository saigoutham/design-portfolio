#!/usr/bin/env node
// UserPromptSubmit hook: one line per active site so the plan survives context resets.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../../..");
const sitesDir = path.join(root, "sites");
if (!fs.existsSync(sitesDir)) process.exit(0);
const lines = [];
for (const s of fs.readdirSync(sitesDir)) {
  if (!fs.existsSync(path.join(sitesDir, s, "docs/state.json"))) continue;
  let out = ""; try { out = execFileSync("node", [path.join(here, "phase.mjs"), s], { encoding: "utf8" }); } catch (e) { out = e.stdout || ""; }
  const head = out.split("\n")[0];
  const steps = out.split("\n").filter((l) => /^\s+\[( |x)\]/.test(l));
  const open = steps.filter((l) => l.includes("[ ]") && !/optional|client only/.test(l));
  lines.push(`${head} · ${steps.length - open.length}/${steps.length} steps · next: ${open[0] ? open[0].trim().slice(4) : "npm run phase -- " + s + " done"}`);
}
if (lines.length) console.log("award-site state (from npm run phase; follow it, don't skip steps):\n" + lines.join("\n"));
