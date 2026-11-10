# The quality floor

Run before any visual leaves the studio: hero proof, proposal, preview link, a finished section. Stages prove work exists; this proves it's good.

Phase 3 (hero) and phase 4 (each section) run it. Tighten it when a real jury teaches something.

## Inputs
- The live link (local or preview) and a 10–20 s hyperframes film of the motion. Screenshots alone don't count.
- Three references chosen in phase 2 (from `docs/research.md`): any medium, at least one award-winning site.
- `MASTER.md` for the values the work must hold.

## The four parts (all must pass)

1. **Side by side.** visual-verdict compares the work against the three references and, after gate 2, the approved hero. Verdict per reference: matches or beats the bar, or the named gaps.
2. **MotionSites rubric** (`library/` MotionSites pack, `npm run setup -- --with library`). Average 8+ and no category under 7.
3. **impeccable critique.** Design and UX critique, kept apart from functional defects. Every "high" item fixed or explicitly accepted in decisions.md.
4. **Blind critic.** A fresh subagent with jury's brief scores Design, Usability, Creativity, Content from the link and film only: no code, no docs, no history. Weighted score 7.2+.

## Automatic fails (no scoring needed)
- Flat images moved by masks or clip-paths as the main motion (they read as cut-outs). Art is code first; stills are materials on coded geometry.
- One agent built it alone with no review of the diff.
- The hero doesn't say the positioning, audience and primary action from PRODUCT.md.
- Phone (throttled) feels broken: unreadable text, dead scroll, LCP over 2.5 s.

## Result
Write the report to `docs/floor/<what>-<date>.md`, ending with `FLOOR: PASS` or `FLOOR: FAIL`, and log `- <date> · floor · phase <n> · <pass|fail> · side-by-side <verdict>, rubric <avg>/<min>, impeccable <highs open>, critic <score>` in docs/decisions.md.
On fail, fix the three biggest gaps and rerun. After 2 failed rounds, or when the user rejects the art or the motion, convene the council (SKILL.md rule 6).
If the user asks to see work below the floor, lead with "Below the floor:" and the three biggest gaps.
