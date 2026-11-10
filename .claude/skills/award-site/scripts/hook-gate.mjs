#!/usr/bin/env node
// PreToolUse hook: before a file is sent or published, ask phase.mjs whether it would skip a step.
// Exit 2 blocks the tool call and shows the reason to Claude. Allowed through: files outside sites/,
// and sends whose caption starts with "Below the floor:" (the user asked to see failing work).
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
let raw = ""; for await (const c of process.stdin) raw += c;
let input = {}; try { input = JSON.parse(raw).tool_input || {}; } catch { process.exit(0); }
if (typeof input.caption === "string" && input.caption.trim().startsWith("Below the floor:")) process.exit(0);

const paths = [];
const walk = (v) => { if (typeof v === "string") paths.push(v); else if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === "object") Object.values(v).forEach(walk); };
walk(input.files); walk(input.path);
const bySite = {};
for (const p of paths) { const m = p.match(/(?:^|\/)sites\/([^/]+)\//); if (m) (bySite[m[1]] ||= []).push(p); }
for (const [site, files] of Object.entries(bySite)) {
  try { execFileSync("node", [path.join(here, "phase.mjs"), site, "guard", ...files], { stdio: ["ignore", "pipe", "pipe"] }); }
  catch (e) { if (e.status === 2) { process.stderr.write(e.stderr.toString()); process.exit(2); } }
}
process.exit(0);
