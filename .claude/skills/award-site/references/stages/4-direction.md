# Stage 4: Direction and hero proof

Goal: one source of design values, a written direction, and the hero built for real and passing the floor check.

1. **Tokens.** Run ui-ux-pro-max from the repo root:
   ```bash
   python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<product> <industry> <mood>" --design-system --persist -p "<Site>" --output-dir sites/<site>
   ```
   Its `design-system/<site>/MASTER.md` is the single source of design values. If MASTER.md already exists, read it before regenerating anything.
2. **World and hero planes.** Choose the world (photographic, real 3D, typographic; illustrated only if the brand truly is) from `library/scroll-craft/references/worlds.md`. Plan the hero's depth planes (background, subject, foreground, atmosphere, headline between planes) from `library/scroll-craft/references/hero-depth.md`.
3. **Check, don't replace.** `npm run setup -- --with taste` once, then check the direction with **design-taste-frontend**, `library/scroll-craft/references/taste.md` (craft floor and refuse list) and elaya's visual rules (`library/elaya/landing-page-design/SKILL.md`, Part B). They check MASTER.md's values; they never supply competing ones.
4. **DESIGN.md** (site root): the direction, what the tokens are for, the hero layer plan, and how the signature move looks.
5. **Source the hero's art first** when the world is illustrated or the art is the content (heritage, museum pieces, an artist's work). Run stage 5's media order for the hero now, before any code. Code-drawn art never stands in (SKILL.md, quality floor rule 2). If the workspace can't reach a source, ask the user for the files that same turn.
6. **Plan the tracks.** Write a short plan with **writing-plans**, then run it with **subagent-driven-development**, one subagent per track, in parallel where they don't depend on each other:
   - **Assets:** the hero's media, with sources and licences, using stage 5's order.
   - **Build:** the first screen and the signature move, using the gsap-* skills, plus the r3f-* skills (`--with 3d`) when the world is 3D.
   - **Motion:** **choreograph** for what moves together, **emil-design-eng** for feel, **review-animations** before merge. If the concept has sound, take the signature move's sound from `library/bencho/` sounds.
   - **Critique:** the floor check, as soon as the build lands.

   **cavecrew-reviewer** reads each track's diff before it merges. You direct and judge; you don't build the hero alone.
7. **Hero proof.** Put the first screen and the signature move on a preview, for real. A stand-in photo or piece of footage is allowed if the client's shoot hasn't happened, but it must be labelled. Code-drawn art is not a stand-in.
8. **Floor check** (`references/floor.md`). The hero isn't shown to the user or the client until it passes. Then save three things to `docs/hero-approved/`: a desktop screenshot, a phone screenshot and the film (`film.mp4`). Stage 8 compares the final build against them.
9. **Proposal** (client track): a doc with the concept, the tell-someone sentence, the direction, references, sitemap, timeline and what the client must supply, plus the film and the preview link. If the client wants Figma files, use elaya's figma-designer (needs a Figma connection). Send it for **Gate 2** and log the approval.

Log `stage 4 direction · done`.

## Handoff
- Next: stage 5, Assets.
- Usual recommendations: if the floor check failed after 3 rounds, lead with that, name the one change that would lift it most (usually real assets, or a 3D or photographic world), and hold the proposal; if the hero proof needed a stand-in, recommend booking the shoot now with the shot list from stage 5; if the proof feels weaker than the concept, say so and propose the one change that would fix it, before assets are commissioned.
- Needs from you: Gate 2 approval (client track); own track, a look at the preview.
