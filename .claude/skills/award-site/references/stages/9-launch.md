# Stage 9: Launch and learn

**Goal:** the site live, announced and submitted, and its lessons fed back into the system.

## Steps
1. **Deploy** to Vercel. Sites in this repo deploy with Root Directory set to `sites/<site>`; a site in its own repo deploys from its root.
   - Client track: the client approves the production URL; log `gate 3 · approved · <who>`.
   - Write `docs/editing-guide.md`: how the client edits content, in their terms, not ours.
   - Run gstack's **canary** on the production URL after deploy: console errors, performance regressions and page failures, compared with the pre-deploy baseline.
2. **Case-study film** (`--with video`):
   - **hyperframes** renders HTML, so it can reuse the site's own pages.
   - Use **remotion-best-practices** when you need more control. Check **remotion-license** first: it's free for individuals and for companies of up to 3 people, and on client work the licence falls on whoever owns the video.
   - For browser and phone frames showing the site (framed stills, a short cursor walk), use **stageshow** (`--with ui`) and film them with its `scripts/film.mjs`.
   - For an explainer of how the signature move works (geometry, data, physics), the `manim` pack is an option.
3. **Launch plan** (`--with marketing`):
   - **launch** for a dated plan beyond the award submissions.
   - **social** for launch posts built on the film and the tell-someone sentence. Drafts only: the user or the client posts them.
   - On the client track, where the site has a story worth pitching, **public-relations** for a pitch and a media list.

   Run `npm run setup -- --remove marketing` afterwards.
4. **Measurement plan** (`docs/measurement.md`): the primary conversion (or, for a quiet site, the engagement that means it worked), secondary actions, and the performance baseline from Lighthouse. When the site has a measurable business objective, set it up with **analytics**.
5. **Submissions:** Awwwards, FWA and CSS Design Awards. Use contact-sheet screenshots, a short description built on the tell-someone sentence, the stack and the credits, including every artist and licensor from docs/assets.md. Log each submission with its date.
6. **Fingerprint:** update the site's row in `system/FINGERPRINTS.md` from `planned` to its final six dimensions, and add whatever this site claimed to "What is taken".

## Learn (`/award-site learn <site>`)
Run gstack's **retro** on the site's history first: what shipped, what slipped, what the floor and the jury caught. Its findings go into system/lessons.md below.

When real scores arrive, ask the user for them, or read them from the site's award page.
- Add a row to `system/calibration.md`: site, date, critic overall, jury estimate, real overall, the four real criteria, and the gap.
- Compare this site's metrics lines with earlier sites: where time, tokens and review cycles went.
- Add one line per lesson to `system/lessons.md`: what a real jury (or the client) rewarded or punished, specific enough to change a future decision. Stages 2 and 3 read this file on every site, which is how the system improves with each submission.
- If calibration drifts (the estimate misses by more than 0.5 twice in a row), tell the user and recommend adjusting the 7.2 pass bar.

## Verify
The live URL loads on a throttled phone, every submission is logged, and the fingerprint row has real values.

## Log
`stage 9 launch · done`, plus a skill line for each skill that ran.

## Handoff
- Next: `/award-site learn <site>` when scores arrive, or `/award-site new` for the next site.
- Usual recommendations: one thing to do differently on the next site, taken from this one's qa.md; and which fingerprint dimensions are now taken, so the next concept starts somewhere else.
- Needs from you: the award results when they come in.
