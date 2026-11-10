# Phase 5: ship

Packs: `seo`, `video`.

1. **Five evaluators in one message** (haiku unless noted), each writing its findings to `docs/qa/`:
   - Performance: Lighthouse on a throttled phone (LCP, CLS, weight).
   - Accessibility: axe-core plus a keyboard walk.
   - User tasks: Playwright on desktop and phone: find the primary action, complete it, reach the end.
   - SEO and metadata: seo-audit; schema where it applies.
   - Motion: review-animations (sonnet).
2. Fix what they found, then run **the blind jury** (jury skill): a fresh critic with screenshots, the film and measurements, never the code or docs. Pass is an estimate of 7.2 or more. Evidence in `.jury/`, summary in `docs/qa.md`.
3. verification-before-completion, then deploy to Vercel. Client track: `gate 3` on the production URL.
4. **Launch kit:** a 30-45 s case-study film (hyperframes), the Awwwards, FWA and CSSDA submission texts, three social posts.
5. **Learn:** set the site's row in `system/FINGERPRINTS.md` to shipped; add one or two lines to `system/lessons.md` (what cost the most, what to do differently); when real scores arrive, `learn` logs them in `system/calibration.md` and checks the jury's offset.
