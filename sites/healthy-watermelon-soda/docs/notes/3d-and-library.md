made-with: r3f-materials, r3f-shaders, r3f-lighting, r3f-postprocessing, library/motionsites/references/review.md, library/scroll-craft/references/hero-depth.md

# What applies to the watermelon animatic v2

- Materials: glass and liquid use physical transmission with real thickness and IOR, not opacity; transmission only works when there is an opaque background in the same scene, so the split grounds move into WebGL. Colour maps sRGB, data maps NoColorSpace.
- Shaders: the stills are projected onto the rind in the vertex stage (onBeforeCompile, uv_vertex chunk), so one front photo wraps the shell; keep comments free of backticks in GLSL strings.
- Lighting: environment for fill and reflections, two direct lights for direction; the stills carry baked light, so direct light stays low and the map also drives emissive to keep the photo's values.
- Postprocessing: bloom only on the brightest specular points (threshold about 0.9), output pass owns tone mapping and colour; one owner renders the frame.
- MotionSites review: "media integration" and "it looks flat" fixes: depth from layers and light, not decoration.
- scroll-craft hero depth: layers must move at different rates and overlap. Seeds and juice render on a second canvas above the type so they cross the headlines; headlines drift at a slower rate than the fruit.
