# Stage 5: Assets

**Goal:** every image, video and model the spec will need, each with a known source and licence, plus the final copy.

No paid generation: kie.ai is ruled out.

## Media, in order of preference
1. **The client's own** photos, footage, artwork and brand kit; their hard rules win. For anything missing, write a shot list from the hero layer plan for the client's photographer: each plane, its framing, clean plates, cut-outs.
2. **The user's own** assets, including anything they make in a tool they already use. Treat them like client assets.
3. **Licensed, commissioned or public domain:**
   - Museum open-access originals. Check each object's licence, not just the museum's policy.
   - Artists licensed directly or through a marketplace.
   - Commissioned illustration or photography within the budget.

   Each needs a credit line. If the workspace can't reach a host, ask the user to download the files.
4. **Made in the build:**
   - R3F scenes with the r3f-* skills (`--with 3d`). Models are licensed, modelled in Blender through bpy and exported as GLB (`--with blender`), or built from simple shapes.
   - Typographic and procedural visuals.
   - Motion clips with **hyperframes**, or **remotion-best-practices** when hyperframes can't do it (`--with video`).
   - Product UI with **stageshow** (`--with ui`) when the site shows an interface.

   Never hand-drawn illustration (SKILL.md, quality floor rule 2).
5. **MotionSites' media shelf** (`library/motionsites/media/MEDIA.md`): own track only, downloaded and self-hosted. Its licence covers sites built with that skill.
6. **None of the above:** a type- and motion-led page (scroll-craft's typographic poster grammar). Never placeholder boxes or stock filler.

## Rules
- `library/scroll-craft/references/assets.md` still governs layering: clean plates, real cut-outs with transparency, and a shared contact point so planes sit together.
- Look at every asset before using it, and ask for a reshoot rather than ship a weak frame.
- Encode scroll-scrubbed video with `library/scroll-craft/scripts/encode.sh` (desktop and `mobile` variants). A normal web encode plays fine but scrubs badly. It needs a full ffmpeg build.
- Record every file's source, licence and credit line in `docs/assets.md`.

## Copy
Write the final copy now. Follow elaya's copywriting and conversion rules (`library/elaya/landing-page-design/SKILL.md`, Part A) and MotionSites' copy bar: specific, short, a headline with a point of view, a verb in every call to action. Real facts only: no invented statistics, testimonials or numbers.

## Verify
Every asset the spec will name is in `assets/` with a row in docs/assets.md; nothing is marked "TBD" without a fallback.

## Log
`stage 5 assets · done`, plus a skill line for each skill that ran.

## Handoff
- Next: stage 6, Spec and plan.
- Usual recommendations: list any asset still missing and what the page does without it. If a shoot or a licence is delayed, recommend writing the spec now and swapping media in at build time.
- Needs from you: the files on the shot list, licence decisions, or approval of stand-ins.
