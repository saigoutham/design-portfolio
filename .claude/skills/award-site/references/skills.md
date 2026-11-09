# Capability registry

The one list of everything award-site can use: what it is, whether it's installed, whether it has ever run, where, why, what it costs, what it overlaps and what to do with it. `skills.lock.json` pins the commits; this file says how each one is used. Stage files name the skills for their steps; this registry must agree with them, and `npm run skills` checks that it does.

Don't load this file during stage work: the stage file is the menu. Read it to audit the system, to resolve a "conditional", or before adding or removing anything.

## At a glance

- **What I have:** 60 skills (award-site, 35 committed, 24 in packs), 21 agents (3 cavecrew committed, 18 council personas in a pack), 4 reference libraries, 3 external tools (Blender, gstack, REA), a `.council.yaml`, and the session's own tools (bottom of this file).
- **What's installed here:** `npm run skills`. On 9 Nov 2026: 50 of 60 (packs on: taste, research, 3d, ui; off: video, marketing, council, compress, manim).
- **What's used:** only a `skill` line in a site's `docs/decisions.md` counts (format in `templates.md`). `npm run skills` counts them. Before logging began on 9 Nov, 5 lines were backfilled, and only where a site's docs name both the skill and its output (find-skills and ui-ux-pro-max on both sites, Blender on robot-mammoth). The Ran column also notes weaker evidence that wasn't logged, such as interviews held without proof that brainstorming was loaded.
- **Loaded by default:** nothing except award-site itself. Every installed skill still puts its description in every session's skill list: about 4.3k tokens now, about 3.2k of it from committed skills. `npm run skills -- --all` lists the cost per skill.
- **Loaded conditionally:** the packs, and the rows marked Conditional below.
- **Duplicates:** grill-me (an alias of grilling); gsap-performance and animation-performance (partial overlap, different scopes); gstack design-motion and hyperframes (held back; hyperframes makes the films).
- **Unnecessary context:** design-taste-frontend (235 listing tokens for one stage 4 check: remove the taste pack after it); the 3d pack (561) when no 3D site is active; the gstack, council and marketing packs between uses. Packs come off with `npm run setup -- --remove <pack>`.
- **Remove, retain, replace:** nothing is proposed for removal. Every skill the user brought has a job in SKILL.md's skill plan, or a stated reason it's held back. Adding, removing or re-classing anything goes through the user.

## Classes

Core: the pipeline breaks without it. Conditional: loaded only for some sites (3D, product UI, client track, keys available). Specialist: one stage, every site. Reference-only: read, never run. Experimental: kept, never default. Redundant: overlaps something kept. Deprecated: no longer justified.

## Router

| Stage | Task | Load with the Skill tool | Only when | Read (library, evidence only) | Verify before moving on |
|---|---|---|---|---|---|
| 0 | scaffold the site | none (scripts) | caveman-compress (site CLAUDE.md past about 1k tokens) | | `npm run status` shows the site |
| 1 | interview, positioning, write the brief | brainstorming (in grilling's style), grilling, product-marketing | customer-research (client has customers to study); find-skills (a gap the registry doesn't cover) | elaya intake | PRODUCT.md with positioning, docs/brief.md; client track: gate 1 |
| 2 | research | content-strategy | last30days (API keys and network), scrapling-official (client track), REA | motionsites examples, scroll-craft approved collection, system/lessons.md | docs/research.md: observed, interpreted, recommended, with URLs and dates; 3 opportunities |
| 3 | concept | brainstorming, copywriting (messaging angle) | council (two concepts still close, costly to pick wrong) | scroll-craft feel and uniqueness, motionsites techniques | docs/concept.md with design intelligence, fingerprint differs on 4 of 6 |
| 4 | direction, hero proof, floor check | ui-ux-pro-max, design-system (tokens), design-taste-frontend (one check), writing-plans, subagent-driven-development, gsap-core, gsap-timeline, gsap-scrolltrigger, gsap-react, choreograph, emil-design-eng, review-animations, impeccable, visual-verdict, jury (critic brief), hyperframes | r3f-* (3D), blender (models), stageshow (product UI), council (floor failed 3 rounds and the direction is contested) | scroll-craft worlds, hero-depth, taste; elaya Part B; bencho sounds | MASTER.md, DESIGN.md, `floor pass` line, hero film |
| 5 | assets, copy | copywriting, copy-editing | hyperframes, remotion-best-practices and remotion-license, stageshow, blender, r3f-* | scroll-craft assets, elaya Part A, motionsites media | assets/, docs/assets.md manifest (source, licence, format, dimensions, weight, optimisation) |
| 6 | spec, plan | plan-design-review (gstack), writing-plans, plan-eng-review (gstack) | diagram (gstack); cro (conversion action) | motionsites spec template, elaya structure | docs/spec.md with testable acceptance criteria, the reviewed plan |
| 7 | build | freeze (gstack), subagent-driven-development, Playwright, axe-core and Lighthouse CI checks, gsap-core, gsap-timeline, gsap-scrolltrigger, gsap-react, choreograph, emil-design-eng, ponytail, schema, ai-seo, impeccable | r3f-*, stageshow, gsap-plugins, gsap-utils, gsap-performance, gsap-frameworks (non-React site only), systematic-debugging, test-driven-development, using-git-worktrees, finishing-a-development-branch, Context7 | scroll-craft devices, bencho blocks | each section's floor rows; the plan's tasks done |
| 8 | verify, blind jury | user-task tests (Playwright), then the primaries: visual-verdict, impeccable, review-animations, Lighthouse CI, axe-core, seo-audit, copy-editing; jury; verification-before-completion | design-review, benchmark, qa-only (gstack), animation-performance: second reviewers when triggered; cro (conversion action); cso (gstack; client sites that take input or data) | scroll-craft shoot.mjs, motionsites review.md | docs/qa.md with test results and reproducible failures, `jury · pass` |
| 9 | launch and learn | hyperframes, launch, social, canary (gstack), retro (gstack) | remotion-best-practices and remotion-license, stageshow (case-study frames), public-relations (client track), manim, analytics (measurable business objective) | | deploy, film, submissions logged, measurement plan, fingerprint row, lessons |
| every | handoffs, small jobs | minimal-prose-discipline; cavecrew-investigator (search), cavecrew-builder (edits of 2 files or fewer), cavecrew-reviewer (diff review); verification-before-completion | | | the handoff block |

## Registry

Cost has three tiers, measured, not assumed. **List** is what a skill's description costs in every session while it's installed. **Load** is its SKILL.md, paid only when it runs. **Refs** is reference text its steps open on demand. A subagent's own work costs the main session nothing; only its hand-back does. Ran: evidence up to 9 Nov 2026, before `skill` lines existed.

### Methodology (Superpowers outranks every other skill)

| Name | Source | Class | Why it's here | Stage | In → out | Depends on | Load / refs / list | Overlaps | Ran | Action |
|---|---|---|---|---|---|---|---|---|---|---|
| `award-site` | this repo | Core | the orchestrator and router | all | user request → stage run, handoff | the stage files, scripts | 2.7k / 10k / 190 | none | yes, both sites | retain |
| `brainstorming` | obra/superpowers | Core | the only interviewer | 1, 3 | user answers → brief, concept | none | 3.8k / 3.6k / 57 | grilling | interviews held on both sites, never logged | retain |
| `writing-plans` | obra/superpowers | Core | turns a spec into reviewable tasks | 4, 6 | spec → plan | subagent-driven-development (executing-plans is its other path and isn't pinned; award-site always takes the subagent path) | 2.6k / 0 / 25 | none | no | retain |
| `subagent-driven-development` | obra/superpowers | Core | parallel tracks, each reviewed before merge | 4, 7, floor | plan → reviewed commits | writing-plans, using-git-worktrees, finishing-a-development-branch | 4.9k / 7.8k / 25 | cavecrew (small jobs only) | no | retain; first real use is the stage 4 redo |
| `verification-before-completion` | obra/superpowers | Core | evidence before "done" | every stage end | claim → proof | none | 0.9k / 0 / 60 | floor check, jury | no | retain |
| `systematic-debugging` | obra/superpowers | Conditional | a bug survives one fix | 7 | failure → root cause | none | 2.4k / 3.1k / 26 | none | no | retain |
| `test-driven-development` | obra/superpowers | Conditional | logic-heavy tasks (forms, data), not motion | 7 | task → tested code | none | 2.4k / 2.1k / 23 | none | no | retain |
| `using-git-worktrees` | obra/superpowers | Conditional | isolates parallel tracks | 4, 7 | branch → worktree | subagent-driven-development | 1.7k / 0 / 53 | none | no | retain |
| `finishing-a-development-branch` | obra/superpowers | Conditional | merge or PR once a track passes | 7 | branch → merged | subagent-driven-development | 1.9k / 0 / 29 | none | no | retain |
| `grilling` | mattpocock/skills | Specialist | its style shapes every intake: push on vague answers, ask for examples | 1 | plan → hard questions | brainstorming stays the interviewer | 0.5k / 0 / 42 | brainstorming, council | no | retain |
| `grill-me` | mattpocock/skills | Redundant | an alias that calls grilling; the user named it | 1 | → grilling | grilling | 0.04k / 0 / 24 | grilling | no | retain (24 tokens) |
| `find-skills` | vercel-labs/skills | Specialist | gap check before research | 1 | brief → missing capability or none | none | 1.4k / 0 / 79 | this registry | yes: both sites, "no gaps" | retain |

### Design values and critique (ui-ux-pro-max outranks other design skills)

| Name | Source | Class | Why it's here | Stage | In → out | Depends on | Load / refs / list | Overlaps | Ran | Action |
|---|---|---|---|---|---|---|---|---|---|---|
| `ui-ux-pro-max` | nextlevelbuilder/ui-ux-pro-max-skill | Core | the single source of design values | 4 | concept → MASTER.md | python3 | 4.2k / 8.9k / 128 | design-system, design-taste-frontend | yes: both sites' MASTER.md | retain |
| `design-system` | nextlevelbuilder/ui-ux-pro-max-skill | Specialist | turns MASTER.md into primitive, semantic and component tokens (src/styles/tokens.css, mapped into Tailwind) without adding values | 4 | MASTER.md → tokens.css | ui-ux-pro-max | 1.9k / 9.1k / 82 | ui-ux-pro-max (same repo; it supplies the values, this structures them) | no | retain; first run at Diwali stage 4 |
| `design-taste-frontend` | Leonxlnx/taste-skill | Conditional | a check on the direction, never a source of values | 4 | DESIGN.md → findings | ui-ux-pro-max wins any conflict | 7.7k / 115k / 235 | impeccable, ui-ux-pro-max | rules read on both sites | retain as pack; `--remove taste` after stage 4 |
| `impeccable` | pbakaus/impeccable | Core | critique, audit and polish against PRODUCT.md and DESIGN.md | 4 floor, 7, 8 | build → critique, fixes | PRODUCT.md, DESIGN.md | 2.9k / 113k / 51 | jury, gstack plan-design-review | no | retain; load only the command in use (critique, audit, polish) |
| `visual-verdict` | Yeachan-Heo/oh-my-claudecode | Core | scored comparison against a reference | 4 floor, 8 | two screenshots → score, deltas | none | 0.6k / 0 / 20 | jury | no | retain |
| `jury` | juliobsz/skills | Core | blind Awwwards-style score; its critic brief feeds the floor check | 4 floor, 8 | URL → score, ranked fixes | playwright-core | 2.0k / 3.6k / 170 | impeccable | no | retain |
| `minimal-prose-discipline` | Yeachan-Heo/oh-my-claudecode | Core | handoffs a phone reader can act on | every handoff | draft → tight prose | none | 2.1k / 0 / 64 | none | no | retain |

### Motion (GSAP is the only live engine)

| Name | Source | Class | Why it's here | Stage | In → out | Depends on | Load / refs / list | Overlaps | Ran | Action |
|---|---|---|---|---|---|---|---|---|---|---|
| `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-react` | greensock/gsap-skills | Core | the engine's own guidance | 4, 7 | motion spec → GSAP code | gsap | 11k / 0 / 372 | none | GSAP used on Diwali; skills never loaded | retain |
| `gsap-plugins`, `gsap-utils`, `gsap-performance` | greensock/gsap-skills | Conditional | only when a task uses a plugin, a util or hits jank | 7 | | gsap | 9.4k / 0 / 211 | animation-performance | no | retain |
| `gsap-frameworks` | greensock/gsap-skills | Conditional | GSAP in Vue, Svelte or another non-React framework | 7 | | gsap | 2.7k / 0 / 92 | gsap-react | no | retain; only for a site that isn't React |
| `choreograph` | emilkowalski/skill | Conditional | several things moving as one; runs only when a task has them (it decides what moves and in what order, GSAP's timeline implements it) | 4, 7 | moving parts → order, overlap | gsap | 4.0k / 2.5k / 243 | emil-design-eng | no | retain |
| `emil-design-eng` | emilkowalski/skill | Conditional | feel and polish of interactions; runs when a task builds or tunes one | 4, 7 | interaction → refined feel | none | 6.9k / 0 / 42 | review-animations | no | retain |
| `review-animations` | emilkowalski/skill | Specialist | the motion review gate | 4, 8 | motion code → findings | none | 2.1k / 2.5k / 51 | emil-design-eng | no | retain |
| `animation-performance` | emilkowalski/skill | Specialist | frame budget on a throttled phone | 8 | trace → fixes | none | 3.6k / 0 / 204 | gsap-performance | no | retain |

### 3D, video and product UI

| Name | Source | Class | Why it's here | Stage | In → out | Depends on | Load / refs / list | Overlaps | Ran | Action |
|---|---|---|---|---|---|---|---|---|---|---|
| `r3f-fundamentals`, `r3f-geometry`, `r3f-materials`, `r3f-textures`, `r3f-lighting`, `r3f-loaders`, `r3f-animation`, `r3f-interaction`, `r3f-shaders`, `r3f-postprocessing`, `r3f-physics` | enzed/r3f-skills | Conditional | when the world is 3D; load only the one or two a task needs | 4, 5, 7 | scene spec → R3F code | three, @react-three/fiber, drei | 1.1–1.5k each / small / 561 | none | no: Diwali's HeroScene.tsx was written without them | retain as pack; load per task; `--remove 3d` when no 3D site is active |
| `blender` | Blender via bpy (external pack) | Conditional | models and Cycles stills, exported as GLB for R3F | 4, 5 | brief → .glb, still | the Python version bpy supports | not a skill | r3f-geometry (simple shapes only) | yes: robot-mammoth robot still v1 | registered 9 Nov (was used but unlisted) |
| `hyperframes` | heygen-com/hyperframes | Core | hero film for the floor check and gate 2; case-study film | 4, 5, 9 | HTML page → video | the `video` pack | measure on install | remotion | no | retain; install at stage 4 |
| `remotion-best-practices`, `remotion-license` | remotion-dev/skills | Conditional | when hyperframes can't do it; licence check first | 4, 5, 9 | | the `video` pack | measure on install | hyperframes | no | retain (no licence published, so pack only) |
| `stageshow` | benjitaylor/skills | Conditional | product UI that reads as real; case-study frames | 5, 7, 9, floor | product screen → still or film | its own npm deps; its player stays off live pages | 4.9k / 45k / 156 | none | no | retain as pack; `--remove ui` unless a product site is active |
| `manimce-best-practices`, `manim-composer` | adithya-s-k/manim_skill | Experimental | an explainer of how a signature move works | 9 | | the `manim` pack | measure on install | hyperframes | no | retain, opt-in |

### Research, SEO, plumbing, helpers

| Name | Source | Class | Why it's here | Stage | In → out | Depends on | Load / refs / list | Overlaps | Ran | Action |
|---|---|---|---|---|---|---|---|---|---|---|
| `last30days` | mvanhorn/last30days-skill | Conditional | what the audience says now | 2 | topic → sourced findings | API keys and open network | 7.9k / 60k / 110 | web search | attempted twice, failed both times (no keys, network blocked) | retain as pack; run only where keys exist; in cloud sessions use web search and say so |
| `scrapling-official` | D4Vinci/Scrapling | Conditional | competitor sameness map (client track) | 2 | URLs → captures | python | 6.9k / 63k / 89 | web fetch | no | retain |
| `rea` | REA CLI (external pack) | Experimental | how one reference effect is built, notes only | 2 | URL → notes | its CLI, manual install | not a skill | none | no | retain, opt-in |
| `seo-audit`, `schema`, `ai-seo` | coreyhaines31/marketingskills | Specialist | SEO, structured data, answer engines | schema, ai-seo: 7; seo-audit: 8 | page → markup, fixes | none | 15.5k / 46k / 596 | none | no | retain |
| `ponytail` | DietrichGebert/ponytail | Specialist | the smallest code for plumbing, never the signature move | 7 | task → minimal code | none | 0.9k / 0 / 108 | none | no | retain |
| `cavecrew`, `cavecrew-investigator`, `cavecrew-builder`, `cavecrew-reviewer` | JuliusBrussee/caveman | Core | small jobs with compressed reports that keep context small | 4, 7, 8 | question or diff → table | none | 1.0k / 0 / 64 | Explore agent | no | retain; caveman voice stays between agents |
| `caveman-compress` | JuliusBrussee/caveman | Conditional | shrinks a site CLAUDE.md past about 1k tokens | 0, any | file → shorter file | sends file text to a model, so only with the user's yes | measure on install | none | no | retain |
| `gstack` (`plan-design-review`, `plan-eng-review`, `diagram`, `freeze`, `design-review`, `benchmark`, `qa-only`, `cso`, `canary`, `retro`) | garrytan/gstack (external pack, pinned 6473a17) | Specialist | design and eng reviews of the spec and plan (6), edits fenced to the site (7), design QA in report mode, performance, QA and security (8), post-deploy canary and retro (9) | 6, 7, 8, 9 | spec, plan, live URL → findings | Bun (`npm i -g bun` works here); `./setup --team --no-browser` | 5–21k per skill, loaded one at a time / list cost measured on install | impeccable (design-review), jury (qa), cavecrew-reviewer | no | install at stage 6. Held back: office-hours (rule 3), autoplan, captain, crew, pair-agent (rule 10), design-consultation (rule 5), design-html, design-shotgun (paid image API), codex (other provider) |

### Launch marketing and decisions (added 9 Nov; fill verified gaps only)

| Name | Source | Class | Why it's here | Stage | In → out | Depends on | Load / refs / list | Overlaps | Ran | Action |
|---|---|---|---|---|---|---|---|---|---|---|
| `product-marketing` | coreyhaines31/marketingskills | Core | positioning, audience, objective, primary action, brand personality into PRODUCT.md | 1 | answers → PRODUCT.md Positioning | the `marketing` pack | measure on install | elaya intake | no | added 9 Nov |
| `customer-research` | coreyhaines31/marketingskills | Conditional | the ideal visitor and their own words, when the client has customers to study | 1, 2 | reviews, interviews → ICP | the `marketing` pack | measure on install | last30days | no | added 9 Nov |
| `content-strategy` | coreyhaines31/marketingskills | Specialist | what this audience expects to find, in what order; shared content patterns | 2 | brief, competitors → content plan | the `marketing` pack | measure on install | scrapling sameness map | no | added 9 Nov |
| `copywriting` | coreyhaines31/marketingskills | Core | messaging angle (3) and final copy (5) | 3, 5 | positioning → hero line, page copy | the `marketing` pack | measure on install | elaya Part A (now a check) | no | added 9 Nov |
| `copy-editing` | coreyhaines31/marketingskills | Specialist | the copy sweep; primary evaluator for copy | 5, 8 | copy → edited copy | the `marketing` pack | measure on install | impeccable's copy pass | no | added 9 Nov |
| `cro` | coreyhaines31/marketingskills | Conditional | page-level conversion, only when the site has a conversion action | 6, 8 | spec or page → fixes | the `marketing` pack | measure on install | elaya conversion rules | no | added 9 Nov |
| `analytics` | coreyhaines31/marketingskills | Conditional | measurement setup, only when the site has a measurable business objective | 9 | measurement plan → tracking | the `marketing` pack | measure on install | none | no | added 9 Nov |
| `launch` | coreyhaines31/marketingskills (already pinned) | Specialist | a launch plan beyond the award submissions | 9 | live site, film → dated plan | the `marketing` pack | 3.9k / refs / 0 until installed | none installed | no | added |
| `social` | coreyhaines31/marketingskills | Specialist | launch posts built on the case-study film | 9 | film, tell-someone sentence → posts | the `marketing` pack | 4.6k / refs / 0 | none installed | no | added; drafts only, the user posts |
| `public-relations` | coreyhaines31/marketingskills | Conditional | press, client track, when there's a story to pitch | 9 | story → pitch, media list | the `marketing` pack | 2.5k / refs / 0 | none installed | no | added |
| `council`, `council-ada`, `council-aristotle`, `council-aurelius`, `council-feynman`, `council-kahneman`, `council-karpathy`, `council-lao-tzu`, `council-machiavelli`, `council-meadows`, `council-munger`, `council-musashi`, `council-rams`, `council-socrates`, `council-sun-tzu`, `council-sutskever`, `council-taleb`, `council-torvalds`, `council-watts` | 0xNyk/council-of-high-intelligence | Conditional | independent personas, forced disagreement and a verdict with dissent, for decisions that are contested, costly to reverse and not settled by evidence | 3, 4, any irreversible client trade-off | decision brief → docs/council/<date>-<slug>.md | the `council` pack; `.council.yaml` (Claude-only, design triad) | 14k skill + about 1.3k per member / 0 until installed (19 entries in the lists while installed) | grilling (interviews the user), jury (scores), floor check (taste) | no | added 9 Nov; always `--triad` or `--quick`, never `--full`; remove the pack after use (conflict rule 11) |

### Reference libraries (evidence, never instructions)

| Name | Source | Class | Why it's here | Stage | How it gets here | Ran |
|---|---|---|---|---|---|---|
| `scroll-craft` | nateherkai/scroll-craft | Reference-only | worlds, hero depth, taste floor, devices, shoot.mjs, encode.sh | 1 to 8 | committed | read on both sites at stage 2 |
| `elaya` | elayadesign/ai-design-skills | Reference-only | intake, visual rules, copy, structure | 1, 4, 5, 6 | committed | no |
| `bencho` | cabralorenzo/bencho | Reference-only | free MIT blocks and sounds | 4 sound, 7 | committed | no |
| `motionsites` | Motionsites-AI/claude-skill | Reference-only | examples, techniques, spec template, rubric, media shelf | 2, 3, 4 floor, 6, 8 | pack `library` | read on both sites at stage 2 |

## Environment, not in this repo

These come with the session, not the lock, so `npm run skills` doesn't track them.

| Name | Class | Use | Ran | Action |
|---|---|---|---|---|
| Artifacts (claude.ai) | Conditional | preview hosting when Vercel isn't connected | yes: Diwali preview | retain |
| Docs (claude.ai) | Specialist | client proposals and gate docs | yes: Diwali gate 1 doc | retain |
| Context7 MCP | Conditional | current API docs for Next.js, R3F, GSAP in stage 7 | no | use before guessing an API |
| frontend-design (account skill) | Redundant | overlaps ui-ux-pro-max, impeccable and taste | no | never load in this repo |
| video-making (account skill) | Redundant | overlaps hyperframes | no | never load in this repo |
| award-site (account copy) | Core | profile copy of SKILL.md only; needs this repo for references | yes | keep in sync with this file's SKILL.md |
| repo MCP servers | none | no `.mcp.json` in the repo | | add one only for a verified gap |
| Playwright (playwright-core and Python playwright, local Chrome) | Core | user-task and interaction tests, live viewport checks | yes: hero proof shots | per-site devDependency |
| axe-core (`@axe-core/playwright`) | Core | primary accessibility evaluator | no | per-site devDependency, added at stage 7 |
| Lighthouse CI (`@lhci/cli`) | Core | primary performance evaluator, budgets from the spec | no | per-site devDependency, added at stage 7 |

## Looked at and left out

- **robertbstillwell/marketing-skills:** no licence; mostly copies of other repos; ships its own "orchestrator" router, which would compete with award-site.
- **marcosmodly/marketing-skill:** MIT, but `full-pipeline` is a competing orchestrator and `publish-pipeline` posts through webhooks and platform APIs; its social and video skills overlap `social` and hyperframes.
- **alirezarezvani/claude-skills marketing-skill:** MIT, but mostly re-implementations of Corey Haines' skills already pinned here (copywriting, launch-strategy, page-cro, schema-markup, seo-audit); brand-guidelines would compete with MASTER.md (conflict rule 5).
- **marketing-council** (Corey Haines): added on 9 Nov, dropped the same day; the council does the same job with more rigour, and two councils would compete.
- **From the already-pinned Corey Haines repo:** `directory-submissions` targets SaaS and AI directories, not award galleries; `ads`, `pricing` and the sales skills don't fit award sites. (`copywriting`, `copy-editing`, `cro` and `analytics` were first left out, then added on 9 Nov with narrow jobs once positioning moved into stages 1 to 3.)
- **A second SEO suite or a keyword-research skill:** seo-audit, ai-seo and schema already cover it.
- **oh-my-claudecode's orchestration** (autopilot, ralph, team, its hooks): a second orchestrator would compete with Superpowers. Only two standalone skills are used.
- **stageshow's own player on a live page:** a second animation clock; its demos are rebuilt in GSAP or filmed.
- **caveman voice for the user:** your updates stay in plain sentences; caveman is for agent-to-agent reports.
- **Image-generation skills** (gstack design-shotgun, the nano-banana family on GitHub): they call paid OpenAI or Gemini image APIs, which are unreachable from this workspace (403 or no route) and against the user's no-paid-generation rule. Art is sourced, rendered in Blender, or built as shaders and film.
- **find-skills' registry (skills.sh)** is unreachable from this workspace; find-skills falls back to `gh search repos` here.
- **Agent Reach** (flagged as suspicious on ClawHub), **OpenSEO** (needs its own server), **kie.ai** (ruled out), **juliobsz/awwwards** (a competing pipeline).
