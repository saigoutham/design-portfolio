made-with: r3f-materials, r3f-shaders, r3f-lighting, r3f-textures, r3f-postprocessing (skills loaded; plain three.js r187 ShaderMaterial + InstancedBufferGeometry; no post-processing pass used)

# Art proof B: the melon opens like a book

**What it is:** one coded 3D watermelon (ellipsoid radii 1.6 / 1.03 / 1.24, so the cut is a 1.2:1 oval like cut-face.png), split at x=0 into two half-shells plus caps. Over t = 0 to 3 s the whole melon turns from a 3/4 view, lifts slightly, and the halves swing open on a hinge at their back edges (57 deg each) to show the flesh, ending a little off-square so the two faces sit at different angles. Background: blush #fff0f2 radial, page CSS, transparent canvas.

**How the stills are used (Route B):**
- Rind: whole.png matted, then *projected in the fragment shader* from object position. u = x/A; v = sin(0.8 * theta) * sqrt(1 - x^2/A^2), theta = angle around the long axis. The back hemisphere mirrors the front, so there's no seam. The 0.8 factor keeps sampling off the photo's dark silhouette edge. Checked at 3/4, mid-turn and side-on views (frames 0, 1.5, 3).
- Cut face: cut-face.png planar-mapped onto the cap ellipse. The x<0 half reads it mirrored, as two halves of one fruit are.
- Bevel: the shell is radially pulled in by 3.5% over the last 4.5% of its length. That gives a rounded, lit lip, tinted pale inner rind once open. While closed it shows as a dark hairline seam.
- Flesh: a bump from the photo's own luminance (tangent frame from screen derivatives) drives a tight wet specular.

**Pitfalls handled:**
- Both halves' geometry is built directly on its own side. Winding is checked against the outward normal, and there is no negative scale.
- No emissive. NoToneMapping plus sRGB output only.
- Lighting multiplies the photo by 0.8 to 1.1 plus a small spec and rim, so the rind never clips to white. I checked exposure in all three frames.

**Texture prep** (`b-prep.py`, output in `b-tex/`):
- Saturation matte, largest blob, and the watermark corner zeroed.
- The floor shadow fused to the underside, so the mask is clipped to an ellipse mirrored from the clean top half.
- The mask is eroded 3 to 5 px, then nearest-inside colours are extended outward, so there's no white fringe.
- The texture is cropped to the fruit's bbox. `meta.json` records the bbox.

## Three weakest things still visible (honest)
1. **Contact shadow is too weak.** The pool sits mostly under the bodies, so it's hidden from this camera. At t=0 and t=3 the fruit reads as slightly floating. Fix (not rendered, out of rounds): make the soft pool about 1.5x the footprint and darker at the inner hinge edges.
2. **The two cut faces are one photo mirrored.** At t=3 the matching seed arcs give it away. The cure is a second cut-face still, from the other side of the same cut, for the right half.
3. **The rind is a front photo wrapped round.** Its baked highlight and lower shade turn with the halves. The stripes fan slightly near the ends and the top fold. There's no real rind thickness at the cut beyond the photo's own ring and a thin bevel. Two more stills would fix this: an unlit orthographic rind strip, or a top view.

Also: the closed melon at t=0 reads a little egg-like and generic. The concept's punch lives in the opening, not the first frame.

## Round 2: the split releases the soda (frames b2-0/1.5/2.5/3.5/5.png)

**Timeline (about 5 s, pure function of t, fizz continues past 5):** 0 to 0.45 s the whole melon turns. 0.45 to 0.95 s a wet red knife line runs down the rind from the top, with a 1% squash. 0.95 to 2.8 s the halves swing open, 48 deg each (was 57). The faces start to effervesce, and juice beads swell at the cut edge. At about 3 s the halves settle into a symmetric hero pose, square to camera. After that the camera keeps easing in slowly and the fizz keeps rising.

**What changed:**
- **Fizz.** Fizz is 6020 seeded particles (mulberry32, seed 20261110), each in closed form of t. There are three kinds:
  - 2000 bubbles nucleate on the flesh. They grow in place, detach, drift off the face and rise with acceleration.
  - 420 juice beads sit at the rim. They start deep red, lift off and thin into clear bubbles within 0.55 s.
  - 3600 bubbles form the column, which streams up between the halves.
  Bigger bubbles accelerate harder and grow as they rise. Each bubble is a camera-facing quad shaded as a refractive sphere: a dark rim (total internal reflection), a bright lens core, a white highlight, a caustic and a pink tint. The spawn rate ramps up from the moment of the split.
- **No seam at t=0.** The bevel is undone in the vertex shader while closed, and the normals blend back to the ellipsoid. The dark hairline is gone.
- **Ground.** A floor-tone plane in the background colour, with a contact core plus a soft pool offset away from the key light. Both track each half's footprint from its world matrix.
- **Second face** is the same photo turned 90 deg in normalised ellipse space, not mirrored, so the seed arcs differ (vertical on the left, horizontal on the right). I checked p-cutface.png (a lengthwise cut, 2:1) and halves-parted.png (faces foreshortened about 3x). Neither fits the 1.2:1 cross-section without heavy distortion, so neither is used.
- **Wet sheen** on the cut faces is a strip-light reflection per face, broken up by the flesh grain. The rind gets a waxy broad sheen plus a narrow clearcoat glint, clamped below white.

**Three weakest things still visible (honest):**
1. **The 90 deg-turned face is a cheat.** Its seed rows run vertically, which no real cross-section has, and its rind ring thickness is slightly uneven. A second true cross-section photo is still needed.
2. **The halves still sit lightly.** The contact shadow is mostly hidden under the bodies from this high camera, so b2-2.5 and b2-5 read grounded but soft. The wet strip-light on the faces is subtle at full frame; the flesh reads photo-lit rather than glossy.
3. **The fizz top is a soft cloud, not a column.** Above the halves (b2-5) the bubbles fan wide and fade at y=2, and the mass leans slightly left. On the faces, nucleated bubbles haze the flesh a little pink by 3.5 to 5 s. Juice beads read as pink balls rather than liquid. The rind glint leaves about 1000 near-white px at t=0. That is small, but it is the closest this art comes to a blown highlight.
