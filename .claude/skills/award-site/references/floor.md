# The quality floor

Run before any visual reaches the user or a client: the art proof, the hero, each finished section, the final site.

## Automatic fails (check these first; they cost nothing)
- A real-world object imitated in code (SVG, CSS, canvas illustration) as the look.
- Hero art with no entry in `docs/art.md`.
- The hero doesn't say what it is, who it's for and what to do next.
- On a throttled phone: unreadable text, dead or janky scroll, LCP over 2.5 s.
- Built by one agent with no diff review.

## The check (launch all three critics in one message)
Give each only the live URL or screenshots, the 10-20 s film, and three references chosen in phase 2. No code, no docs, no history.

| Critic | Skill | Model | Pass |
|---|---|---|---|
| Side by side with the references | visual-verdict | haiku | holds up against at least 2 of 3; gaps named |
| Design and UX critique | impeccable `critique` | sonnet | no open "high" item |
| Blind juror: Design, Usability, Creativity, Content | jury's critic brief | sonnet | weighted 7.2 or more |

Then run the taste gate (pack `taste`, its checker scripts in a real browser) for layout, copy and weight. Its findings are fixes, not a score; its rule against scroll-driven motion doesn't apply to the signature scene.

## Result
Pass: write `docs/hero-approved` (phase 3) or note the score in the phase's `ran` line.
Fail: fix the three biggest gaps the critics agree on, rerun only the critics that failed. After two failed rounds, stop and bring the user the choice: change the art route, change the concept, or ship lower. Don't run a third round on your own.
