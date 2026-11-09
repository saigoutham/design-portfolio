# The quality floor

Run before any visual leaves the studio: hero proof, proposal, preview link, a finished section. Stages prove work exists; this proves it's good.

Reconstructed on 2026-11-09 from SKILL.md v3 ("The quality floor"), because the original file never reached the repo. Tighten it when a real jury teaches something.

## Inputs
- The live link (local or preview) and a 10–20 s hyperframes film of the motion. Screenshots alone don't count.
- Three references chosen at stage 2/3 (from `docs/research.md`): any medium, at least one award-winning site.
- `MASTER.md` for the values the work must hold.

## The four parts (all must pass)

1. **Side by side.** visual-verdict compares the work against the three references and, after Gate 2, the approved hero. Verdict per reference: matches or beats the bar, or the named gaps.
2. **MotionSites rubric** (`library/` MotionSites pack, `npm run setup -- --with library`). Average 8+ and no category under 7.
3. **impeccable critique.** Design and UX critique, kept apart from functional defects. Every "high" item fixed or explicitly accepted in decisions.md.
4. **Blind critic.** A fresh subagent with jury's brief scores Design, Usability, Creativity, Content from the link and film only: no code, no docs, no history. Weighted score 7.2+.

## Automatic fails (no scoring needed)
- Art drawn in code (hand SVG, CSS gradients standing in for light, canvas illustration) presented as the look. Code-as-medium work is exempt.
- One agent built it alone with no review of the diff.
- The hero doesn't say the positioning, audience and primary action from PRODUCT.md.
- Phone (throttled) feels broken: unreadable text, dead scroll, LCP over 2.5 s.

## Result
Log `- <date> · floor · stage <n> · <pass|fail> · side-by-side <verdict>, rubric <avg>/<min>, impeccable <highs open>, critic <score>` in docs/decisions.md.
On fail, fix the three biggest gaps and rerun. After 3 failed rounds, consider the council (SKILL.md, "The council").
If the user asks to see work below the floor, lead with "Below the floor:" and the three biggest gaps.
