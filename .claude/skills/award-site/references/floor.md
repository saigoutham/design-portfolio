# The floor check

Run it before any visual reaches the user or a client: the stage 4 hero proof, the Gate 2 proposal, any preview link, and each finished section in stage 7. A round takes about 30 minutes. Allow up to 3 rounds, then flag whatever still fails.

Setup once, from the repo root: `npm run setup -- --with library,video`. That installs MotionSites' rubric and examples, plus hyperframes.

Run the steps as parallel subagents where they don't depend on each other: steps 2, 3 and 4 can run at the same time once step 1 has its shots.

1. **Shoot it.** Use a production build (`npm run build && npx next start -p 4400`), never a dev server. Capture three views:
   - desktop at 1440×900
   - phone at 390×844
   - reduced motion

   Take a screenshot of every state the visitor passes through. Add a 10 to 20 second film of the signature move, made with **hyperframes**. When you need frames rather than a film, make a contact sheet: use scroll-craft's `shoot.mjs` for scroll, or stageshow's `scripts/film.mjs --select <selector>` for a single element. Save everything to `docs/floor/<round>/`.
2. **Side by side.** Pick three references the concept stands against:
   - one from `library/motionsites/examples/`
   - one from `library/scroll-craft/references/approved-collection.md`
   - one current Site of the Day in the same world: photographic, 3D, illustrated or typographic

   Shoot each reference at the same sizes and pair each one with yours in a single image. Run **visual-verdict** on each pair. It is measuring craft distance (light, depth, type, art, motion, detail), not likeness. Then write one line per reference saying where yours is weaker, in specifics.
3. **Rubric.** Score each criterion in `library/motionsites/references/review.md`, with one line of rationale per score. The bar is an average of 8, with nothing under 7.
4. **impeccable critique** on the running build. It reads PRODUCT.md and DESIGN.md. Record subjective critique separately from functional defects; defects are fixed before any further critique round.
5. **Blind critic.** Give a fresh subagent only three things: the shots, the film and the critic brief from `.claude/skills/jury/references/quality-bar.md`. It never sees code, the brief, DESIGN.md or this conversation. It returns:
   - a 1 to 10 score each for Design and Creativity
   - a one-sentence reading of the idea
   - the three things that most make the work look unfinished

   The brief is fixed and gives no hints about design direction. It passes when the average is 7.2 or more and the one-sentence reading matches both the tell-someone sentence in docs/concept.md and the positioning in PRODUCT.md.
6. **Fix the three weakest, with values.** Write a value, not a direction. "Improve the lighting" is a direction. "Bloom intensity 1.15 to 1.4, a contact shadow under the lamp at 40% opacity" is a value. Then go back to step 1.

Record each round in the site's `docs/floor.md`: the references, the rubric scores, the critic's score and reading, and the fixes. When it passes, add `- <date> · floor pass · <what was checked> · critic <score>` to docs/decisions.md.

**What usually fails, and the fix that moves it most:**
- Art that looks drawn by code. Replace it with real art (SKILL.md, quality floor rule 2).
- Flat light. Use real light: a 3D scene with shadows and bloom, or filmed footage, rather than CSS gradients.
- Too few depth planes. Revisit `library/scroll-craft/references/hero-depth.md`.
- Motion that only fades. Use choreograph and emil-design-eng.
- Type at default sizes. Use MASTER.md's display scale at full size.
