# Healthy Watermelon Soda: concept

Stage 3, 2026-11-10. Own track: this is the studio's proposal, waiting for Goutham's yes. Reads: docs/brief.md, docs/research.md (opportunity 1: the fruit is the hero, the visitor makes it happen).

**It's the site where** I cut a watermelon by scrolling and it turned into soda.

## Approaches

All three carry the brief's moment (option A: scrolling slices a real watermelon, the flesh fizzes, the seeds rise as bubbles).

| | Concept | Trade-off | Verdict |
|---|---|---|---|
| 1 | **The Cut** (split stage). The screen's dividing line *is* the knife. One half of the page is the fruit, the other the fizz. Scrolling drives the blade down the line, the halves part, the cut face fizzes and the seeds stream up the divider as bubbles. The close is the divider sweeping to the edge so the soda takes the whole screen. | The structure and the idea are the same thing, so nothing is decoration. Needs two rendered layers (a left and a right half) and a separate phone composition (the cut runs across, not down). | **Chosen** |
| 2 | **One Slice** (filmic one-shot). A single scroll-scrubbed shot: a whole watermelon, the slice, the fizz, the drink. | Easiest to build and the lightest on phones. But it's the default grammar four scroll-craft sites already share, and it's closest to PERKFORM's can-through-a-splash. The jury has seen this shape. | Runner-up |
| 3 | **Chop** (rhythmic cutlist). Every section is one knife chop: hard cuts, loud bar, high energy, the drink brand as a pulse. | Fits "fun" and youth drinks well. But the grammar bans pinning, and the slice needs one held, continuous moment to land. | Rejected |

## Journey

1. **Whole:** a whole watermelon, split down the middle of the screen by a thin line that hasn't cut anything yet. Left headline "Real fruit." Right headline "Real fizz." The visitor understands the two sides before scrolling.
2. **The press:** scrolling pushes the blade down the line; the halves part a few millimetres and juice beads on the edge. Left: what's in a watermelon (plain, checkable facts). Right: what a soda usually brings that this one doesn't (added sugar), in plain words, no numbers.
3. **Held:** the halves stand apart, the cut face glistening, nothing moves. One line, the page's only "you": "Keep going."
4. **Fizz (peak):** the red flesh starts to fizz, the seeds lift off and rise as bubbles, and the divider becomes a stream of bubbles running up the page.
5. **Pour:** the bubbles gather into the right column and settle as the drink: a can or glass of the concept soda, with "No added sugar. Contains naturally occurring sugars."
6. **Collapse (close):** the divider sweeps to the left edge, the soda takes the full width, and the page stops on the drink, "See how it was made", "Work with me", and a plain "A concept brand by Goutham".

Brand name: not yet. It's chosen with the copy at stage 5 (copywriting), checked against existing Indian drink brands.

## Grammar: split stage

Two columns held in tension for the whole page, resolved by scroll. Here the two sides are *fruit* and *fizz*, the argument is "you usually get one or the other", and the resolution is that this drink is both. The divider is the chrome: it carries both labels and shows how far the cut has gone. It's also the knife.

The grammar's bans hold: nothing full-bleed before the collapse, no centred copy, no corner-anchored hero, no symmetric close, no `pan`, `spotlight` or `magnet`, at most one `scrub`, and two grounds that hold (rind green on the fruit side, soda pink on the fizz side). Both columns carry real content all the way down.

Why not the others:
- **Filmic one-shot:** concept 2. It's the template trap, and it can't show "two sides becoming one".
- **Chaptered editorial:** there's no long-form substance; a printed feature would bury the slice.
- **Live surface:** there's no software to operate.
- **Continuous world:** taken by robot-mammoth, and there's no journey through a place.
- **Typographic poster:** the asset is a fruit, not a sentence.
- **Gallery/catalog:** one product, one flavour; nothing to browse.
- **Rhythmic cutlist:** concept 3; it bans the hold the slice needs.

## Signature move

**The divider is the knife.** The page's own navigation line cuts the fruit. Scroll drives the blade, the halves part on either side of it, and at the peak the line itself turns into a rising stream of seeds-as-bubbles. At the close it sweeps aside to hand the screen to the drink. The chrome, the cut and the fizz are one object; no other site's divider does anything but divide.

On phones the split runs across the screen: the top half is the fruit, the bottom the fizz, and the cut travels left to right under the thumb.

## Feeling curve

| Beat | Feeling | What on screen causes it |
|---|---|---|
| 1 Whole | Curiosity | A whole fruit with an uncut line through it, two headlines readable at once |
| 2 The press | Anticipation | The blade moving under the visitor's scroll, juice beading on the edge |
| 3 Held | Stillness | Both halves apart and motionless, one quiet line |
| 4 Fizz | Delight | The flesh fizzing and the seeds rising as bubbles up the divider (most scroll room) |
| 5 Pour | Appetite | The bubbles settling into a cold drink, condensation, the honest label |
| 6 Collapse | Resolve | The divider sweeping aside, the soda taking the whole screen, the page stopping |

Peak: beat 4, said the way a visitor would tell a friend: "I cut the watermelon open and the seeds started floating up like bubbles."

## Rendering route (risk and fallback)

- **Route:** the fruit is a Blender model with photo textures, rendered (Cycles) as image sequences for each half and for the fizz, encoded as scroll-scrubbed video (scroll-craft `encode.sh`). Phones get their own vertical render. Live 3D on desktop is an optional layer later, never what the page depends on.
- **Risk:** a watermelon that looks plastic. That kills the concept, so the model is checked as a still on day 2, before any page code.
- **Fallback:** real photography. A real watermelon cut on a turntable, shot frame by frame against a plain backdrop, then keyed. It's cheap and real, and it uses floor rule 2's preferred source.

## Fingerprint check

`system/FINGERPRINTS.md` has one row: robot-mammoth, still `planned`, compared here using its docs/concept.md. The Diwali site lives on its own branch and has no row.

| Against | Grammar | Nav | Hero | Act shape | Close | Signature | Differs on |
|---|---|---|---|---|---|---|---|
| robot-mammoth | continuous world vs split stage | time-rail map vs the divider as chrome | establishing mountainside vs 50/50 whole fruit | 7 worldflight waypoints vs 6 pinned split beats | arrival in a place vs divider collapse to one edge | breathes when you stop vs the divider is the knife | 6 of 6 |

Passes (needs 4).
