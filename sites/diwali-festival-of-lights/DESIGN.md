# Design direction

Stage 4, 2026-11-09. Values live in `design-system/diwali-festival-of-lights/MASTER.md`; this file says what they are for and how the page looks. Concept: `docs/concept.md`.

## Direction in one line

A lamp-lit gallery on a new-moon night: the chrome is darkness, clay and one flame, held perfectly constant, so that six different painting traditions can change around it without the site falling apart.

## Two worlds, one rule

1. **The night (chrome).** Nocturne logic from scroll-craft's worlds: practical light only. The only light source on the page is a flame. Grain at 4%. No moon (it is Amavasya), a few faint stars, a stone ledge, six clay diyas.
2. **The paintings (content).** An illustrated world, earned because drawing is the subject: each lamp opens a world drawn after one living tradition. Drawn as layered vector art in code, credited "after <tradition>". Each tradition keeps its own palette, line and border grammar; none of it leaks into the chrome.

The rule that joins them: **the flame is drawn identically in both worlds.** Inside a Pattachitra panel or a leather-puppet screen it is the same procedural flame, the same `--flame` colours. That is what makes the signature legible.

## What the tokens are for

| Token | Job |
|---|---|
| `--night` | Everything that is not lit. Also the gutter around every painted panel. |
| `--night-raised` | The ledge and the label band: the only "surfaces". |
| `--ink`, `--ink-soft` | Reading text and label meta. Never placed directly on a painting; text sits in the label band. |
| `--flame`, `--flame-core`, `--flame-edge` | Fire, glow, lit lamps in the row, the focus ring. Nothing else. |
| `--clay`, `--clay-shadow` | The six diyas, unlit. Clay warms toward `--flame-edge` as light reaches it. |
| Eczar | Anything said with a voice: the hero line, story titles, the closing plate. |
| Anek Latin | Anything read or scanned: story text, label meta, the row's names. |

## Per-lamp palettes (inside the paintings only)

Taken from each tradition's pigments; to be checked against museum references at stage 5.

| Lamp | Tradition | Ground | Line | Fills | Border grammar |
|---|---|---|---|---|---|
| 1 Lakshmi | Pattachitra | Vermilion `#A8301F` | Soot black `#1C1410`, fine, unbroken | Haritala yellow `#E3B341`, conch white `#F3EADA`, leaf green `#4F7A3A`, indigo `#2E4A7A` | Two or three nested bands: scalloped petals, a dotted rule, a creeper |
| 2 Narakasura | Tholu Bommalata | Backlit screen `#F5DDA8` fading to night | Perforated outlines (light shows through holes) | Dyed translucent leather: red `#C8382A`, green `#3C8A4A`, ochre `#D9A441` | No border: the screen's edge and the lamp behind it |
| 3 Rama | Madhubani | Handmade paper `#EFE0C2` | Black double outline with hatching (Kachni) | Red `#C2272D`, turmeric `#F0B12E`, green `#2E7D4F`, blue `#2B4C9B`, pink `#D9577A` (Bharni) | Fish, lotus and leaf bands; every gap filled |
| 4 Mahavira | Kalpasutra | Red `#B3261E` | Black, angular | Ultramarine `#233C8C`, gold `#C9A23A`, white | Thin gold rules; text-block margins as on a folio |
| 5 Bandi Chhor | Phulkari | Khaddar madder `#6B1D17` | None: stitched geometry | Floss silk gold `#E9B44C`, orange `#E07B2A`, white `#F6EBD6` | Diamond and chevron darning bands; the Harmandir in gold over dark water |
| 6 Bali | Dashavatara Ganjifa | Lacquered green `#2F6B3F` (Vamana suit) | Fine black and gold | Vermilion, white, yellow, gold dots | Circular card edge with dotted gold border |

## The hero (first screen)

Opening, midpoint and exit, in plain words:
- **Opening:** near darkness. A stone ledge, six clay diyas at rest on it, a faint ember at the wick of lamp 1 grazing its rim with light. The line "On the darkest night, India lights lamps for many reasons. Here are six." Lamp 1's label. The wick is the control: "Hold to light".
- **Midpoint (hold):** the wick brightens while held; at 600 ms the flame catches, grows over 900 ms and its light spreads across the ledge, warming the other five diyas' clay and lifting the darkness off lamp 1's label.
- **Exit:** the glow keeps spreading outward from the lamp, and inside it the first Pattachitra panel develops, as if the light were revealing what was always there; the row slides down and settles at the foot of the screen as navigation, lamp 1 lit.

### Layer contract

| Plane | Asset | Movement | Contact / occlusion |
|---|---|---|---|
| Far: night | CSS ground + sparse SVG stars + grain | Barely: 4% of scroll | No moon |
| Mid: ledge | SVG stone ledge, `--night-raised`, lit only by flame | 30% of scroll travel | The diyas sit on it, shared baseline |
| Focal: six diyas | SVG clay lamps | Ride the ledge, then translate and scale down into the row | Never leave the ledge until they become the row |
| Atmosphere: light | WebGL flame + radial glow (canvas) | Driven by the flame state, not scroll | Glow sits over the ledge and diyas, under the type |
| Type | `h1`, label, hold control | Stable; fades as the panel develops | Never over a painting |

### Phone (art-directed separately)
- 390 × 844: the line sits above the ledge at 32/38; the six diyas span 336px (56px each), lamp 1 enlarged to 72px so the hold target is generous.
- 360 × 640: the line drops to two short lines; ledge at 62% of the height; the label sits below the ledge.

## How the signature looks

- **The flame:** a small fragment shader (layered noise, tapered teardrop, core `--flame-core` to edge `--flame-edge`), about 40 × 64 px at rest. Fallback without WebGL: three stacked SVG teardrops with a GSAP opacity flicker.
- **Catching:** the wick's ember brightens with hold progress; the flame enters from `scale(0.6)` on `--ease-out` over `--dur-catch`.
- **Lifting out:** at the end of a story, the painting's own lamp (drawn in that tradition) shows the same procedural flame; it detaches, rises 40 px, and travels along the row to the next diya, where it hovers and waits.
- **The row:** lit diyas carry a smaller static flame; unlit ones stay clay. The row is the only persistent chrome.

## Stand-ins at the hero proof

- All art is drawn in code from the start, so there are no photographic stand-ins. The Pattachitra panel at the proof is panel 1 only and will be refined at stage 5.
- The hero line is a placeholder until stage 5 writes the final copy.
- Preview: no Vercel access in this workspace, so the proof is published as a private static preview artifact until Goutham connects Vercel.
