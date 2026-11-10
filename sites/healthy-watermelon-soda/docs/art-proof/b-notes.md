made-with: r3f-materials, r3f-shaders, r3f-lighting, r3f-textures (plain three.js r187 ShaderMaterial; no post-processing)

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
