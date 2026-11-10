# Council brief: art route for the hero and animatic v2

**Decision.** Which art route should the healthy-watermelon-soda hero (and the animatic that now comes before any site code) use, so it can pass a blind Awwwards-style jury at 7.2+ and the owner's own bar?

**Concept.** "The Cut": a split screen, green "Real fruit." left, blush "Real fizz." right. The divider is the knife: scrolling cuts a watermelon, the halves part, seeds rise, the screen collapses to blush, a glass of watermelon soda pours. Concept brand, own portfolio piece, target Awwwards Site of the Day.

**Options.**
- A. Pure code: procedural shaders for rind, flesh, seeds, glass and liquid in three.js/R3F. No photos.
- B. Hybrid: the owner's AI-generated stills (Nano Banana, consistent series: whole melon, halves, cut face, glass) used as textures/materials on coded 3D geometry; all motion in code.
- C. Generated video: an image-to-video clip (Higgsfield/Veo/Kling) of the cut, extracted to frames and scrubbed on scroll, with coded UI around it.
- D. Status quo: flat photo layers moved by clip-path masks, polished further.

**Evidence.**
- D as built: blind critic 6.5, MotionSites rubric 7.1 (bar 7.2+, none under 7). Owner: "the animations are absolute shit". Frames: `evidence/photo-site-phone-frames.png`, `evidence/photo-site-pour-frames.png`.
- A as built in one pass (animatic v1, canvas-painted textures, no shader work, no r3f skills used, no critics): motion is real (V-cut hinge, faces turn to camera, juice, seeds, pour). Art reads stylized: zebra-regular rind, flat pink liquid, glass with no refraction. Owner: "Is that the best you can code?" Frames: `evidence/animatic-v1-frames.png`.
- Owner rule: "First is always achieving with code" (GSAP, three.js, React, TypeScript, HyperFrames).
- Owner's stills exist and match as a series; example `evidence/user-still-cutface.png`.

**Constraints.** 2 hours/day. No image-generation API in the workspace (owner generates stills/videos on his phone). Workspace renders WebGL on software GL (slow film renders; the live site runs on users' GPUs). Stack: Next.js, TypeScript, GSAP/ScrollTrigger, R3F for live WebGL. Phones must work (jury weights usability 30%).

**Reversibility.** Medium. The route decides every hero asset and the animatic; switching later costs days.

**Deadline.** None hard; each extra round costs the owner 2-hour days.
