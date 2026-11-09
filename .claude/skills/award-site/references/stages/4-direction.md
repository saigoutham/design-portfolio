# Stage 4: Direction and hero proof

**Goal:** one source of design values, a written direction, and the hero built for real, passing the floor check before anyone sees it. This is where the pipeline failed before (SKILL.md, "What wins, and what has already lost"), so every step here is meant to be run, not read.

Setup: `npm run setup -- --with library,video`, plus `3d` when the world is 3D.

## Steps
1. **Tokens.** Run **ui-ux-pro-max** from the repo root:
   ```bash
   python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<product> <industry> <mood>" --design-system --persist -p "<Site>" --output-dir sites/<site>
   ```
   `design-system/<site>/MASTER.md` is the single source of design values. If it already exists, read it before regenerating anything.
2. **World and hero planes.** Choose the world from `library/scroll-craft/references/worlds.md`: photographic, real 3D, typographic, or illustrated only if the brand truly is. Plan the hero's depth planes from `library/scroll-craft/references/hero-depth.md`: background, subject, foreground, atmosphere, and the headline between planes.
3. **Check, don't replace.** Run **design-taste-frontend** (`--with taste`) as a check only. Also check against `library/scroll-craft/references/taste.md` (the craft floor and refuse list) and elaya's visual rules (`library/elaya/landing-page-design/SKILL.md`, Part B). They check MASTER.md's values; they never supply competing ones. Remove the taste pack afterwards.
4. **DESIGN.md** (site root): the direction, what the tokens are for, the hero layer plan, and how the signature move looks.
5. **Source the hero's media first.** When the world is illustrated or the art is the content (heritage, museum pieces, an artist's work), run stage 5's media order for the hero before writing code. Code-drawn art never stands in. If a source can't be reached from here, ask the user for the files in the same turn. For a 3D world, models come from Blender (`--with blender` prints the install) or licensed files.
6. **Plan the tracks.** Write a short plan with **writing-plans**, then run it with **subagent-driven-development**, one subagent per track, in parallel where they don't depend on each other:
   - **Assets:** the hero's media, with sources and licences.
   - **Build:** the first screen and the signature move with **gsap-core**, **gsap-timeline**, **gsap-scrolltrigger** and **gsap-react**, plus the r3f-* skill a task needs when the world is 3D, and **stageshow** when the hero shows product UI.
   - **Motion:** **choreograph** for what moves together, **emil-design-eng** for feel, and **review-animations** before merge. If the concept has sound, take the signature move's sound from `library/bencho/` sounds.
   - **Critique:** the floor check, as soon as the build lands.

   **cavecrew-reviewer** reads each track's diff before it merges.
7. **Hero proof.** Put the first screen and the signature move on a preview, for real. A labelled stand-in photo or piece of footage is allowed while a shoot is pending; code-drawn art is not.
8. **Floor check** (`references/floor.md`): **impeccable**, **visual-verdict** against three references, the MotionSites rubric, a blind critic built on **jury**'s critic brief, and a **hyperframes** film. Repeat until it passes, up to 3 rounds. If it still fails, the question is usually whether the world itself is wrong. Bring that to the user, or to the **council** if it's contested (SKILL.md, "The council").
9. **Save the approved hero:** desktop and phone screenshots plus `film.mp4` in `docs/hero-approved/`. Stage 8 compares the final build against them.
10. **Proposal** (client track): a doc with the concept, the tell-someone sentence, the direction, references, sitemap, timeline and what the client must supply, plus the film and the preview link. If the client wants Figma files, use elaya's figma-designer (needs a Figma connection). Send it for **Gate 2** and log the approval.

## Verify
MASTER.md, DESIGN.md, `docs/floor.md` with a passing round, and `docs/hero-approved/` with film.mp4.

## Log
`stage 4 direction · done`, `floor pass`, and a skill line for every skill above that ran.

## Handoff
- Next: stage 5, Assets.
- Usual recommendations: if the floor failed after 3 rounds, lead with that, name the one change that would lift it most (usually real assets, or a 3D or photographic world), and hold the proposal. If the proof used a stand-in, recommend booking the shoot now with stage 5's shot list.
- Needs from you: Gate 2 approval (client track); on the own track, a look at the film and the preview.
