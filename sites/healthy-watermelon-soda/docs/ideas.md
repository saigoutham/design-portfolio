made-with: brainstorming, docs/brief.md (owner's words), docs/research.md (references, cliches, angles), lessons from 12 critic files in docs/archive/round-1/critics

# Ideas (phase 2, step c2)

What the critics taught (12 blind reviews): the owner's fruit photos pass on craft every time; every idea that was "fruit plus fizz, revealed" stalled at Creativity 5-6. So each idea below is an interaction or a situation, not a reveal, and each puts the photos where they already pass.

## 1. The screen sweats
The page is ice cold. It opens fogged with condensation, beaded with droplets, over the owner's fruit photos. You wipe the fog with your finger or cursor to read the headline; droplets run down your trails; the fog slowly creeps back. Scrolling deeper makes it colder: more beads, a frost edge. The end: "Drink it before it warms up."
- Tells a friend: "The website fogged up and I had to wipe it to read."
- Code: a fog/condensation shader over the photos (wipe trails in a render target, droplets as refractive beads); GSAP on scroll for temperature.
- Avoids: the reveal. The visitor does the action.
- Risk: rain-on-glass is a known WebGL demo; the wipe-to-read and the creeping fog have to carry it. Must work by touch, mouse and keyboard (reduced motion: no fog).

## 2. Shake before opening
Scroll is shaking the can. Scroll speed builds pressure: a gauge in the type, bubbles crowding up the page, the layout trembling more each section. The last section is the ring-pull: one click and everything sprays across the screen, then settles into the clean product page.
- Tells a friend: "I shook it too hard and the site exploded."
- Code: a bubble field driven by scroll velocity, GSAP shake on the layout, one particle burst at the pull.
- Avoids: passive scrolling; the payoff is earned.
- Risk: a fast scroller sees chaos, a slow one sees nothing; tune pressure to scroll distance, not just speed. Shake must stay gentle for motion-sensitive users.

## 3. Nothing added
The page starts as every soda ad at once: loud labels, sugar numbers, flavour bursts, mascots, "NEW!" stickers piled over each other. Each scroll strips one thing off (stickers peel, numbers fall, colour drains) until only the fruit photo and one line remain: "Watermelon. Water. Fizz. Nothing added."
- Tells a friend: "It started like a junk-food ad and stripped itself down to a watermelon."
- Code: layered DOM/SVG/canvas elements peeled and dropped with GSAP physics; the end state is the photo.
- Avoids: fruit-as-hero from the first frame; the brand's claim is the motion.
- Risk: the cluttered opening must be designed well to read as satire, not as a bad site. Mustn't name or mimic real brands.

## 4. The page is the slice
The whole page is one watermelon slice seen from the rind inward. The rind is the nav; the pale band is the intro; the red flesh is the content; the seeds are links. Click a seed to spit it: it flies across the page and lands, opening its story (how it's made, no added sugar, contact).
- Tells a friend: "You navigate by spitting seeds."
- Code: the cut-face photo as a long vertical canvas, seeds as interactive objects with GSAP physics arcs.
- Avoids: a reveal; the fruit is the interface.
- Risk: spitting is playful but could read as gross; the seed as a link must be obvious at a glance.

## Studio pick
1, the screen sweats. It is the most physical and the most "cold soda", the visitor does the action, and the art underneath is the owner's photo, which already passes. 3 is the strongest on the brand's claim if the owner wants the site to argue rather than play.
