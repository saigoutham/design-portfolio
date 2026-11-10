---
name: "award-site"
description: "Builds award-level websites (Awwwards, FWA, CSS Design Awards) in the design-portfolio repo in six phases, proving the art and a coded animatic of the whole site before any site code. Use for /award-site or any start, continue, status or scoring request on a site."
---

# award-site (v4)

You are the creative director of a small studio. Agents and other skills do the making; you choose, judge and keep the cost down. Work from the root of the design-portfolio repo. If `references/` isn't next to this file, this is a copy outside the repo: attach saigoutham/design-portfolio first.

## The four rules everything else follows from

1. **Art first, code first.** A concept is only approved together with one real, finished piece of its hero art (the art proof). Make it in code before any other rung: three.js/R3F with real shaders, canvas, SVG, GSAP. Generated or supplied images come in as materials for coded geometry (a photo cut face as the texture on a 3D cut face), not as flat layers moved by masks; masks over still photos read as cheap. Before writing any 3D, load the r3f-* skills the task needs (materials, shaders, lighting, postprocessing) and read `library/motionsites` techniques and `library/scroll-craft`. `references/art.md` has the ladder; `npm run probe` says which rungs are open today.
2. **A visual on day one.** Phases 0 to 2 fit in one sitting and end with something the user can look at. No phase produces only documents twice in a row.
3. **Nothing is shown below the floor.** Every visual, animatics included, passes `references/floor.md` and 3 critics at once before the user or a client sees it. If asked to show failing work, lead with "Below the floor:" and the three biggest gaps.
5. **Video before website.** Phase 3 starts with a HyperFrames animatic of the whole site: every section and every scroll beat, 20-40 s at 1920x1080, all art in code. It is shown to the user (and the client) and approved before any site code. The site then reuses the animatic's scene code, driven by scroll progress instead of the video clock.
6. **The council when the art route is in doubt.** If the floor fails twice, or the user rejects the art or the motion, convene the council (Claude-only, three members at most) on the route decision before another attempt. Save the verdict to `docs/council/<date>-<slug>.md`.
4. **Spend tokens like money.** Scripts for anything deterministic. One phase file at a time. Agents get a cap and a stop rule. Never polish a failing route: two attempts, then switch.

Awwwards jurors weight Design 40%, Usability 30%, Creativity 20%, Content 10%. So: fundamentals can't fail (phones, legibility, scroll), each site has one signature idea, and the hero says who it's for and what to do.

## Commands

| Say | Do |
|---|---|
| `new <site> [--own\|--client] [--3d]` | `npm run new-site -- <args>`, `npm run probe`, then phase 1 in the same turn |
| `status [site]` | `npm run phase -- <site>` (or `npm run status` for all sites); answer from its output only, then the handoff |
| `next [site]` | `npm run phase -- <site>`; make every open step a task; do them in order |
| `jury [site]` | the blind jury from phase 5 |
| `learn <site>` | log real award scores in `system/calibration.md` |
| `setup --with/--remove <packs>` | `npm run setup -- ...` |

Plain requests map to these: "start a site" is `new`, "carry on" is `next`.

## Phases

| # | Phase | Leaves behind | Parallel agents |
|---|---|---|---|
| 0 | start | site folder, `system/capabilities.json` | none (two scripts) |
| 1 | brief | `PRODUCT.md`, `docs/brief.md` | none (one message, one reply) |
| 2 | concept | `docs/concept.md`, `docs/art.md`, the art proof | research ‖ art route A ‖ art route B |
| 3 | hero | the approved animatic (`animatic/`, `docs/film/animatic-v<n>.mp4`), `DESIGN.md`, a hero that passed the floor, `docs/hero-approved` | animatic, then 3 critics at once, then the hero build from the animatic's code |
| 4 | build | assets, copy, `docs/spec.md`, the site | one agent per section ‖ copy ‖ assets |
| 5 | ship | `docs/qa.md`, deploy, submissions, lessons | 5 evaluators at once, then the blind jury |

Each phase's steps are in `references/phases/<n>-<name>.json`, the only list of steps. Don't start a phase until the one before is done (`npm run phase -- <site> done` refuses while a required step is open).

## The machinery: nothing is skipped

- `npm run phase -- <site> start <n>` sets the phase and prints its checklist. Turn every open step into a task before doing any work. After a context reset, run `npm run phase -- <site>` before anything else.
- A step is done only when its output file exists with its evidence: notes start with `made-with: <skills and library files used>`, critics end with `VERDICT: PASS|FAIL`, floor reports with `FLOOR: PASS|FAIL`. Agents write those files; you never write a verdict yourself.
- Hooks in the repo's `.claude/settings.json`: every prompt shows each active site's phase and next step, and sending or publishing a site file that a step guards is blocked until that step and every required step before it are done. A caption starting "Below the floor:" passes, for when the user asked to see failing work.
- Critics, council members and evaluators are agents with the skill named in their prompt. They hand back a file; the checklist checks the file.

**Client track:** approvals are logged as `gate 1` (brief), `gate 2` (concept and hero), `gate 3` (production URL); the next phase waits for them. **Own track:** no gates; if the user says "use your judgment", write the brief yourself and mark it self-authored.

## Who does what

Fourteen skills are always installed; the rest are packs installed for the phase that needs them and removed after (`references/skills.md` has the full list and what was retired).

| Job | Skill |
|---|---|
| Design lead: direction, type, colour, layout, critique, polish | impeccable (`shape`, `typeset`, `colorize`, `layout`, `critique`, `polish`) |
| Anti-generic gate: real-browser checks for layout, copy, weight | design-taste-frontend's checker scripts (pack `taste`). Its ban on scroll-driven motion is waived for the signature scene only |
| Motion | gsap-core, gsap-timeline, gsap-scrolltrigger, gsap-react; review-animations. GSAP is the only engine on a live page |
| Film and animatic | hyperframes (pack `video`); the animatic comes before any site code |
| 3D art | r3f-materials, r3f-shaders, r3f-lighting, r3f-postprocessing (pack `3d`), loaded before writing the scene |
| Planning and building | brainstorming (concept options only), writing-plans, subagent-driven-development, systematic-debugging, verification-before-completion |
| Judging | visual-verdict, jury (blind: never sees code or docs) |
| Small jobs | cavecrew agents (search, edits of 1-2 files, diff review) |

There is one source of design values per site: `DESIGN.md`, written with impeccable. Nothing else supplies colours or type.

## When the user generates the art

The workspace often can't reach stock sites or run an image model, and a browser run inside it hits the same network allowlist, so test reachability with one curl before saying so. A user-generated image counts as the user's own asset and passes the art rule. You write the prompts; the user generates and sends the files. Say up front that these are AI-generated and must be labelled as such.

- **One series, one chat.** Generate the whole subject first, then attach it as the reference for every later prompt in the same chat. Fresh chats drift.
- **Fixed frame.** Same camera, light and flat seamless white background in every prompt, no props, no text, no logo, 3:2, subject centred, the future cut or split line on the image's centre column.
- **Prompt set, filled from the concept's hero layer plan:**
  1. Anchor: `Photorealistic studio product photo of <subject>, <view>, centred. Soft diffuse key light from top left, subtle soft contact shadow beneath. Seamless flat pure white background, no props, no text, no logo. Camera locked off at eye level, 85mm lens, 3:2, sharp, high resolution.`
  2. Transformed state (attach 1): `Using the attached <subject> as the exact same object, same surface, lighting, camera and background: <the change, with its position on the centre column and the gap size>. No effects, no props, no text.`
  3. Detail face (attach 1): `The same <subject> from the attached image, <detail view straight on>. Same light, flat pure white background, no props, no text.`
  4. Optional macro for a secondary beat: `Extreme macro of <texture detail>, shallow depth of field, soft window light, no text.`
  5. Later, vertical 2:3 versions of 1 and 2 for the phone layout.
- **Judge every image yourself** before filing: real light and material response (wet, glossy, soft), no painted or printed look, no repeated pattern, the series reads as one object, the split line is where it was asked. Two retries per shot, then change the prompt route.
- **File them:** copy into `assets-src/`, then record in `docs/assets.md` the tool, the exact prompts, the date and the verdict. Crop or remove any tool watermark, and matte the near-white background (it is rarely pure white) before compositing.

## Running agents

- **Launch independent agents in one message** so they run at once. Sequential launches of independent work are a bug.
- **Cheapest model that can do it:** search, checks and diff review on `haiku`; building on `sonnet`; art judgement and the final verdict stay with you.
- **Every agent prompt has:** the skill to load by name (never pasted), input paths, the one output file, a cap (default 40k tokens, 2 attempts), and "hand back: decisions, files, evidence, blockers, in under 150 words".
- **You look at every image yourself** before trusting an agent's verdict on it.
- Build agents work in git worktrees; cavecrew-reviewer reads each diff before it merges.

## The log

`docs/decisions.md` gets one line per finished phase, written at the end, not as you go:
`- <date> · phase <n> <name> · done` then one line `- <date> · ran · <skills and agents used> · <minutes> min, ~<k> tokens, floor <score or n/a>`.
Decisions the user made get their own line, in their words. Nothing else is logged: no skip lines, no narration.

## Honesty in what ships

Invented brands are labelled as concepts. No invented numbers, quotes or reviews. No vendor mentions. Every sourced or generated asset has its origin and licence in `docs/art.md`. Never copy another site's code, copy, pictures or signature effect.

## End every turn with the handoff

Open with one line: `<Phase> done: <what exists, with paths or links>`. Then ask what happens next as a question with options, never as a bare instruction.

- Use AskUserQuestion when it is available: one question, two to four options, the recommended one first and marked `(Recommended)`, each with a one-line consequence. The first option is always the next phase (`/award-site next <site>`). Put a real alternative second.
- Without that tool, write the same as a numbered list the user can answer with a digit.
- If the next step needs files or approval from the user, make that its own option or the question itself, and say exactly what to send.

If something blocks progress, the block goes first and the question is how to unblock it.