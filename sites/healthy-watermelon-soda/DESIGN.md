# DESIGN: Healthy Watermelon Soda (concept)

Stage 4, 2026-11-10. Values come only from `design-system/healthy-watermelon-soda/MASTER.md` (site-specific tokens section) and `design-system/tokens.css`. This file says what they are for. Concept: `docs/concept.md` (The Cut).

## Direction in one line

A real watermelon on two flat grounds, cut by the page's own line. Bright, tactile, edible. The fun is physical (the cut, the fizz, the seeds lifting), never cartoon graphics.

## World

**Photographic, AI-generated stills (changed 2026-11-10).** The Blender fruit failed the floor, so the fruit is now four Nano Banana stills supplied by Goutham (`docs/assets.md`), matted to transparent layers by `assets-src/prep_stills.py` and animated by scroll with GSAP: the knife line reveals the parted halves over the whole fruit. Label the art as AI-generated wherever the site credits it. Grounds are flat colour; no gradients, no glass, no glow. The contact shadow is a soft ellipse in the page. Phones need their own vertical stills (see decisions.md).

## What the tokens are for

| Token | Use |
|---|---|
| `--semantic-color-ground-fruit` (rind pale `#DDEBC8`) | The fruit side's ground. Holds for the whole page (split-stage rule: two grounds that hold). |
| `--semantic-color-ground-fizz` (soda blush `#FFF0F2`) | The fizz side's ground. Takes the full width at the collapse. |
| `--semantic-color-ink` (seed `#2A0E12`) | All text and the divider line. Never pure black. |
| `--semantic-color-primary` (flesh `#C41E3A`) | One use per screen at most: the fizz-side headline accent and the bubble stream. |
| `--semantic-color-accent` (rind green `#1E5631`) | The CTA only. |
| `--semantic-color-highlight` (juice `#FFE9A8`) | Specular highlights in renders and the focus glow; never text. |
| Display: Bricolage Grotesque 700 | The two side headlines and the close. Tracking -0.03em, line-height 0.86. |
| Body: Instrument Sans 400/500 | Everything else, 17–19 px, line-height 1.45, secondary text in `--semantic-color-ink-muted`. |
| Motion: `cubic-bezier(0.22, 1, 0.36, 1)`, 640 ms | Arrivals only (the hero's single entrance, label changes on the divider). Everything tied to the cut is scrubbed by scroll, never timed. |

## Hero layer plan (scroll-craft `hero-depth.md` contract)

| Plane | Asset and depth | Movement | Contact and occlusion |
|---|---|---|---|
| Far ground | Two flat colour fields, rind pale left / soda blush right (phone: top / bottom) | None | Meet exactly at the divider |
| Focal subject | The whole watermelon, rendered, alpha, lying across the divider so each half sits on its own ground | Scroll scrubs the render sequence (blade press, halves part) | Contact shadow baked into the render |
| Near detail | Seed-bubbles and juice beads, a separate rendered pass | Rises along the divider at the peak only | Passes in front of the fruit, behind the type |
| Typography | "Real fruit." left, "Real fizz." right, set against the divider; one fact line; one CTA | The hero enters once on load; type holds still afterwards | Headlines never sit on the fruit's silhouette |
| Chrome | The divider: 2 px seed-ink line with the cut's progress as a tick that travels down it | Driven by scroll | Always above the fruit |

**Hero copy (4 text elements, the taste maximum):** "Real fruit." / "Real fizz." / "A concept watermelon soda. No added sugar." / button "See how it was made". No scroll cue, no eyebrow, no em dash.

## How the signature move looks

- **Whole:** the line is drawn straight through the uncut fruit, like a guide on a cutting board.
- **The press:** as the visitor scrolls, the line's tick moves down; the render shows the fruit splitting along exactly that line, halves easing apart 2–4% of the viewport. The line and the cut stay pixel-aligned (the renders are framed with the cut on the image's centre column).
- **Held:** nothing moves for about 60% of a viewport of scroll. One body line: "Keep going."
- **Fizz (peak, the most scroll):** the flesh effervesces, seeds lift off the face and rise *along the divider*, which reads as a stream of bubbles. Bubbles are the rendered seed pass, not CSS circles.
- **Pour:** bubbles gather on the fizz side into the drink (rendered can or glass, condensation), label "No added sugar. Contains naturally occurring sugars."
- **Collapse:** the divider sweeps to the left edge; the fizz ground takes the full width; the close sits in it.

**Phone:** the divider runs across the screen at about 46% height; fruit above, fizz below; the cut travels left to right. Separate vertical renders; nothing is the desktop arrangement shrunk.

**Reduced motion / no video:** each beat shows its poster frame; the divider still moves to show progress; all copy is readable without motion.

## Checked against (check, don't replace)

- scroll-craft `taste.md` refuse list: no scroll cue, no eyebrows, no gradient text, no glass, no custom cursor, no em dash, hero at four text elements. Pass.
- design-taste-frontend checklist: the first screen says what it is with one hard fact ("No added sugar"), at most two hero actions, the product shown big, no text parallax, no fade-in on every section, no violet, contrast at AA or better on every text pair. Pass. Its "nothing moves because the page scrolled" rule is waived for the one scroll-scrubbed scene, which is the concept itself.
- elaya Part B: its "no italics", "cap weight at bold" and "no orphans (`text-wrap: balance`)" rules are adopted; its fixed font list and one-typeface rule are not (library values are evidence, not instructions).
