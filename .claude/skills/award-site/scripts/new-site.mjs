#!/usr/bin/env node
// award-site: create a new site.
//
//   npm run new-site -- <site> --client|--own [--repo <git url or path>] [--3d] [--no-install]
//
// Default: sites/<site>/ inside design-portfolio. With --repo, the site lives in that repo
// (cloned next to design-portfolio if it's a URL) and sites/<site>.md points to it.
// Shared logs (system/) always stay in design-portfolio.

import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
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
if (!root) fail("Can't find the design-portfolio root (skills.lock.json). Run this from inside the repo.");

const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const site = args.find((a, i) => !a.startsWith("--") && args[i - 1] !== "--repo");
const track = args.includes("--client") ? "client" : args.includes("--own") ? "own" : null;
const repo = opt("--repo");
const want3d = args.includes("--3d");
const install = !args.includes("--no-install");

function fail(msg) {
  console.error(`new-site: ${msg}`);
  process.exit(1);
}
const run = (cmd, cwd) => execSync(cmd, { cwd, stdio: ["ignore", "pipe", "inherit"], encoding: "utf8" });
const today = new Date().toISOString().slice(0, 10);

if (!site) fail("give the site a name, e.g. npm run new-site -- halli-roasters --client");
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(site)) fail(`"${site}" isn't a valid slug: lowercase words joined by hyphens`);
if (!track) fail("say which track: --client (gates and a proposal) or --own (no gates)");

const sitesDir = path.join(root, "sites");
fs.mkdirSync(sitesDir, { recursive: true });
if (fs.existsSync(path.join(sitesDir, site)) || fs.existsSync(path.join(sitesDir, `${site}.md`))) {
  fail(`a site called "${site}" already exists in sites/`);
}

// Where the site lives.
let target;
let repoLine = `design-portfolio/sites/${site}`;
if (repo) {
  if (fs.existsSync(repo) && fs.statSync(repo).isDirectory()) {
    target = path.resolve(repo);
  } else {
    const name = path.basename(repo).replace(/\.git$/, "");
    target = path.join(path.dirname(root), name);
    if (!fs.existsSync(target)) {
      console.log(`Cloning ${repo} into ${target}`);
      run(`git clone ${JSON.stringify(repo)} ${JSON.stringify(target)}`);
    }
  }
  repoLine = repo;
} else {
  target = path.join(sitesDir, site);
}
fs.mkdirSync(target, { recursive: true });

// Scaffold Next.js in a temp folder, then copy in without overwriting anything already there.
if (!fs.existsSync(path.join(target, "package.json"))) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "award-site-"));
  console.log("Scaffolding Next.js (App Router, TypeScript, Tailwind, src/)...");
  run(
    'npx --yes create-next-app@latest app --ts --tailwind --app --eslint --src-dir --import-alias "@/*" --use-npm --disable-git --skip-install --yes',
    tmp
  );
  const app = path.join(tmp, "app");
  for (const entry of fs.readdirSync(app)) {
    const to = path.join(target, entry);
    if (!fs.existsSync(to)) fs.cpSync(path.join(app, entry), to, { recursive: true });
  }
  fs.rmSync(tmp, { recursive: true, force: true });
  const pkgPath = path.join(target, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  pkg.name = site;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
}
if (!repo && fs.existsSync(path.join(target, ".git"))) fs.rmSync(path.join(target, ".git"), { recursive: true, force: true });

if (install) {
  const deps = ["gsap", "@gsap/react", "lenis"];
  if (want3d) deps.push("three", "@react-three/fiber", "@react-three/drei", "@react-three/postprocessing");
  console.log(`Installing ${deps.join(", ")}...`);
  run(`npm install --no-audit --no-fund && npm install --no-audit --no-fund ${deps.join(" ")}`, target);
} else {
  console.log("Skipped npm install (--no-install). Run npm install in the site folder before building.");
}

// Context skeleton.
fs.mkdirSync(path.join(target, "docs"), { recursive: true });
const title = site.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
const writeNew = (rel, text) => {
  const p = path.join(target, rel);
  if (!fs.existsSync(p)) fs.writeFileSync(p, text);
};
writeNew(
  "docs/decisions.md",
  `# ${title}: decisions\n\nTrack: ${track}\nRepo: ${repoLine}\n\n## Stage log\n- ${today} · stage 0 setup · done\n\n## Decisions\n- ${today} · Created with ${want3d ? "3D dependencies" : "no 3D dependencies yet"}.\n`
);
writeNew(
  "CLAUDE.md",
  `# ${title}\n\nA ${track === "client" ? "client" : "personal concept"} site built with the award-site pipeline${repo ? " (system files live in design-portfolio)" : ""}.\nStart every session with \`/award-site status ${site}\`; it reports the stage and the next step.\n\nContext, read only when the current stage needs it: PRODUCT.md, DESIGN.md, docs/brief.md, docs/research.md, docs/concept.md, docs/assets.md, docs/spec.md, docs/qa.md. Decisions and the stage log: docs/decisions.md.\n`
);

if (repo) {
  fs.writeFileSync(
    path.join(sitesDir, `${site}.md`),
    `# ${site}\nRepo: ${repo}\nLocal: ${path.relative(root, target) || "."}\nTrack: ${track}\n`
  );
}

// Planned fingerprint row.
const fpPath = path.join(root, "system", "FINGERPRINTS.md");
if (fs.existsSync(fpPath)) {
  const lines = fs.readFileSync(fpPath, "utf8").split("\n");
  const header = lines.findIndex((l) => l.startsWith("| Site |"));
  if (header >= 0) {
    let end = header + 2;
    while (end < lines.length && lines[end].startsWith("|")) end++;
    lines.splice(end, 0, `| ${site} | planned | planned | planned | planned | planned | planned | planned | planned |`);
    fs.writeFileSync(fpPath, lines.join("\n"));
  }
}

const rel = path.relative(root, target);
console.log(`\nCreated ${site} (${track} track) at ${rel.startsWith("..") ? target : rel}`);
console.log(`Next: stage 1, Intake. Run /award-site next ${site}`);
