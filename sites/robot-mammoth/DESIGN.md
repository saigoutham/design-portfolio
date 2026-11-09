# Robot Mammoth: design direction

Stage 4, 2026-11-09. Values come from `design-system/robot-mammoth/MASTER.md`; this file says what they're for. Concept: `docs/concept.md`.

## Direction

A high-key, natural-documentary world, framed like a long-lens stakeout. White-out snow, cold air, one held view, and the day's light doing the storytelling. The type is a quiet field notebook laid over the world, and nothing in the chrome competes with the ridge.

## The mammoth is the hero

It's the largest form on the first screen. It lies along the ridge with its back continuing the ridge line, its head lowered into a drift, and its tusks white against white. The ridge sits where the eye lands (right of centre, about 60% of the frame's width), and the one line on screen tells the visitor to look for it. The page never shows it outright until the light does at beat 5.

**Its eye is the hook.** One thing in the white frame is man-made: a dark lens about 25px across, set in the snow at the right-hand end of the ridge. A visitor who lands and holds still sees it refocus. They read it as a small camera hidden in the snow. At beat 5 the shadow shows the lens belongs to the whole ridge, so the peak is a jump in scale as well as a reveal. (Claude's call, 2026-11-09, answering "how would you make it the hero?")

Outside the page it's shown openly: the share image, the Awwwards thumbnail and the field-notes header all use the low-sun frame with the shadow.

## Tokens and what they're for

| Token (MASTER.md) | Value | Used for |
|---|---|---|
| `--color-background` | `#F8FAFC` | Snow and fog, the page ground, posters and loading. Never black. |
| `--color-muted` | `#E9EEF5` | Fog on the far plane, first-light sky |
| `--color-foreground` | `#0F172A` | Body ink |
| `--color-primary` | `#1E3A5F` | Shadow navy: the reveal's shadow, the night sky, the time rail's current mark |
| `--color-accent` | `#B45309` | Low-sun amber. Only at the peak and on the field-notes link. Never a button fill. |
| `--color-muted-foreground` | `#475569` | Field-note timestamps, rail labels |
| `--color-border` | `#CBD5E1` | The time rail's hairline |

Scene colours are mixes of these tokens, so MASTER.md stays the only source: lit snow at low sun is `background` with 22% `accent`; the reveal's shadow is `primary` with 15% `background`; the noon sky is `background`.

Type: **Crimson Pro** for the line, "Hold still." and the field notes' headings; **Atkinson Hyperlegible** for notes, timestamps and the rail. Spacing uses MASTER's 4 to 64px scale; copy sits on columns 1 to 4 of a 12-column grid.

Not used from MASTER.md on this page: the newsletter page pattern, buttons, cards, modals and hover lift. The page's only action is a text link.

## World

Real 3D (React Three Fiber). From scroll-craft's worlds: high-key lighting with natural-documentary honesty. Available light only, no bloom, no lens flare, fine grain. Light-canvas rules apply: any scrim washes toward the snow, never toward black, and type stays ink.

## Hero layer plan

| Plane | Asset | Movement | Occlusion |
|---|---|---|---|
| Far | Sky gradient and distant peaks in fog | Slowest (about 0.2× the camera's travel) | Behind everything |
| Rear atmosphere | Fog bank between the far peaks and the ridge | Thins as the day goes on | Veils the far plane |
| Back slope | A snow face behind the ridge, facing the camera | About 0.5× | Receives the mammoth's shadow at low sun |
| Subject | The mammoth under a snow mantle, lying along the ridge | **The same rate as the back slope until beat 5** | Covers the back slope's base |
| Foreground | Scree and snow-covered rocks along the bottom edge | Fastest (about 1.6×), rising slightly | Covers the mammoth's legs and belly |
| Front atmosphere | Sparse drifting snow near the camera | Wind-driven; stops dead at beat 4 | In front of everything |
| Copy | HTML: the line, field notes, time rail | Fixed, no parallax | Above the canvas, in the sky's empty space |

**Camera:** the watcher sits high on the opposite slope with a long lens (about 22° vertical on desktop), looking down about 24° at the ridge. One idea only, a slow push-in of a few metres across the whole day, like a watcher leaning in. No climb, no orbit.

**Why the camera is high:** a low sun from behind the watcher throws every shadow away from the camera. The mammoth's shadow appears *above* it on screen, clear of its body, only when the camera looks down more steeply than the sun's angle. So the camera is high and the sun drops to about 3°. Its shadow crosses the snowfield behind the ridge and stands up on the far slope.

**Light by waypoint:**

| Waypoint | Sun | Fog | Look |
|---|---|---|---|
| First light | Just above the far range, behind | Heavy | Everything near `#E9EEF5`; shapes barely there |
| Noon | High (about 60°) | Light | Flat and bright; shadows short and soft, nothing reads |
| Low sun | About 3°, from behind the watcher, slightly right | Clear | Warm lit snow; the snowfield behind the ridge falls into navy shadow, and the mammoth's shadow rises from it onto the far slope |

Why the shadow reveals it: light from behind the watcher flattens the mammoth: no shading on the side we see, white on white, its outline broken by drifts. Its shadow ignores colour and texture and shows only the outline, crisp and dark on lit snow, so the dome, trunk and tusks finally read. As the sun drops, the shadow travels: across the snowfield, then up the far slope, until the profile stands upright.

## The signature move, visually

The page treats about 900ms with no scrolling as "the visitor is holding still".
- **Every stop:** the lens refocuses (the iris narrows and opens, the housing turns a few degrees, about 1.4s). A visitor who lands and doesn't scroll sees this first.
- **Before beat 5:** a small trickle of snow slides off the ridge's shoulder (10 to 15 flakes, about 1.2s). Easy to dismiss as wind.
- **At beat 5:** a breath plume rises from the trunk (soft white, about 2.5s, fading), and a sheet of snow slides off its back, showing a dull metal seam for a moment.
- **Any scroll** freezes the body within 150ms. Falling snow keeps falling; the plume fades out.
- **Reduced motion:** no stillness motion. The peak shows the shadow and a still plume.

## Copy layer

- **The line:** "There is a mammoth on this mountain." Crimson Pro 500, `clamp(1.75rem, 1.2rem + 2vw, 3rem)`, ink, upper left. At least 4.5:1 against the fog behind it, measured on the render.
- **Field notes:** Atkinson 0.875rem, tabular timestamps in muted ink, bottom left, arriving a line at a time.
- **Time rail:** right edge, a vertical hairline with one tick per waypoint and Atkinson 0.75rem labels. Clickable; the current waypoint is marked in navy.
- **"Hold still."** at beat 4: Crimson Pro italic, centred, the only centred text on the page.

## Motion tokens

- One GSAP timeline for the whole day, scrubbed by ScrollTrigger, with Lenis on GSAP's ticker.
- Copy enters over 600ms, `cubic-bezier(0.22, 1, 0.36, 1)`, rising 8px with opacity. No blur-in.
- Stillness: 900ms threshold, 150ms freeze.

## Phone

Art-directed at 360 × 640, not shrunk. Landscape frames keep about 44 m of ridge across the width; portrait keeps 28 m, so the mammoth spans most of the phone and the taller frame leaves room for the shadow above it. The copy sits above the ridge, and the time rail becomes a hairline across the top. Pixel density is capped at 1.5 and shadow maps at 1024 (2048 on desktop), with a poster per waypoint rendered from the final scene (stage 7).

## Noon glare

Noon raises the exposure to 1.4 so the snow bleaches and the mammoth all but disappears. Only the lens and a faint line of tusk survive, which is the doubt beat working.

## Hero proof (2026-11-09)

Built for real in `src/stakeout/`: terrain, a procedural mammoth (one lofted body plus trunk and tusks, all in the same snow material), the lens, the sun and fog by waypoint, snowfall, the GSAP-scrubbed day with Lenis on GSAP's ticker, and the stillness move (the lens refocuses on every stop; trickle before the peak, breath and plume after). The copy layer and time rail are included.

- Preview: https://claude.ai/artifact/2254tmNbRyWppYpbZZis7b (the same code bundled as a standalone page: this session has no Vercel login, so there's no Vercel preview yet).
- Screenshots: `docs/hero-approved/`, desktop and phone, at first light and at low sun.
- Not in the proof yet: the snow sheet sliding off its back, the waypoint posters, the field notes, the night beat and the reduced-motion still sequence.

## Refused on this site

No glass pill navigation, saturated buttons, custom cursor, bloom, lens flare, cursor-driven effects, a 14rem title over the ridge, or a black loading screen.
