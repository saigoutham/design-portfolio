made-with: skills r3f-shaders, r3f-textures, r3f-postprocessing (round 2; round 1 also r3f-materials); read docs/concept.md, docs/council/2026-11-10-art-route-r2.md, docs/critics/art-proof-{1,2,3}.md, docs/critics/art-proof-r2-{1,2,3}.md, docs/critics/art-proof-c-{1,2,3}.md, assets-src/photos/cut-face.png, tools/render.py

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

## Round 2 (liquid rebuild, 4 render rounds)

Frames: c2-0.3, c2-1.5, c2-2.5, c2-3.5, c2-5 (.png). Dry fruit, crop, relight, type layout and level timing are unchanged. Only the liquid and what lives in it was rebuilt.

- Clear volume: no pink wash. Single-tap sharp flesh seen through a 1.06 magnification pivoted on the surface line, offset by the surface slope plus a weak volume noise. R and B are resampled with a slope-scaled offset, giving chromatic dispersion at steep slopes and on the type edges. Depth absorption (exp, keeps red, eats G/B) makes deeper fruit darker and more saturated. A cool, bright Fresnel skin sits just under the line, and a meniscus lens pulls the image toward the line in the top ~30 px.
- Caustics: two tileable iterated-warp caustic layers, animated by t, multiplied onto the fruit and fading with depth.
- Surface (~35 px thick): froth caps on top (two cell sizes, height and density from a foam field), a 7 px specular band (wider at the edges), a silvered underside band (flipped, desaturated total internal reflection of the deeper liquid), then a dark band. The meniscus climbs about 35 px at both frame edges (edgeRamp). The capillary ripples are stronger and add a 113-frequency term.
- Bubbles: each seed has 2 to 3 nucleation sites. Each site emits a chain at a 0.12 to 0.32 s period. A bubble clings and grows on the seed, then detaches, accelerates, grows (r x ~2 by the surface) and wobbles more as it rises. The pop time is a memoised forward search, so the result is a pure function of t. Pops make a flattened ring and feed a 512-sample foam density field (decay 1.6 s), so froth piles up over active seeds. In the shader each bubble is a sphere: an inverted, magnified liquid sample that includes the white type, a dark TIR edge (softened on tiny bubbles), a bright rim, a key dot and a counter-glint. Bubbles are binned on a 48x27 grid (data textures) so up to 2048 can draw. A frame renders in about 1.5 s on SwiftShader.
- Headline under the liquid is white, refracted with the liquid and dispersed, and stays white across the silver band. Bubbles over it show it inverted.

Three weakest things still visible (round 2)
1. Where a line of type straddles the surface (c2-3.5, c2-5, "Real fruit."), the dry top and the magnified, lens-pulled bottom misalign by 15 to 25 px. It reads as a doubled, glitchy cut rather than a clean optical break. The lens pull is too strong on the type.
2. The liquid now looks clear, but it has little body of its own. Away from the surface band, submerged fruit is only slightly more saturated than dry fruit. Caustics are faint orange filaments, not crisp light nets, so the volume is carried by the bubbles and the surface band.
3. Bubbles read as spheres but look uniform: pink-red glass beads in near-vertical columns of similar size, with no depth-of-field variety (the 18% "blur" chains barely differ). Froth stays thin at t=3.5 because most chains have not reached the surface yet, so "denser where bubbles arrive" only shows by t=5.
