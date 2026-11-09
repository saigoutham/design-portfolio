# Stage 6: Spec and plan

**Goal:** `docs/spec.md`, precise enough that two builders would produce the same page, and a plan the build can execute.

## Steps
1. Write the spec from `library/motionsites/references/spec-template.md`. Give real values for every element: fonts, hex tokens from MASTER.md, clamp() sizes, letter-spacing, durations, easings, breakpoints.
2. Add a **scroll score** (scroll-craft): one row per beat, with its device and why. It must meet five checks:
   - at least 4 device families
   - no device family twice in a row
   - at most 2 scroll-scrubbed videos
   - the peak has the largest span
   - the grammar's bans hold
3. Add a motion table, and responsive rules: phones are art-directed separately, not just stacked. Add a reduced-motion version that keeps depth in a still composition.
4. Add a performance budget: LCP, INP and CLS green on a throttled phone; a still image first, and 3D loaded after first paint.
5. Apply elaya's page structure and conversion rules to every call to action. A site with a quiet ending and no call to action says so.
6. If gstack is installed (`--with gstack`, experimental, needs Bun), run **plan-design-review** on the spec.
7. Run **writing-plans**. Put the signature move first in the plan, since it's the riskiest task, and record the plan's path in decisions.md.

## Verify
Every element in the spec has values, not adjectives, and the scroll score meets its five checks.

## Log
`stage 6 spec · done`, plus a skill line for writing-plans.

## Handoff
- Next: stage 7, Build.
- Usual recommendations: point out the riskiest task in the plan (usually the signature move) and recommend building it first, so problems surface early.
- Needs from you: nothing.
