⚠️ DEGRADED: single-context (no sub-agent tool exposed; Assessment A done first, then B, then synthesis)

# Impeccable critique: Healthy Watermelon Soda hero

Target: `src/components/Hero.tsx` + `src/components/hero.css`. Direction: `DESIGN.md` (The Cut). Mode: Persuade/Experience (portfolio concept).
Evidence: `docs/hero-proof/` desktop 0/20/35/50/70/90 (1440x900), phone 0/50/90 (390x844); frames pulled with ffmpeg at 4 s steps from `docs/film/hero-desktop.mp4` (20 s) and 3.4 s steps from `docs/film/hero-phone.mp4` (17.16 s). No dev server, no live render, no hover/focus/FPS/weight measurements. `impeccable detect --json src/components/Hero.tsx` returned `[]` (markup only; it does not read `hero.css`, so "clean" is weak evidence). No source edited. Snapshot persistence skipped (read-only run).

## Verdict

The built hero is a clean, confident photographic split: two flat grounds, big Bricolage headlines, one real fruit, one line. Frame 0 (desktop-0) is strong and passes the "what is this" test. The signature move and the narrative payoff are what fall short: the "knife" is a thin line plus a wedge mask, the phone layout is not the one in DESIGN.md, and the fizz half of "Real fizz." is empty in every frame.

Heuristics (0-4, short): status 3 (tick shows progress), real-world match 3, control 3 (native scroll), consistency 3, error prevention n/a, recognition 3, flexibility n/a, minimalism 4, recovery n/a, help n/a. Design specificity: high on the headline/fruit/divider; the fact line and CTA are generic.

## A. Design and UX findings

### HIGH
1. **The cut is a mask reveal, not a blade.** desktop-20, desktop-35, film frames 2-3, selectors `[data-halves]` clip-path, `.wm-line`, `.wm-tick`. The only "knife" is a 2 px line and a 22x4 px tick (`.wm-tick`); the V opens upward from the tick via polygon clip-path, so the wedge appears with no blade, no resistance, no juice. It is the exact gap the decisions log already names ("reads as a feathered mask reveal, not a blade"); v2 fixed the seam but not the read. For the one signature interaction this is the biggest design shortfall.
2. **Phone layout contradicts the spec and wastes the screen.** phone-0, phone-90, film frames 1-5, `@media (max-width: 720px)` in `hero.css`. DESIGN.md says the phone divider runs horizontally at about 46% height with fruit above and fizz below. The build keeps the vertical split and a landscape fruit at 124vw: about 40% of the height (roughly y 300-700 of 1688 in the 2x frame) is empty ground between headline and fruit, and another ~25% below it. The fruit is a small band in a tall canvas, and the halves reach within about 10 css px of the left edge at phone-90. Phones carry equal weight per PRODUCT.md.
3. **The fizz side never pays off.** desktop-35/70/90, `.wm-fizzGround`, `.wm-headR`. "Real fizz." sits on blank blush at every scroll position; nothing bubbles, rises or pours. The hero ends on a static parted fruit followed by dead scroll (timeline ends with a 0.12 hold; section is 420vh / 380vh). The brand promise is half unmet and the first screen reads as "real fruit" only. DESIGN.md lists fizz, pour and collapse as the peak beats; they are not built.

### MEDIUM
4. **Weak support hierarchy.** desktop-0, `.wm-fact`, `.wm-cta`. The one hard claim ("No added sugar") is 15-17 px muted ink in the far bottom-left corner, 600+ px from the headline and diagonal to the CTA at bottom-right. The headlines dominate; claim and action are easy to miss and read as footer.
5. **Left fruit edge dissolves into its ground.** desktop-0, desktop-20, `.wm-fruitGround` (#DDEBC8) vs the pale rind stripes. The left silhouette of the whole fruit loses edge definition; the right edge against blush is crisper. Asymmetric figure/ground.
6. **Matte artefacts.** desktop-90 at about (620, 745), phone-90 at about (295, 1150), `[data-half-l]`. The known small nub at the left half's bottom tip is visible at hero scale; a hard dark shadow edge also shows where the left half meets the divider (desktop-35, desktop-70). These break "real".
7. **Shadow does not follow the parting.** desktop-70/90, `.wm-shadow`. One static ellipse under both halves; the halves rotate and move while the shadow does not, so they float.
8. **Divider-over-fruit seam in the whole state.** desktop-0, `.wm-line` z-index 3 over the fruit. It reads more like a crack or a rendering seam than a cutting guide; the intent is not legible until the scroll starts.

### LOW
9. **Tick is cryptic.** `.wm-tick` (22x4 px) is the only progress cue and drifts off the fruit to the bottom (96%) in the late frames, ending on the shadow.
10. **Phone fact line is 15 px** against the DESIGN.md 17-19 px body spec (`.wm-fact` in the media query).
11. **Left/right emphasis asymmetry.** Ink left, flesh red right is deliberate, but with no payoff on the right (see 3) the red headline looks like an unexplained accent.

Strengths: type pairing and scale at desktop-0; restrained palette with AA contrast; no scroll cue or eyebrow clutter; frame-0 composition is centred and calm.

## B. Functional defects (separate from design)

### HIGH
1. **Pre-hydration flash of the wrong state.** `hero.css` / `Hero.tsx`. Initial CSS has no clip-path or opacity on `[data-whole-l]`, `[data-whole-r]`, `[data-halves]`; all clipping is set by `paint()` inside `useGSAP` after hydration. Server HTML therefore paints both whole and halves layers (halves stacked on top), so users see the parted fruit and no cut until JS runs, then it snaps to whole. It also makes LCP/first paint show the wrong frame. Needs an initial CSS state (halves hidden) and a no-JS path.

### MEDIUM
2. **No visible focus style on the CTA.** `.wm-cta` has hover only (`translateY(-2px)`), no `:focus-visible` rule; the DESIGN.md "juice focus glow" is not implemented. Hover also has no touch equivalent (fine) but nothing signals keyboard focus beyond the browser default.
3. **Image loading priorities.** `Hero.tsx`: halves are `fetchPriority="low"` and decoded async, but they are needed by about 35% scroll; a fast scroller or throttled phone can reach the cut before they load (not measured here). Weight and LCP budget (3 MB, 2.5 s) not verified.
4. **Dead scroll at the end.** `.wm-hero` 420vh / 380vh with the animation done at 100% of the timeline and a trailing 0.12 hold; no next beat (see design 3). Also no `refreshPriority` or `invalidateOnRefresh` on the trigger; resizes between phone/desktop rely on matchMedia only for the reduced-motion split, while the `@media` layout swap is CSS-only. Not tested.
5. **Content commitments not visible in the hero.** DESIGN.md says AI-generated art is labelled wherever credited, and PRODUCT.md requires "contains naturally occurring sugars" next to "no added sugar"; the hero shows neither (the concept label is present).

### LOW
6. **Alt text drops after the cut.** Only the first whole image has alt; the halves have `alt=""`, so the cut-open state (flesh, seeds) has no text equivalent. The visible headlines are `aria-hidden` with a screen-reader `h1` carrying the same words (fine).
7. **Reduced-motion** shows only the parted state (`state.t = 1; part = 1`); the uncut fruit never appears, which matches DESIGN.md but loses the "whole" frame that explains the cut. Section height collapses to 100svh (fine).
8. **Detector coverage.** The CSS file was not scanned; re-run on a built page when a render is allowed.

## Questions skipped: subagent run; the caller owns follow-up.
