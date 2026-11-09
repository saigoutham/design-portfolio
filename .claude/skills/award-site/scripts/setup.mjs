#!/usr/bin/env node
// award-site setup: checks prerequisites and installs pinned skills from skills.lock.json.
//
//   node .claude/skills/award-site/scripts/setup.mjs                 check prerequisites and what's installed
//   node .claude/skills/award-site/scripts/setup.mjs --with 3d,video install on-demand packs
//   node .claude/skills/award-site/scripts/setup.mjs --remove 3d     uninstall packs (each installed skill costs context; --with puts them back from the pin)
//   node .claude/skills/award-site/scripts/setup.mjs --vendor        re-copy committed skills from their pinned commits (maintainers)
//
// Packs: research, taste, 3d, video, library, ui, marketing, council, compress, manim, blender, gstack, rea.
// Everything is fetched at the exact commit pinned in skills.lock.json, never "latest".

import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

function findRoot(start) {
  let dir = start;
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, "skills.lock.json"))) return dir;
    dir = path.dirname(dir);
  }
  return null;
}

const root = findRoot(process.cwd()) || findRoot(here);
if (!root) {
  console.error("Can't find skills.lock.json. Run this from inside the design-portfolio repo.");
  process.exit(1);
}
const lock = JSON.parse(fs.readFileSync(path.join(root, "skills.lock.json"), "utf8"));
const cacheRoot = path.join(process.env.AWARD_SITE_CACHE || path.join(os.homedir(), ".cache", "award-site"), "src");

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const listArg = (name) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1].split(",").map((s) => s.trim()).filter(Boolean) : [];
};
const withArg = listArg("--with");
const removeArg = listArg("--remove");

const sh = (cmd, opts = {}) => execSync(cmd, { stdio: ["ignore", "pipe", "pipe"], encoding: "utf8", ...opts }).trim();
const has = (cmd) => {
  try { sh(`command -v ${cmd}`); return true; } catch { return false; }
};

function fetchSource(repo) {
  const src = lock.sources[repo];
  if (!src) throw new Error(`No pinned commit for ${repo} in skills.lock.json`);
  const dir = path.join(cacheRoot, repo.replace("/", "__"), src.commit);
  if (fs.existsSync(path.join(dir, ".git"))) return dir;
  fs.mkdirSync(dir, { recursive: true });
  const url = `https://github.com/${repo}.git`;
  sh(`git init -q && git remote add origin ${url} && git fetch -q --depth 1 origin ${src.commit} && git checkout -q FETCH_HEAD`, { cwd: dir });
  return dir;
}

function copyLicence(srcRoot, dest) {
  const hasOwn = fs.readdirSync(dest).some((f) => /^(licen[cs]e|copying)/i.test(f));
  if (hasOwn) return;
  for (const f of fs.readdirSync(srcRoot)) {
    if (/^(licen[cs]e|notice)(\.md|\.txt)?$/i.test(f) && fs.statSync(path.join(srcRoot, f)).isFile()) {
      fs.copyFileSync(path.join(srcRoot, f), path.join(dest, f));
    }
  }
}

function install(item, destDir) {
  const srcRoot = fetchSource(item.source);
  fs.rmSync(destDir, { recursive: true, force: true });
  const paths = item.paths || [item.path];
  if (paths.length === 1 && fs.statSync(path.join(srcRoot, paths[0])).isFile() && !item.paths) {
    fs.mkdirSync(path.dirname(destDir), { recursive: true });
    fs.copyFileSync(path.join(srcRoot, paths[0]), destDir);
    return;
  }
  fs.mkdirSync(destDir, { recursive: true });
  for (const p of paths) {
    const from = path.join(srcRoot, p);
    const to = item.paths ? path.join(destDir, path.basename(p)) : destDir;
    fs.cpSync(from, to, { recursive: true });
  }
  copyLicence(srcRoot, destDir);
}

const skillDir = (name) => path.join(root, ".claude", "skills", name);
const agentFile = (name) => path.join(root, ".claude", "agents", `${name}.md`);
const libDir = (name) => path.join(root, "library", name);

function vendorAll() {
  for (const s of lock.skills.filter((s) => s.mode === "vendored")) { install(s, skillDir(s.name)); console.log(`vendored skill   ${s.name}`); }
  for (const a of lock.agents.filter((a) => a.mode === "vendored")) { install(a, agentFile(a.name)); console.log(`vendored agent   ${a.name}`); }
  for (const l of lock.library.filter((l) => l.mode === "vendored")) { install(l, libDir(l.name)); console.log(`vendored library ${l.name}`); }
}

function installPacks(packs) {
  for (const pack of packs) {
    if (pack === "library") {
      for (const l of lock.library.filter((l) => l.mode === "fetch")) { install(l, libDir(l.name)); console.log(`fetched library  ${l.name}`); }
      continue;
    }
    const ext = lock.external.find((e) => e.pack === pack);
    if (ext) {
      if (pack === "gstack" && has("bun")) {
        execSync(ext.how, { cwd: root, stdio: "inherit", shell: "/bin/bash" });
      } else {
        console.log(`${ext.name}: install manually (needs ${ext.needs || "its own CLI"}):\n  ${ext.how}`);
      }
      continue;
    }
    const items = lock.skills.filter((s) => s.pack === pack);
    const agents = lock.agents.filter((a) => a.pack === pack);
    if (!items.length && !agents.length) { console.log(`Unknown pack: ${pack}`); continue; }
    for (const s of items) { install(s, skillDir(s.name)); console.log(`installed ${pack.padEnd(8)} ${s.name}`); }
    for (const a of agents) install(a, agentFile(a.name));
    if (agents.length) console.log(`installed ${pack.padEnd(8)} ${agents.length} agents`);
  }
}

function removePacks(packs) {
  for (const pack of packs) {
    if (pack === "library") {
      for (const l of lock.library.filter((l) => l.mode === "fetch")) { fs.rmSync(libDir(l.name), { recursive: true, force: true }); console.log(`removed library  ${l.name}`); }
      continue;
    }
    const items = lock.skills.filter((s) => s.pack === pack);
    const agents = lock.agents.filter((a) => a.pack === pack);
    if (!items.length && !agents.length) { console.log(`Unknown or external pack: ${pack} (remove it by hand)`); continue; }
    for (const s of items) { fs.rmSync(skillDir(s.name), { recursive: true, force: true }); console.log(`removed ${pack.padEnd(8)} ${s.name}`); }
    for (const a of agents) fs.rmSync(agentFile(a.name), { force: true });
    if (agents.length) console.log(`removed ${pack.padEnd(8)} ${agents.length} agents`);
  }
}

function version(cmd) {
  try { return sh(cmd).split("\n")[0]; } catch { return null; }
}

function check() {
  const rows = [
    ["node 20+", version("node --version"), "needed for every site"],
    ["npm", version("npm --version"), "needed for every site"],
    ["git", version("git --version"), "needed for setup"],
    ["python3", version("python3 --version"), "ui-ux-pro-max search, Scrapling"],
    ["ffmpeg", version("ffmpeg -version"), "scroll-scrubbed video encoding (scroll-craft encode.sh)"],
    ["bun", version("bun --version"), "optional: gstack"],
  ];
  console.log("Prerequisites");
  for (const [name, v, why] of rows) console.log(`  ${v ? "ok " : "-- "} ${name.padEnd(9)} ${v || "missing"}  (${why})`);

  const missing = (list, where) => list.filter((x) => !fs.existsSync(where(x.name)));
  const vSkills = missing(lock.skills.filter((s) => s.mode === "vendored"), skillDir);
  const vAgents = missing(lock.agents.filter((a) => a.mode === "vendored"), agentFile);
  const vLib = missing(lock.library.filter((l) => l.mode === "vendored"), libDir);
  console.log(`\nCommitted skills: ${lock.skills.filter((s) => s.mode === "vendored").length - vSkills.length} present${vSkills.length ? `, missing: ${vSkills.map((s) => s.name).join(", ")}` : ""}`);
  console.log(`Agents: ${vAgents.length ? `missing ${vAgents.map((a) => a.name).join(", ")}` : "all present"}`);
  console.log(`Library: ${vLib.length ? `missing ${vLib.map((l) => l.name).join(", ")}` : "all present"}`);

  const packs = [...new Set(lock.skills.filter((s) => s.pack).map((s) => s.pack))];
  console.log("\nOn-demand packs (npm run setup -- --with <pack>)");
  for (const p of packs) {
    const items = lock.skills.filter((s) => s.pack === p);
    const agents = lock.agents.filter((a) => a.pack === p);
    const n = items.filter((s) => fs.existsSync(skillDir(s.name))).length;
    console.log(`  ${n === items.length ? "on " : "off"} ${p.padEnd(9)} ${items.map((s) => s.name).join(", ")}${agents.length ? ` + ${agents.length} agents` : ""}`);
  }
  const mot = fs.existsSync(libDir("motionsites"));
  console.log(`  ${mot ? "on " : "off"} library   MotionSites examples, rubric and spec template`);
  for (const e of lock.external) console.log(`  ext ${e.pack.padEnd(9)} ${e.name}: ${e.used_for}`);
  if (vSkills.length || vAgents.length || vLib.length) console.log("\nSomething committed is missing. Run: npm run setup -- --vendor");
}

if (flag("--help") || flag("-h")) {
  const lines = fs.readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n").slice(1);
  console.log(lines.slice(0, lines.findIndex((l) => !l.startsWith("//"))).join("\n").replace(/^\/\/ ?/gm, ""));
} else if (flag("--vendor")) {
  vendorAll();
} else if (withArg.length || removeArg.length) {
  if (removeArg.length) removePacks(removeArg);
  if (withArg.length) installPacks(withArg);
} else {
  check();
}
