# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** diwali-festival-of-lights
**Generated:** 2026-11-09 by ui-ux-pro-max (category: Museum/Gallery), values revised the same day in stage 4.
**Revision note:** the generator's defaults (Swiss minimalism, `#FAFAFA` light ground, Poiret One + Didact Gothic, "art deco, gatsby") were rejected: a 1920s Western face and a daylight gallery contradict a new-moon night and six Indian art traditions. Fonts below come from ui-ux-pro-max's own google-fonts data (Indian foundries). This file stays the single source of design values; nothing else supplies competing ones.

**Scope:** these tokens govern the chrome that stays constant across all six lamps: the night, the lamps, the labels, the row, the flame, the type. Each story's painted panels carry their own tradition's palette, defined per lamp in `DESIGN.md`, and never leak into the chrome.

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable | Use |
|------|-----|--------------|-----|
| Canvas | `#0C0907` | `--night` | The new-moon night. Never pure black. |
| Surface | `#17110D` | `--night-raised` | Label band, the ledge the lamps sit on |
| Ink | `#F1E6D3` | `--ink` | All reading text (16.1:1 on canvas) |
| Ink soft | `#B9A792` | `--ink-soft` | Label secondary lines (8.5:1 on canvas) |
| Accent | `#FFB547` | `--flame` | The flame and lit states only (11.3:1). Also the focus ring. |
| Accent core | `#FFF3D1` | `--flame-core` | Inner flame |
| Accent edge | `#E8641E` | `--flame-edge` | Outer flame, glow falloff |
| Accent ink | `#1A0F08` | `--flame-ink` | Text on a flame-coloured fill (rare) |
| Clay | `#8A5434` | `--clay` | Unlit diya body (decorative, 3.2:1) |
| Clay shadow | `#4A2A18` | `--clay-shadow` | Diya underside, ledge shadow |

**Color notes:** six roles and one accent. The accent is a light source, not decoration: it appears only where something is burning or has burned. Not the cream-and-brass trap: the ground is night, and the warm colour is motivated by fire.

### Typography

- **Display:** Eczar (Rosetta, designed by Vaibhav Singh for Devanagari and Latin), weights 500 to 600. Story titles, the hero line, the closing plate.
- **Text and labels:** Anek Latin (Ek Type), variable width and weight. Body at width 100, weight 430. Labels at width 82, weight 560, uppercase, tracking 0.08em.
- **Why these:** both come from Indian type foundries and were drawn alongside Indic scripts, which is the honest reason for a heritage serif here. Two families, no italics needed.
- **Loading:** self-hosted from npm (`@fontsource-variable/eczar`, `@fontsource-variable/anek-latin`), no runtime call to a font CDN.

| Style | Font | Size / line height | Tracking |
|---|---|---|---|
| Hero line | Eczar 500 | 48/52 desktop, 32/38 phone | -0.02em |
| Story title | Eczar 600 | 40/44 desktop, 30/34 phone | -0.015em |
| Story text | Anek 430, wdth 100 | 18/29 desktop, 17/27 phone | 0.005em |
| Label title | Eczar 500 | 20/26 | 0 |
| Label meta | Anek 560, wdth 82, caps | 12/16 | 0.08em |
| Closing plate | Eczar 500 | 30/36 | -0.01em |

Light on dark: one step more weight and a touch more leading than on paper (body 1.6). `text-wrap: balance` on titles, `pretty` on text. Measure 46 to 62ch.

### Spacing Variables

| Token | Value |
|-------|-------|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-12` | 48px |
| `--space-16` | 64px |
| `--space-24` | 96px |
| `--space-32` | 128px |

### Radius and depth

- Radius: `2px` on the few UI surfaces (label band, focus ring). No pills.
- Depth comes from light, not shadow tokens: the flame's glow lights nearby clay and ledge; distance is darkness and softness. One shadow only: `--shadow-ledge: 0 12px 24px rgba(12, 9, 7, 0.8)` under the ledge.
- Grain: 4% film grain over the canvas so the night doesn't band.

---

## Component Specs

### Diya (clay lamp)
- Drawn SVG, terracotta body (`--clay`), wick, oil line. States: unlit, catching (during hold), lit, carried-to (flame waiting above it).
- Hit area at least 48 × 48 px. `role="button"`, name e.g. "Lamp 3, Rama comes home. Press and hold to light."

### Label (one schema for every lamp)
```
LAMP 3 · THE NEW-MOON NIGHT            (meta)
Rama comes home                         (label title)
TOLD IN BIHAR · DRAWN AFTER MADHUBANI   (meta, ink-soft)
```
No persuasion, no adjectives. Same order, same styles, every time.

### The row (navigation)
- Six diyas fixed at the foot of the screen once the hero has passed; each jumps to its story; lit lamps stay lit.
- `nav` named "The six lamps". Current lamp marked with `aria-current="step"`.

### Hold to light
- Press and hold 600 ms by pointer or touch; Space or Enter held by keyboard. Release early: the wick dims back.
- Progress shown by the wick brightening, not a ring or a bar.
- If the visitor scrolls on instead, the lamp lights itself after a 1.2 s pause in view.

---

## Motion

| Token | Value | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Everything that settles |
| `--dur-ui` | 180ms | Hover, focus, press |
| `--dur-catch` | 900ms | Flame catching after the hold completes |
| `--dur-glow` | 1600ms | Glow spreading into the painting |
| `--hold` | 600ms | Hold-to-light threshold |

- Animate `transform`, `opacity`, `clip-path`, and shader uniforms only.
- The flame flickers continuously only while on screen; paused offscreen and in hidden tabs.
- Scroll drives the panels' lateral pan (one scroll-linked device); nothing else moves because the page scrolled.
- **Reduced motion:** no flicker or pan. Flames are still images that fade in over 300ms; panels stack vertically; every word stays.

---

## Anti-Patterns (Do NOT Use)

- Cursor-following spotlight or any light that is not a lamp's
- Neon or outer glows as decoration (the only glow is a flame's light)
- Fade-in on every section; parallax on text; scroll-jacking the wheel
- Section-number eyebrows beyond the lamp numbers (the sequence is information here)
- "Scroll to explore" cues; custom cursors
- Em dashes in visible copy
- Violet anywhere
- Generated imitations of the six crafts; any human figure of the Sikh Gurus

---

## Pre-Delivery Checklist

- [ ] Body text 4.5:1 and labels 4.5:1 measured on the render, over panels too
- [ ] Focus ring visible (flame colour, 2px, 3px offset) on every lamp and link
- [ ] Hold to light works by touch, mouse and keyboard
- [ ] Reduced motion: complete, still, every word present
- [ ] No-WebGL: SVG flame fallback renders
- [ ] 360 × 640, 390 × 844, 768, 1024, 1440: nothing overlaps, nothing scrolls sideways
- [ ] Tap targets at least 44 px
