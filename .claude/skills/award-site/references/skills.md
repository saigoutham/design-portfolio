# Skills: what's installed, what's a pack, what was retired

Pinned in `skills.lock.json`. `npm run setup` shows what's on. Install with `--with <pack>`, remove with `--remove <pack>`, strip to the core with `--prune`.

## Core (always installed, 14)
brainstorming, writing-plans, subagent-driven-development, verification-before-completion, systematic-debugging, impeccable, gsap-core, gsap-timeline, gsap-scrolltrigger, gsap-react, review-animations, jury, visual-verdict, cavecrew (plus its three agents) and award-site itself.

## Libraries in every site (npm, not skills)
GSAP, Lenis, and Astryx (`@astryxdesign/core`, Meta, MIT): accessible UI components themed from DESIGN.md. Its CLI is the agent's reference (`search`, `component`, `docs`). Scope: interface pieces only; the hero, art and signature move are bespoke, so sites don't share a component look.

## Packs
| Pack | Skills | Phase |
|---|---|---|
| taste | design-taste-frontend | 3, 4 |
| video | hyperframes | 2 (motion proofs), 3, 5 |
| library | MotionSites examples and rubric (scroll-craft is always present) | 2 |
| copy | copywriting, copy-editing, product-marketing | 4 |
| motion | choreograph, emil-design-eng, animation-performance, gsap-plugins, gsap-utils, gsap-performance | 3, 4 when needed |
| 3d | the eleven r3f skills | only for live WebGL |
| imagegen | prompt-images, run-models (Replicate) | 2, 4 when a key exists |
| scrape | scrapling-official | 2, 4 for sourcing free-licence media |
| seo | seo-audit, ai-seo, schema | 5 |
| dev | test-driven-development, using-git-worktrees, finishing-a-development-branch | 4 |

## Retired in v4 (restore with `--with retired`)
| Skill | Why |
|---|---|
| ui-ux-pro-max, design-system | Proposed a black-and-gold luxury system for a fruit soda twice. Design values now come from impeccable and the art itself. |
| grilling, grill-me | The brief is one message now. |
| minimal-prose-discipline, ponytail, find-skills, caveman-compress | Their one useful rule each is written into SKILL.md. |
| last30days | Needs API keys the workspace doesn't have; web search does the job. |
| remotion-*, manim-*, gsap-frameworks | Never ran. HyperFrames covers film; every site is React. |
| gstack, council, REA, elaya, bencho | Planned in v3, never ran or never installed. |

Rule for adding one back: it must have run on a real site and changed the result.
