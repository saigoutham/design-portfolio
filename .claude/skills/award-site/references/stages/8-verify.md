# Stage 8: Verify

**Goal:** proof that the site is ready for a jury: `docs/qa.md`, plus a blind jury score in `.jury/`.

Score a production build, never a dev server: dev builds are unminified and noisy, which wrecks the performance numbers. From the site folder:
```bash
npm run build && npx next start -p 4400
```
Setup once: `npm i -D playwright-core` in the site folder, and `npm run setup -- --with library` at the repo root.

## Builder loop
First, **user-task tests**: three to five representative visitor tasks (for example: light the first lamp, reach story three, find the credits), run as Playwright scripts in real Chromium at desktop and phone sizes, each one recorded with pass or fail and a reproducible failure. Then work through the primaries in SKILL.md's "Who reviews what". The second reviewers listed there run only when triggered.

Repeat until every check passes. If one issue survives 3 rounds, stop and flag it to the user rather than looping.

1. **Scroll walker:** run `node ../../library/scroll-craft/scripts/shoot.mjs --url http://localhost:4400 --out lab/shots`. Run it again with `--width 390 --height 844 --out lab/mobile`, and with `--reduced-motion --out lab/reduced`.
   - Fix dead scroll, copy that never reaches full opacity, contrast failures measured on the finished frame, and videos stuck on their poster.
   - A few report fields assume scroll-craft's own engine. Treat any the GSAP build can't produce as unknown, not as a pass.
   - Then look at the contact sheet yourself: the script proves the page works, not that it means anything.
2. **Hero fidelity:** run **visual-verdict** comparing the built hero (desktop and phone) with `docs/hero-approved/`. Below 90, fix and rerun: the client approved that hero.
3. **Rubric:** score against `library/motionsites/references/review.md`: first glance, signature, typography, composition, colour and light, media integration, motion, mobile, copy, polish. The bar is an average of 8 with nothing under 7. Fix the three weakest with specific values, then shoot again.
4. **Feel check:** scroll the page cold, write one word per act, then compare with the feeling curve in docs/concept.md. Where they disagree, the page is wrong, not the concept.
5. **Craft and usability:**
   - **impeccable** critique and audit.
   - When a primary flags a visual problem it can't pin down, gstack's **design-review** in report mode: visual inconsistency, spacing, hierarchy, AI-slop patterns, slow interactions. Its fixes go back through stage 7, not straight into the code.
   - When Lighthouse fails or regresses, gstack's **benchmark**; when a user task fails without a clear cause, **qa-only** for a bug report with evidence.
   - When the site has a conversion action, **cro** on the built page.
   - gstack's **cso** security audit, for client sites that take input or data.
   - **review-animations** and **animation-performance**.
   - **seo-audit**.
   - Core Web Vitals green on a throttled phone, and keyboard focus visible throughout.
   - **cavecrew-reviewer** on the final diff.

## Blind jury
Run the **jury** skill on the production URL. You built this site, so your own score isn't blind. The critic has to be a fresh subagent that gets only the jury's brief and its evidence: no code, no brief, no DESIGN.md, and never jury's calibration file.

It passes when both hold:
- the jury estimate is **7.2 or more** (the Site of the Day band; 6.5 to 7.1 is Honorable Mention), and
- the critic's one-sentence reading of the idea matches the tell-someone sentence in docs/concept.md. If it doesn't, the site isn't saying it yet, and that's the first fix.

Otherwise the jury's ranked fixes go back to stage 7, highest score impact first.

## Verify
Write `docs/qa.md` (template in `references/templates.md`) with both loops' results, and run **verification-before-completion** before calling this stage done.

## Log
`stage 8 verify · done`, `jury · pass · <estimate>` (or `jury · fail · <estimate>`), plus a skill line for each skill that ran.

## Handoff
- Next: stage 9, Launch and learn, or back to stage 7 with the jury's top fixes.
- Usual recommendations: on a pass, recommend which award to submit to first, from the scores. Strong Creativity points to FWA; strong Design and Usability point to Awwwards. On a near miss (7.0 to 7.1), name the one or two fixes that move the estimate most, not the whole list.
- Needs from you: nothing, unless a fix needs new assets or copy.
