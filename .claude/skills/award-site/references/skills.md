# Skills, agents and library, by stage

Everything is pinned in `skills.lock.json` at the repo root. "Committed" means it's in this repo and works on a fresh clone. A pack is installed on demand with `npm run setup -- --with <pack>`.

| Skill or file | From | How it gets here | Used at |
|---|---|---|---|
| brainstorming, writing-plans, subagent-driven-development, verification-before-completion | obra/superpowers | committed | 1, 3 · 6 · 7 · every stage end |
| systematic-debugging, test-driven-development, using-git-worktrees, finishing-a-development-branch | obra/superpowers | committed | 7, when a task needs them |
| grilling (grill-me calls it) | mattpocock/skills | committed | 1 |
| find-skills | vercel-labs/skills | committed | 1 (gap check) |
| last30days | mvanhorn/last30days-skill | pack `research` | 2 |
| scrapling-official | D4Vinci/Scrapling | committed | 2 |
| REA | its own CLI | pack `rea` (manual) | 2, notes only |
| ui-ux-pro-max, design-system | nextlevelbuilder/ui-ux-pro-max-skill | committed | 4 (the source of design values) |
| design-taste-frontend | Leonxlnx/taste-skill | pack `taste` | 4, as a check only |
| impeccable | pbakaus/impeccable | committed | 8 (reads PRODUCT.md, DESIGN.md) |
| emil-design-eng, choreograph | emilkowalski/skill | committed | 4 hero, 7 |
| review-animations, animation-performance | emilkowalski/skill | committed | 8 |
| gsap-* (8 skills) | greensock/gsap-skills | committed | 4 hero, 7 |
| r3f-* (11 skills) | enzed/r3f-skills | pack `3d` | 4 hero, 5, 7 when the world is 3D |
| ponytail | DietrichGebert/ponytail | committed | 7, plumbing only |
| schema, ai-seo, seo-audit | coreyhaines31/marketingskills | committed | 7 · 8 |
| visual-verdict | Yeachan-Heo/oh-my-claudecode | committed | 8 (hero fidelity) |
| minimal-prose-discipline | Yeachan-Heo/oh-my-claudecode | committed | every handoff to the user |
| cavecrew + 3 agents | JuliusBrussee/caveman | committed | 7, 8 (small jobs, compressed reports) |
| caveman-compress | JuliusBrussee/caveman | pack `compress` | optional: shrink a long site CLAUDE.md |
| jury | juliobsz/skills | committed | 8 (blind critic) |
| hyperframes | heygen-com/hyperframes | pack `video` | 5 motion clips, 9 case study |
| remotion-best-practices, remotion-license | remotion-dev/skills | pack `video` (no licence published, so not committed) | 5, 9 |
| manimce-best-practices, manim-composer | adithya-s-k/manim_skill | pack `manim` | 9, optional explainer of the signature move |
| plan-design-review, qa-only | garrytan/gstack | pack `gstack` (needs Bun) | 6 · 8, optional |

| Library | How it gets here | Used at |
|---|---|---|
| scroll-craft | committed | 1 brief, 2 approved collection, 3 feel and uniqueness, 4 worlds, hero depth and taste, 5 assets and encode.sh, 7 devices, 8 shoot.mjs |
| elaya (landing-page-design, figma-designer) | committed | 1 intake, 4 visual rules, 5 copy, 6 structure and conversion |
| bencho | committed (free MIT blocks and sounds) | 7 |
| motionsites | pack `library` (examples and media are © MotionSites) | 2 examples, 3 techniques, 6 spec template, 8 rubric |

## Looked at and left out
- **oh-my-claudecode's orchestration** (autopilot, ralph, team, its hooks): a second orchestrator would compete with Superpowers. Only two standalone skills are used.
- **caveman voice for the user:** your updates stay in plain sentences; caveman is for agent-to-agent reports.
- **Agent Reach** (flagged as suspicious on ClawHub), **OpenSEO** (needs its own server), **kie.ai** (ruled out), **juliobsz/awwwards** (a competing pipeline).
