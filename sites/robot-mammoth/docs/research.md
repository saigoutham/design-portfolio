# Robot Mammoth: research

Stage 2, 2026-11-09. Own track, so no competitor lane. Raw notes in `docs/research/raw/` (not committed).

## What changes the plan

The snowy-mountain world is already taken twice this year. Two Awwwards entries in 2026 are scroll-driven WebGL mountains:
- **Whiteout · An Ascent**: a procedural Everest, lit in real time; "Scroll is altitude", from base camp to summit. Award status unknown (the page blocks fetching).
- **Everest · The Ascent**: Honorable Mention, 2026-07-28. A cinematic ascent of real terrain, built solo in Three.js, that tunes its own quality to the visitor's machine. Palette #070B12 and #D8B787 (dark).

So the mountain can't be the idea. The hidden mammoth has to carry the site, and the camera must not climb.

## Audience and uniqueness

last30days couldn't reach Reddit or Hacker News from this cloud session (403 through the proxy), so this lane used web search instead. Treat it as thinner than planned.

| Finding | Source | Confidence |
|---|---|---|
| Camouflage revealed by the cursor is done: creatures hidden in a scene appear where the cursor disturbs it. Idea B is out. | The Mimic, artificialnoodles | Certain |
| A mammoth site exists, but it's an exploration, not a hiding game. | National Geographic, Waking the Baby Mammoth | Certain |
| Two 2026 sites make scroll = climbing a snowy mountain. | Awwwards: Whiteout · An Ascent; Everest · The Ascent | Certain |
| No site found where the landscape itself turns out to be the creature, revealed by scroll. Idea A looks open. | 4 searches, nothing matched | Likely |
| 2026 SOTD winners favour restraint: one or two strong moments, a scroll-driven story, custom shaders, accessibility. | svilenkovic.com, Awwwards 2026 3D | Likely |
| 3D sites lose on Usability: The Spark (SOTD 2025-12-08) scored 7.29 overall with Usability 6.58 and Creativity 8. | Awwwards | Certain |
| About 61% of Q1 2026 SOTDs were immersive 3D. | Digital Strategy Force (third-party count) | Guessing |

## Taste

Three MotionSites examples and two scroll-craft files (`approved-collection.md`, `hero-depth.md`). scroll-craft's approved set already holds two mountain heroes and a mountains-and-mist example, so a new palette or subject alone earns no fingerprint credit; the difference has to be structural.

| Reference | Why it's close | Values worth keeping |
|---|---|---|
| Mostar Guide | Sticky layered landscape scrubbed over a long scroll | Stage sticky `100vh`, min `620px`, section `100vh + 3700px`. Scroll lerp `0.14`, pointer lerp `0.12` (pointer `-0.5..0.5`). Beat windows with `smoothstep`, `active = enter * (1 - exit)`. Pointer depth: back `-12/-4px`, focal `18/8px`, near `22/10px`. Back layers `blur 0 -> 14px`, `brightness 1 -> 0.745`. Display serif `14rem / 0.78`, stepping to `4.5rem` at <=640px; body `1.18rem / 1.18`, weight 500. Panels `640ms cubic-bezier(0.22, 1, 0.36, 1)`. Reduced motion drops lerp and pointer but still scrubs. |
| Interactive Discovery | A pixel-aligned second image of the same terrain, shown through a soft mask | Mask radius `260px`, lerp `0.1`; alpha stops `0:1, .4:1, .6:.75, .75:.4, .88:.12, 1:0`. Entrance `cubic-bezier(0.16, 1, 0.3, 1)`: heading `translateY 28px`, `blur 12px -> 0`, `1.1s`, delays `0.25s / 0.42s`. Heading `48/72/96px`, line-height `0.95`. Side copy `14px / 1.625`, max `260px`. |
| Stillmind | Quiet nature scene, restrained serif | The only one whose type turns dark over a light scene: `#182C41` over `700ms`. Heading `36–88px`, line-height `1.1`. Crossfades `1000ms ease-in-out`. Overlay bob `-6px`, `3s`, held at `scale(1.03)`. |

Rules from scroll-craft that bind this hero:
- Write a layer contract before making assets: far environment, midground, focal subject, near foreground, atmosphere, type. Each row gets its asset, movement and occlusion rule.
- Depth must come from different rates and occlusion; layers moving as one image don't count.
- Atmosphere separates planes without washing out the page or hiding the subject.
- The opening reads complete before any scroll; scrolling must reveal a spatial relationship.
- Render exact desktop and phone posters from the final scene; WebGL-off must not be blank or stock.
- Reduced motion gets a complete static composition with no extra pinned space.
- Art-direct the phone separately at 360 × 640; pointer response only ever adds.

What this site should do differently from all three:
- **Swap subject and background.** Every reference gives its subject the most contrast and the fastest rate. Here the mammoth shares the ridge's rate and value range until the reveal.
- **Run atmosphere in reverse, toward white.** Start in fog and clear toward the subject. All three references load on `#000`; this one loads on the fog colour, so the poster, loading and WebGL-off states read as snow. Type goes dark on light.
- **Quiet chrome.** No glass pill nav, no saturated button, no 14rem title across the ridge. The motion budget goes to the search and the reveal.
- **The reveal can't be cursor-only.** Interactive Discovery's mask becomes a scroll-driven sensor pass in the shader, so touch and keyboard visitors find the mammoth too.

Technique recipes to read at stage 6: `scroll.md` (sticky stage), `depth-and-interaction.md` (pointer depth, reveal mask), `video-and-media.md` (edge scrims), `3d-and-webgl.md` (GLB hero), all in `library/motionsites/references/techniques/`.

## Lessons

`system/lessons.md` is empty; this is the first site through the pipeline.

## Three opportunities

1. **Scroll is looking, not climbing.** Both mountain sites move the camera up. Keep the camera nearly still on one mountainside and let scroll change the conditions instead: fog thins, the sun drops and rakes the snow, a sensor view switches on. The hero and the act shape then differ from both. This is the one I'd build the concept on.
2. **The world reveals the mammoth, not the visitor's hand.** The Mimic owns "move the cursor to find it". Here the reveal comes from something the mountain does: low sun throws the ridge's shadow into a mammoth's outline, or snow slides off its back when it breathes. One peak, which matches what 2026 winners reward.
3. **Win the 30% that 3D sites lose.** Usability is where The Spark dropped to 6.58. A high-key white page (both mountain sites are dark), a poster frame that loads first, a phone path that keeps the reveal, and a reduced-motion version that still lands the peak as a still sequence. The field-notes page carries Content: real animals the mammoth watches, with real facts.
