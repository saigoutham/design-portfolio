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
5. Apply elaya's page structure and conversion rules to every call to action. When the site has a conversion action, run **cro** on the page structure. A site with a quiet ending and no call to action says so.
6. Write **acceptance criteria** that a test can check, for responsive behaviour (named breakpoints), accessibility (axe-core clean, keyboard path, reduced motion), performance (Lighthouse budgets: LCP, INP, CLS on a throttled phone), SEO (title, description, schema) and each interaction (what triggers it, what the visitor sees).
7. Run gstack's **plan-design-review** on the spec (`npm run setup -- --with gstack`; Bun installs with `npm i -g bun`). It rates each design dimension and says what a 10 would look like. Fix what it finds, with MASTER.md still the only source of values. Where a flow is clearer drawn than tabled, use gstack's **diagram**.
8. Run **writing-plans**. Put the signature move first in the plan, since it's the riskiest task, and record the plan's path in decisions.md.
9. Run gstack's **plan-eng-review** on the plan: architecture, edge cases, failure modes, tests. writing-plans owns the plan (Superpowers leads); the review feeds it fixes.

## Verify
Every element in the spec has values, not adjectives, the scroll score meets its five checks, and both gstack reviews' findings are fixed or answered.

## Log
`stage 6 spec · done`, plus a skill line for writing-plans, plan-design-review and plan-eng-review.

## Handoff
- Next: stage 7, Build.
- Usual recommendations: point out the riskiest task in the plan (usually the signature move) and recommend building it first, so problems surface early.
- Needs from you: nothing.
