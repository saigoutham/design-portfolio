# Robot Mammoth: concept

Stage 3, 2026-11-09. Own track: this is Claude's proposal under creative delegation, waiting for Goutham's yes.

**It's the site where** the mountain I'd been staring at all day turned out to be a mammoth, and it only breathed when I stopped scrolling.

## Approaches

All three build on research idea A (the ridge is the mammoth).

| | Concept | Trade-off | Verdict |
|---|---|---|---|
| 1 | **Stakeout.** One held view of one mountainside. Scrolling moves through one day, first light to night. Light and fog change; the camera barely moves. | Every frame depends on one 3D asset reading two ways. | Chosen |
| 2 | **Two views.** Split screen: your eyes on the left, its sensors on the right, collapsing into one view at the reveal. | Halves the frame you're meant to search, and a phone can't hold two 3D views side by side. | Runner-up |
| 3 | **Field journal.** The mammoth's notebook, a chapter per animal; the last chapter is the observer itself. | Strongest content, but the reveal becomes a chapter instead of a held moment. | Becomes the field-notes page |

## Journey

Times of day are placeholders until stage 5 fixes a real place and date. Proposal: a high Himalayan valley where snow leopards live, such as Spiti.

1. **First light:** a white-out mountainside and one small line, "There is a mammoth on this mountain." The visitor starts looking.
2. **Fog lifts:** rocks, a herd of blue sheep crossing, a long snow ridge. Timestamped field notes start appearing in a corner, written by someone watching.
3. **Noon glare:** flat light, no shadows, nothing reads. A note says the snow leopard on the scree still hasn't noticed "me". Someone is on this mountain.
4. **Wind drops:** no notes, no snow in the air, nothing moves. A silence that's meant, and the page's one line to the visitor: "Hold still."
5. **Low sun (peak):** raking light throws the ridge's shadow across the snowfield below, and the shadow has a trunk and tusks. If the visitor is still, the ridge breathes out a plume and snow slides off its back.
6. **Its view:** one beat through the mammoth's sensors. The snow leopard, the sheep and a pika are each marked, and the notes are signed. It's a machine, built to watch animals that are still alive.
7. **Night:** it settles back into the ridge, snow closes over it, stars come out. The last note, then a line of text into the field notes. The mountain stands still, and you can't unsee it.

## Grammar: continuous world, through time instead of space

One canvas fixed for the whole scroll, waypoints instead of sections, copy arriving inside the canvas, and navigation that is a map. Here the map is the day: a time rail that stamps each waypoint as you pass it and jumps when clicked. The grammar's bans all hold: no sections, no cuts, nothing scrolls over the canvas, and one continuous grade (the day's light) is part of the world.

Why not the others:
- **Filmic one-shot:** the closest runner-up, but it bans the progress readout this day needs, and its stock hero and close are the template trap.
- **Chaptered editorial:** hard cuts would break the one held view the reveal depends on. It's the right grammar for the field-notes page.
- **Live surface:** there's no product to operate, and a painted sensor dashboard breaks its honesty rule.
- **Typographic poster:** the asset here is a landscape, not a sentence.
- **Gallery/catalog:** animals as labelled objects belong on the field-notes page.
- **Split stage:** that's concept 2; it halves the search frame and fails on phones.
- **Rhythmic cutlist:** hiding needs held time, and cuts are the opposite.

## Signature move

**It only moves when you stop.** While the visitor scrolls, the mammoth holds still. When scrolling stops for about a second, it moves a little. Before beat 5 that reads as snow shifting on the ridge, a clue for anyone who stops. At beat 5 it's a breath plume and snow sliding off its back. Scrolling again freezes it. Scrolling is looking, and looking freezes it; that's how it hides.

- **Why only here:** the mechanic is the story, a hider that freezes when watched. The Mimic reveals camouflage under the cursor, and the Everest sites turn scroll into altitude; none of them rewards stopping.
- **Every input:** stopping is the same on a wheel, a thumb and a keyboard. No cursor needed.
- **A reward, not a gate:** the shadow in beat 5 is scroll-driven, so a visitor who never stops still gets the peak.
- **Art direction rule:** until beat 5 the mammoth shares the ridge's parallax rate, colour range and snow. The reveal comes from the light, never from the mammoth entering.
- **Budget:** this is the page's only response to the visitor. No pointer parallax, no cursor effects.

## Feeling curve

| Beat | Feeling | What on screen causes it |
|---|---|---|
| 1 First light | Curiosity | A white-out and one line promising a mammoth that isn't visible |
| 2 Fog lifts | Doubt | Shapes resolve, and none of them is a mammoth |
| 3 Noon glare | Unease | Flat light, and a note written by someone on the mountain |
| 4 Wind drops | Stillness | Nothing moves; "Hold still." |
| 5 Low sun | Awe | The ridge's shadow has tusks, then the ridge breathes |
| 6 Its view | Intimacy | Its sensors, the animals it watches, the notes signed |
| 7 Night | Resolve | It settles back in; the mountain holds, changed |

Peak: "The sun went down, the ridge threw a shadow, and the shadow had tusks. Then it breathed."

Pacing, a proposal for stage 6: about 12 viewport-heights at one steady pace. Beat 5 gets the longest stretch (about 3), beat 4 the shortest (about 1).

## Fingerprint check

`system/FINGERPRINTS.md` has no launched rows yet, only this site's planned one, so there's nothing to clear. The real competition is the two 2026 mountain sites, checked the same way. Their values come from their Awwwards descriptions; neither site was visited.

| Against | Grammar | Nav | Hero | Act shape | Close | Signature | Differs on |
|---|---|---|---|---|---|---|---|
| Whiteout · An Ascent | same | similar: altitude rail vs time rail | differs: base camp vs a hidden creature in white-out | differs: a climb vs a held view | differs: summit vs going back into hiding | differs: scroll is altitude vs freezes when watched | 4 of 6 |
| Everest · The Ascent | likely same | unknown | differs | differs | differs | differs | at least 4 of 6 |

## Risks and fallbacks

- **The asset.** A mammoth that reads as a ridge from the front and throws a mammoth's profile as a shadow from the side. With kie.ai ruled out, it's modelled in code or adapted from a licensed model. Stage 4's hero proof tests this first. Fallback: if the shadow doesn't read, the peak becomes the snow sliding off and the breath, still scroll-driven.
- **Fast scrollers miss the breath.** Beat 4's "Hold still." asks for it, and the shadow reveal doesn't depend on it.
- **Phone cost of real-time shadows.** Bake the terrain's light per waypoint and keep one real-time shadow, the mammoth's, with a phone poster for every beat.
- **Reduced motion.** The day becomes seven still frames, the peak shown with its shadow and breath, and no extra pinned space.
