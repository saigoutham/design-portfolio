made-with: skills r3f-shaders, r3f-textures, r3f-materials, r3f-postprocessing; read docs/concept.md, docs/council/2026-11-10-art-route-r2.md, docs/critics/art-proof-{1,2,3}.md, docs/critics/art-proof-r2-{1,2,3}.md, assets-src/photos/cut-face.png, tools/render.py

# Proof C: flesh submerge (5 render rounds)

Frames: c-0.3, c-1.5, c-2.5, c-3.5, c-5 (.png). Page: c-proof.html. Prep: c-prep.py -> c-tex/ (flesh.png 2048x1152, height.png, seed-mask.png, seeds.json with 33 seed sites).

How it is built
- Crop: largest 16:9 rectangle inside the red-flesh ellipse of cut-face.png (box 710,532 to 1814,1152), so no rind, background or Gemini sparkle; 1.00 to 1.06 push-in.
- Relight: normal from a high-passed luminance height map, soft key from the top left, Blinn specular plus a diagonal softbox streak that catches the juice beads.
- Soda: level -0.03 to 0.70 (t 0.5 to 4, smoothstep); the surface curves up at the walls (meniscus bow), with a slosh wave whose amplitude follows the lagged line speed (peak near t 2.5) and settles after t 4, plus 2 capillary ripples. Bright surface band, dark hairline, lit silver underside, mirrored flesh under the surface (internal reflection), a thin film above. Below: UV refraction by a noise normal, 5-tap softening, pink tint, slightly brighter, caustic shimmer.
- Bubbles: JS computes all states as a pure function of t (seeded mulberry32): each seed spawns 6 to 9 bubbles after the line covers it; they grow on the seed rim, then detach, accelerate and grow by 35%/s with a small wobble. Pop is a flattened ring at the surface for 0.28 s. In the shader each is a sphere: inverted, magnified flesh, a dark band from internal reflection, a bright rim, a key-light dot and a counter-glint; 30% are slightly defocused.
- Type: Bricolage Grotesque 700 in a canvas (glyphs plus a soft shadow channel), refracted, softened and tinted pink below the line.
- Font: not installed in node_modules (no @fontsource package), so the woff2 from @fontsource/bricolage-grotesque 5.3.0 is vendored in c-tex/. Add the package before the animatic.
- Colour: textures are NoColorSpace and the shader writes display-space values directly, with no output chunk. This was deliberate, to avoid double conversion.

Three weakest things still visible
1. The surface line is a 2 to 3 px bright hairline. In stills it still reads close to a graphic edge. The meniscus band is thin, and the slosh at peak speed (c-2.5) is a gentle 20 to 30 px wave, not a felt slosh. Thicker, light-catching curvature is needed before an owner review.
2. The carbonation is sparse while the line moves (c-2.5 shows about ten small bubbles) and only gets dense by t 5. At t 5 the bubbles scatter evenly over the frame, with no streams or clusters, and some sit on the headline and hurt its legibility.
3. Below the line, the pink wash flattens contrast. The submerged headline is low-contrast pink on pink, and the mirrored strip under the surface ghosts the type. The crop is a 1.75x upscale, so the flesh is soft at 1080p, and the relit "wet" streak is subtle rather than a clear glossy highlight.
