# design-portfolio

A design consultancy run by Claude, built to make websites that win awards (Awwwards, FWA, CSS Design Awards). Every site is a folder in this repo. One skill, **award-site**, runs each site through ten stages and hands you a recommended next step after every one.

```
0 Setup → 1 Intake → [Gate 1] → 2 Research → 3 Concept → 4 Direction + hero proof → [Gate 2]
→ 5 Assets → 6 Spec + plan → 7 Build → 8 Verify (builder loop, then blind jury) → 9 Launch + learn
```

Gates apply to client sites only. A site isn't submitted until a blind critic, one that never sees the code or the brief, scores it in the Site of the Day band (an estimate of 7.2 or more). Real award scores are logged against that estimate, and the lessons feed the next site.

## Set up

You need Node 20+, npm, git and python3. ffmpeg (full build) is needed only for scroll-scrubbed video, and Bun only for the optional gstack pack.

```bash
git clone https://github.com/saigoutham/design-portfolio.git
cd design-portfolio
npm run setup          # checks prerequisites and shows what's installed
```

Then open the folder in Claude Code (terminal, desktop, web or phone). Every skill and agent the pipeline uses is in `.claude/`, so it's available only inside this repo and nothing is installed globally.

Some skills are installed only when a stage needs them, to keep sessions lean. The stages do this for you, or by hand:

```bash
npm run setup -- --with research,library,taste   # stage 2 and 4 tools, MotionSites reference library
npm run setup -- --with 3d                        # React Three Fiber skills
npm run setup -- --with video                     # HyperFrames and Remotion
npm run setup -- --with compress,manim,gstack,rea # optional extras
```

## Use

In Claude Code, from the repo root:

| Say | What happens |
|---|---|
| `/award-site new halli-roasters --client` | Creates `sites/halli-roasters/` (Next.js, GSAP, Lenis) and starts the client interview |
| `/award-site new kaala --own --3d` | A concept site of your own, with 3D dependencies |
| `/award-site new acme --client --repo <git url>` | The site lives in its own repo; this repo keeps a pointer and the shared logs |
| `/award-site status` | Every site, its stage and what's blocking it |
| `/award-site next <site>` | Runs the next stage, then tells you what to do after |
| `/award-site jury <site>` | Blind Awwwards-style score of the current build |
| `/award-site learn <site>` | Logs real award scores and lessons |

The same scripts work without Claude: `npm run new-site -- <site> --client`, `npm run status`.

## What's where

| Path | What |
|---|---|
| `sites/<site>/` | One site: a Next.js app plus its context (PRODUCT.md, DESIGN.md, `docs/`) |
| `system/` | Shared across sites: fingerprint log (no two sites alike), jury calibration, lessons |
| `.claude/skills/award-site/` | The orchestrator: SKILL.md, one reference file per stage, scripts |
| `.claude/skills/`, `.claude/agents/` | Third-party skills and agents, pinned in `skills.lock.json` |
| `library/` | Reference material read at named stages: scroll-craft, elaya, Bencho blocks (and MotionSites, fetched by setup) |
| `skills.lock.json` | Every source, the exact commit it was read at, and its licence |

## Updating a skill

Every third-party file is pinned to a commit that was read before it went in. To update one, read what changed upstream, change its commit in `skills.lock.json`, then run `npm run setup -- --vendor` and review the diff before committing.

## Licences

Third-party skills keep their own licences; see [THIRD_PARTY.md](THIRD_PARTY.md). MotionSites' examples and media, and Remotion's skills, aren't redistributable, so they're downloaded by setup rather than committed.
