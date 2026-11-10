made-with: r3f-shaders, r3f-textures, r3f-materials, r3f-postprocessing (skills); docs/concept.md, docs/brief.md, docs/archive/round-1/critics/*.md, assets-src/photos/cut-face.png, tools/render.py

# Fog proof: "The screen sweats" hero, 6 s

Pipeline (all a pure function of t; every render target is rebuilt each `renderAt`):
mask pass (full res: scripted cursor trail, edge-inward creep from 3.8 s, drop streaks, the finger-written "Wipe me") → scene pass (graded photo, normal-map wet glints, headline) → two-level separable blur → composite (blur, desaturate and lift toward cold white, micro-droplet lens grain, 3 bead layers plus a gather layer on the trail ridge, teardrop drops, contact shadows, corner frost, cursor dot).
"Wipe me" is written in the fog by a finger, not shown as a UI label, so it reads as red-through-fog with real contrast.

Weakest three, still visible:
1. **Beads are too even.** They spread like pepper across the whole frame, each one in roughly the same red with the same glint. There are no merged or irregular blobs and no dry patches, so a critic could still say "stickers" (fog-0.5, fog-6). One bead also covers the "e" of "Wipe me".
2. **The frost reads as snow.** The corners look like soft white foam patches, without crystal feathering, and they barely grow in 6 s (all frames, bottom corners).
3. **The streaks are plain red lines.** Each one has the same width, with no bright water edge and no beads left behind. At fog-6, five parallel streaks can read as dripping juice. The flesh in the trail is a 1.75x upscale of the photo crop, so it is slightly soft and meaty at full size (fog-3).
