#!/usr/bin/env node
// award-site: which ways of getting art are open today -> system/capabilities.json (phase 0, step s2).
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../../..");
const has = (c) => { try { execSync(`command -v ${c}`, { stdio: "ignore" }); return true; } catch { return false; } };
const reach = (url) => { try { execSync(`curl -s -o /dev/null -m 8 -w "%{http_code}" ${url}`, { encoding: "utf8" }).trim(); return execSync(`curl -s -o /dev/null -m 8 -w "%{http_code}" ${url}`, { encoding: "utf8" }).trim().startsWith("2"); } catch { return false; } };
const caps = {
  date: new Date().toISOString().slice(0, 10),
  code: { open: true, note: "three.js/R3F, shaders, canvas, SVG, GSAP; always the first rung" },
  generated: { open: !!process.env.REPLICATE_API_TOKEN, note: process.env.REPLICATE_API_TOKEN ? "REPLICATE_API_TOKEN set" : "no image API key; the user can generate stills on their phone (rung: supplied)" },
  sourced: { open: reach("https://www.pexels.com") || reach("https://unsplash.com"), note: "stock sites reachable from the workspace" },
  rendered: { open: has("blender"), note: has("blender") ? "blender installed" : "no blender" },
  supplied: { open: true, note: "the user's own files and generated stills, used as materials on coded geometry" },
  film: { open: has("ffmpeg") && fs.existsSync("/usr/bin/google-chrome"), note: "hyperframes render (software GL is slow: ~15 s per film second with 3D)" },
};
fs.mkdirSync(path.join(root, "system"), { recursive: true });
fs.writeFileSync(path.join(root, "system/capabilities.json"), JSON.stringify(caps, null, 2) + "\n");
for (const [k, v] of Object.entries(caps)) if (k !== "date") console.log(`${v.open ? "open  " : "closed"} ${k}: ${v.note}`);
