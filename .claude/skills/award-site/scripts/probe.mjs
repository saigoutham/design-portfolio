#!/usr/bin/env node
// award-site probe: what art can this workspace actually make or fetch, right now?
// Writes system/capabilities.json and prints the open rungs of the art ladder (references/art.md).
// Run at phase 0 and again whenever the workspace changes: npm run probe
import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

let root = process.cwd();
while (root !== path.dirname(root) && !fs.existsSync(path.join(root, "skills.lock.json"))) root = path.dirname(root);
const sh = (c) => { try { return execSync(c, { stdio: ["ignore", "pipe", "ignore"], encoding: "utf8", timeout: 20000 }).trim(); } catch { return ""; } };
const reach = (url) => /^[23]\d\d$/.test(sh(`curl -s -o /dev/null -w "%{http_code}" --max-time 8 -L "${url}"`));

const keys = ["REPLICATE_API_TOKEN", "FAL_KEY", "GEMINI_API_KEY", "OPENAI_API_KEY"].filter((k) => process.env[k]);
const net = {
  unsplash: reach("https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=64"),
  pexels: reach("https://www.pexels.com/robots.txt"),
  mixkit: reach("https://mixkit.co/robots.txt"),
  wikimedia: reach("https://commons.wikimedia.org/robots.txt"),
  polyhaven: reach("https://api.polyhaven.com/types"),
  replicate: reach("https://api.replicate.com/"),
};
const tools = {
  ffmpeg: !!sh("command -v ffmpeg"),
  blender: !!sh(`python3 -c "import bpy;print(1)"`),
  gpu: !!sh("command -v nvidia-smi") && !!sh("nvidia-smi -L"),
  cores: os.cpus().length,
  chromium: !!sh("ls ~/.cache/ms-playwright 2>/dev/null | grep -i chromium"),
  rembg: !!sh(`python3 -c "import rembg;print(1)"`),
};
const sourced = Object.entries(net).filter(([k, v]) => v && k !== "replicate").map(([k]) => k);
const rungs = {
  code: { open: true, note: "type, shaders, particles, generative and data visuals; HyperFrames renders them to film" },
  generated: { open: keys.length > 0 && (net.replicate || keys.some((k) => k !== "REPLICATE_API_TOKEN")), note: keys.length ? `keys: ${keys.join(", ")}` : "no image API key in this workspace (set REPLICATE_API_TOKEN, then: npm run setup -- --with imagegen)" },
  sourced: { open: sourced.length > 0, note: sourced.length ? `reachable: ${sourced.join(", ")}` : "no free-licence media site is reachable from here; the user downloads the files" },
  rendered: { open: tools.blender, note: tools.blender ? (tools.gpu ? "Blender with GPU" : `Blender on ${tools.cores} CPU cores: hard-surface stills only (can, glass, pack); never an organic hero, never a long sequence`) : "no Blender" },
  supplied: { open: true, note: "files from the user or client; always the fallback" },
};
const out = { checked: new Date().toISOString().slice(0, 10), keys, net, tools, rungs };
fs.mkdirSync(path.join(root, "system"), { recursive: true });
fs.writeFileSync(path.join(root, "system", "capabilities.json"), JSON.stringify(out, null, 2) + "\n");
console.log("Art ladder in this workspace (system/capabilities.json)");
for (const [k, v] of Object.entries(rungs)) console.log(`  ${v.open ? "open  " : "closed"} ${k.padEnd(10)} ${v.note}`);
console.log(`Tools: ffmpeg ${tools.ffmpeg ? "ok" : "missing"}, browser ${tools.chromium ? "ok" : "missing"}, background removal ${tools.rembg ? "ok" : "missing (pip install rembg)"}`);
