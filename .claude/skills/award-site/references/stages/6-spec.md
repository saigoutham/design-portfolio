# Stage 6: Spec and plan

Goal: `docs/spec.md`, precise enough that two builders would produce the same page, and a plan the build can execute.

Write the spec from `library/motionsites/references/spec-template.md`, with real values for every element: fonts, hex tokens from MASTER.md, clamp() sizes, letter-spacing, durations, easings, breakpoints. Add:
- **Scroll score** (scroll-craft): one row per beat, with its device and why. Checks: at least 4 device families; none twice in a row; at most 2 scroll-scrubbed videos; the peak has the largest span; the grammar's bans hold.
- A motion table; responsive rules (phones art-directed separately, not just stacked); a reduced-motion version that keeps depth in a still composition.
- A performance budget: LCP, INP and CLS green on a throttled phone; a still image first, 3D loaded after first paint.
- elaya's page structure and conversion rules for every call to action.

If gstack is installed (`--with gstack`, needs Bun), run **plan-design-review** on the spec. Then run **writing-plans**; record the plan's path in decisions.md.

Log `stage 6 spec · done`.

## Handoff
- Next: stage 7, Build.
- Usual recommendations: point out the riskiest task in the plan (usually the signature move) and recommend building it first, so problems surface early.
- Needs from you: nothing.
