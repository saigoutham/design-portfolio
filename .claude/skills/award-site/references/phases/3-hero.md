# Phase 3: hero

The first screen and the signature move, working, on a real phone, past the floor. Packs: `taste`, `video`, `motion` if several things move together, `3d` only for live WebGL.

1. **Design values (you, with impeccable).** Run impeccable `shape` on the hero, then write `DESIGN.md`: direction in one line; colours taken from the art itself, with contrast ratios; two typefaces at most with sizes and tracking; spacing scale; motion curve and durations; the hero's layers (ground, subject, near detail, type, chrome) and how each moves; phone layout as its own composition; the reduced-motion version. Tokens go in `app/globals.css` as CSS variables. This file is the only source of design values.
2. **Delivery choice.** Prefer scroll-scrubbed video or image sequence (`library/scroll-craft` `encode.sh`) over live WebGL when the art is rendered or filmed: phones stay smooth. Live GLSL when code is the medium. Budget: hero under 3 MB, LCP under 2.5 s on a throttled phone.
3. **Plan and build.** writing-plans for a plan of 3-6 tasks, then one build agent (sonnet, worktree) with the gsap skills, or two when art prep and page code don't depend on each other. cavecrew-reviewer on the diff.
4. **Film.** hyperframes: a 10-20 s capture of the hero and the signature move. Motion is judged as motion.
5. **Floor.** `references/floor.md`, three critics in one message, then the taste gate.
6. On pass: write `docs/hero-approved` (date, scores), send the user the link and the film. Client track: this plus the concept as a doc is `gate 2`.
