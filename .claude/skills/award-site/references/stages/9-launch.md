# Stage 9: Launch and learn

Goal: the site live, submitted, and its lessons fed back into the system.

1. **Deploy** to Vercel. Sites in this repo deploy with Root Directory set to `sites/<site>`; a site in its own repo deploys from its root. Client track: the client approves the production URL; log `gate 3 · approved · <who>`. Write `docs/editing-guide.md`: how the client edits content, in their terms, not ours.
2. **Case-study video** (`npm run setup -- --with video`): **hyperframes** renders HTML, so it can reuse the site's own pages; **remotion-best-practices** if you need more control. Check **remotion-license** before using Remotion: it's free for individuals and companies of up to 3 people, and on client work the licence falls on whoever owns the video. For a short explainer of how the signature move works (geometry, data, physics), the `manim` pack is an option.
3. **Submissions:** Awwwards, FWA, CSS Design Awards. Use contact-sheet screenshots, a short description built on the tell-someone sentence, the stack and the credits. Log each submission with its date.
4. **Fingerprint:** update the site's row in `system/FINGERPRINTS.md` from `planned` to its final six dimensions, and add to "What is taken" whatever this site claimed.

## Learn (`/award-site learn <site>`)
When real scores arrive, ask the user for them (or read them from the site's award page):
- Add a row to `system/calibration.md`: site, date, critic overall, jury estimate, real overall, the four real criteria, the gap.
- Add one line per lesson to `system/lessons.md`: what a real jury rewarded or punished, specific enough to change a future decision. Stages 2 and 3 read this file on every site, which is how the system gets better with each submission.
- If calibration drifts (the estimate misses by more than 0.5 twice in a row), tell the user and recommend adjusting the 7.2 pass bar.

Log `stage 9 launch · done`.

## Handoff
- Next: `/award-site learn <site>` when scores arrive, or `/award-site new` for the next site.
- Usual recommendations: one thing to do differently on the next site, taken from this one's qa.md; which fingerprint dimensions are now taken, so the next concept starts somewhere else.
- Needs from you: the award results when they come in.
