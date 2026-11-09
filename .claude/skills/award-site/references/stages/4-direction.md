# Stage 4: Direction and hero proof

Goal: one source of design values, a written direction, and the hero built for real.

1. **Tokens.** Run ui-ux-pro-max from the repo root:
   ```bash
   python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<product> <industry> <mood>" --design-system --persist -p "<Site>" --output-dir sites/<site>
   ```
   Its `design-system/<site>/MASTER.md` is the single source of design values. If MASTER.md already exists, read it before regenerating anything.
2. **World and hero planes.** Choose the world (photographic, real 3D, typographic; illustrated only if the brand truly is) from `library/scroll-craft/references/worlds.md`. Plan the hero's depth planes (background, subject, foreground, atmosphere, headline between planes) from `library/scroll-craft/references/hero-depth.md`.
3. **Check, don't replace.** `npm run setup -- --with taste` once, then check the direction with **design-taste-frontend**, `library/scroll-craft/references/taste.md` (craft floor and refuse list) and elaya's visual rules (`library/elaya/landing-page-design/SKILL.md`, Part B). They check MASTER.md's values; they never supply competing ones.
4. **DESIGN.md** (site root): the direction, what the tokens are for, the hero layer plan, and how the signature move looks.
5. **Hero proof.** Build the first screen plus the signature move, for real, on a Vercel preview. Gather the hero's own media first, using stage 5's order of preference. If the client's shoot hasn't happened, use the best stand-in the brief allows and label it as a stand-in. Save a desktop and phone screenshot of the approved hero to `docs/hero-approved/`; stage 8 compares the final build against them.
6. **Proposal** (client track): a doc with the concept, the tell-someone sentence, the direction, references, sitemap, timeline and what the client must supply, plus the preview link. If the client wants Figma files, use elaya's figma-designer (needs a Figma connection). Send it for **Gate 2** and log the approval.

Log `stage 4 direction · done`.

## Handoff
- Next: stage 5, Assets.
- Usual recommendations: if the hero proof needed a stand-in, recommend booking the shoot now with the shot list from stage 5; if the proof feels weaker than the concept, say so and propose the one change that would fix it, before assets are commissioned.
- Needs from you: Gate 2 approval (client track); own track, a look at the preview.
