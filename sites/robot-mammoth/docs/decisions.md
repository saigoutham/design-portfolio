# Robot Mammoth: decisions

Track: own
Repo: design-portfolio/sites/robot-mammoth

## Stage log
- 2026-11-09 · stage 0 setup · done
- 2026-11-09 · stage 1 intake · done
- 2026-11-09 · stage 2 research · done
- 2026-11-09 · stage 3 concept · done
- 2026-11-09 · stage 4 direction · reopened: Goutham rejected the hero proof; remodelling the robot

## Decisions
- 2026-11-09 · Created with 3D dependencies.
- 2026-11-09 · Premise, in the user's words: "life of a 3D Robot Elephant living in Lush Green Amazon Forests of Amazon". Own track, 3D from the start.
- 2026-11-09 · World (Claude's call, user delegated it conditionally): robot mammoth in snowy mountains instead of an elephant in the Amazon. A premium jungle can't be built in code to run well on phones and would need real forest imagery (no kie.ai); snow, fog and terrain can be built in code, and hiding reads instantly in a white-out. Reversible until stage 3.
- 2026-11-09 · Awards: all three (user). Claude's call: build to Awwwards' bar (usability and phone speed are 70% with design), keep the hiding effect ambitious enough for FWA, submit to all three at launch.
- 2026-11-09 · Renamed robot-elephant to robot-mammoth after the world change.
- 2026-11-09 · Time: "1hr per day" of Goutham's review time; scope is one long scroll page plus a short field-notes page.
- 2026-11-09 · find-skills: no gaps (searched procedural 3D creature, camouflage shader, snow particles); the 3d pack covers them.
- 2026-11-09 · Research: snowy-mountain scroll sites already exist (Whiteout · An Ascent; Everest · The Ascent, HM 2026-07-28), and cursor camouflage exists (The Mimic). Working idea for stage 3 is A: the ridge is the mammoth, revealed by light and fog as you scroll; the camera doesn't climb. last30days couldn't reach Reddit or HN from the cloud session; web search used instead.
- 2026-11-09 · Concept (Claude's proposal): Stakeout. One held mountainside, scrolling moves through one day, the ridge's shadow at low sun reveals the mammoth, and it only moves when the visitor stops scrolling. Grammar: continuous world through time. Runner-up: split stage (your eyes vs its sensors). Waiting for Goutham's yes before stage 4 builds anything.
- 2026-11-09 · Concept approved by Goutham: "The direct is good, the mammoth is the USP of the website."
- 2026-11-09 · Hero (Claude's call, answering "how would you make it the hero?"): the first frame shows the mammoth's eye, a lens in the snow that refocuses when the visitor holds still; the sunset shadow then shows the lens belongs to the whole ridge. The watcher's camera is high on the opposite slope so the low sun throws the shadow above the body on screen.
- 2026-11-09 · Hero proof built (src/stakeout). The low sun's shadow reads as a mammoth on desktop and phone (docs/hero-approved). Preview published as a private artifact, https://claude.ai/artifact/2254tmNbRyWppYpbZZis7b, because there's no Vercel login in this session. Known gaps: snow sheet slide, posters, field notes, night, reduced-motion stills.
- 2026-11-09 · Goutham on the hero proof: "It looks absolutely bad, I said a robot mammoth, what anything is a robot mammoth in this?" Cause: the concept hid the machine entirely and the model was rough code shapes.
- 2026-11-09 · Story order changed (Goutham): show the robot in full first, then scrolling shows how it hides until only its sunset shadow gives it away. Supersedes "hidden from the first frame" in concept.md.
- 2026-11-09 · Robot look (Goutham): polar survey machine. White ceramic armour, dark graphite joints, segmented trunk, titanium tusks, one amber light. Modelled in Blender (bpy) as a hard-surface machine; a still goes to Goutham before it enters the page.
- 2026-11-09 · Robot still v1 rendered from assets-src/robot_mammoth.py (Blender 5.2 via bpy, Cycles): docs/robot/robot-still-v1.png. Waiting for Goutham's verdict before it goes into the page.
