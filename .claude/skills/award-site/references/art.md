# The art ladder

Where a site's hero art comes from. `npm run probe` writes which rungs are open to `system/capabilities.json`. A concept may only depend on open rungs, and it isn't approved until one real asset from its rung passes the art proof below.

| Rung | What it's good for | What it can't do | How |
|---|---|---|---|
| **code** (always open) | Art where code is the medium: kinetic type, GLSL shaders (liquid, light, grain, refraction), particle systems, generative pattern, data. Rendered to film with HyperFrames or run live. | A convincing picture of a real object. A fruit, face or product drawn in SVG, CSS or canvas reads as a prototype (the Diwali lesson) and fails the floor. | r3f/GLSL or canvas for live; pack `video` for film |
| **generated** (open when an image API key exists) | Photoreal stills, textures, backgrounds, cut-outs, short clips. Claude writes the prompt, generates, looks, and regenerates. | Consistent multi-angle sequences of one object; anything passed off as a real photo of a real product. | `npm run setup -- --with imagegen`, then prompt-images and run-models. Generate 4, keep 1. Label generated art in `docs/art.md`. |
| **sourced** (open when free-licence sites are reachable) | Real photographs and footage: Unsplash, Pexels, Mixkit, Wikimedia Commons, Poly Haven (textures, HDRIs, models). | Matching sets, unless every file is from one shoot or one author's series. | Search with WebSearch; download with curl, or pack `scrape` when a page needs a browser. Only free-licence sources; record URL, author and licence. If the workspace can't reach them, list the exact files and ask the user to download them in the same turn. |
| **rendered** (open when Blender is installed) | Hard-surface objects with a GPU or as a few stills on CPU: cans, bottles, glass, packaging, type in 3D. | Organic hero subjects (fruit, skin, food, fabric) and long sequences on CPU. Three passes on a watermelon stayed plastic. | bpy script in `assets-src/`, textures from the sourced rung where possible |
| **supplied** (always open) | Anything the user or client can shoot or already owns. Often the best art. | Speed: it waits on a person. | A shot list a phone can follow; ask once, early |

## Choosing

1. List the open rungs. Design the concept so its hero comes from one of them; when only **code** is open, pick a concept where code is the medium (type, liquid, light, particles) and not one that needs a photographed object.
2. Rungs combine: sourced photo cut-outs animated by code, a rendered can inside a shader liquid, generated texture on a rendered model.
3. Prefer the rung that makes the signature move better, not the one that's easiest.

## The art proof (phase 2)

One finished hero asset at final quality: a still, or a 3-5 second clip if motion is the art. Two routes are tried at once by two agents, each capped at 2 attempts and 40k tokens. Then:

- You look at both results yourself.
- A fresh critic agent (haiku) sees only the image and one professional reference, and answers: "Would a design juror take this for professional work? 1-10, and the three things that give it away." Pass is 7.
- Keep the better passing route. If neither passes, change the concept or ask for supplied art. Don't run a third attempt on the same route.

`docs/art.md` in the site records: the rung, the proof file, the critic's score, and for every asset its origin, author and licence.
