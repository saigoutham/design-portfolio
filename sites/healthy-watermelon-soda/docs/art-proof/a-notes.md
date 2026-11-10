made-with: r3f-materials, r3f-shaders, r3f-lighting, library/scroll-craft/references/hero-depth.md, library/motionsites/references/review.md

# Art proof A: pure code (no image files)

Page: `a-proof.html` (vanilla three r0.187, WebGL). Frames: `a-0.png` (whole melon, fresh slit), `a-1.5.png` (opening), `a-3.png` (two halves open like a book). Four render rounds, no console errors.

## What it is
- A watermelon cut across, its two halves swinging open on a hinge at the back. Motion is `renderAt(t)` only: the opening angle, the gap and a slow camera arc are all smoothstep/sin of t.
- Rind: MeshPhysicalMaterial patched with onBeforeCompile. The colour comes from object-space simplex fbm. Stripes are `sin(phi*8 + domain warp)` with noisy, jagged edges, so their widths are irregular. Two scales of ridged-noise veining run across the pale ground, with lenticel speckles and a pale field spot. Bumps come from procedural height through screen-space perturbNormal. A waxy clearcoat sits on top.
- Cut face: a subdivided plane with a slight uneven displacement, discarded outside r=1. It has radial fibres from warped polar noise that fade at the heart, soft sugary blotches, faint locule lines and a lighter crystalline heart. The bands run red to pink to a pale green-white rind band to green to dark skin. Roughness varies for wet glints, and there is a clearcoat. The pale band and the flesh get a small emissive term as a stand-in for subsurface light.
- Seeds: teardrop instanced meshes in an irregular 3-lobed ring, tilted at random. They use a glossy clearcoat, and about 15% are pale immature seeds.
- Lighting: RoomEnvironment PMREM, a warm key light with soft PCF shadow, a cool rim light and a hemisphere fill. NeutralToneMapping keeps the red from turning orange. The background is a blush #fff0f2 radial gradient, with a shadow-catcher ground and soft contact blobs.

## Three weakest things still visible
1. The cut face is lit too evenly and reads slightly matte. Wet flesh needs a specular streak of its own. No light sits at the mirror angle, so most of the "wet" look is lost (see a-3).
2. The flesh grain is fine-scale noise and lacks the coarse, sparkling cell structure of a real cut. Up close it reads as "textured red", and at the 0.3-0.5 radius it still shows a faint radial-zoom pattern.
3. The rind silhouette is a perfect half-ellipsoid with a razor-flat cut and a zero-thickness edge. There is no bevel, no rind lip and no juice. The mid-cut frame (a-0) shows clean slices with no sign of a knife or juice. Also, there is no soda or glass yet: this proof covers the fruit only.
