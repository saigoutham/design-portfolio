# Stage 5: Assets

Goal: every image, video and model the spec will need, each with a known source and licence, plus the final copy.

No paid generation: kie.ai is ruled out. Media, in order of preference:
1. **The client's own** photos, footage and brand kit; their hard rules win. For anything missing, write a shot list from the hero layer plan (each plane, its framing, clean plates, cut-outs) for the client's photographer.
2. **The user's own** assets, including anything they make themselves in a tool they already use. Treat them like client assets.
3. **Licensed, commissioned or public domain:** museum open-access originals (check each object's licence, not just the museum's policy); artists licensed directly or through a marketplace; commissioned illustration or photography within the budget. Each one needs a credit line. If the workspace can't reach a host, ask the user to download the files.
4. **Made in the build:** R3F scenes (models licensed, modelled in Blender through bpy and exported as GLB (`--with blender` prints the install), or built from simple shapes), typographic and procedural visuals, motion clips rendered with hyperframes or remotion (`--with video`), and product UI built with **stageshow** (`--with ui`) when the site shows a product's interface. Never hand-drawn illustration (SKILL.md, quality floor rule 2).
5. **MotionSites' media shelf** (`library/motionsites/media/MEDIA.md`): own track only, downloaded and self-hosted. Its licence covers sites built with that skill.
6. **None of the above:** a type- and motion-led page (scroll-craft's typographic poster grammar), never placeholder boxes or stock filler.

Rules:
- `library/scroll-craft/references/assets.md` still applies for layering: clean plates, real cut-outs with transparency, a shared contact point so planes sit together.
- Look at every asset before using it; ask for a reshoot rather than ship a weak frame.
- Encode scroll-scrubbed video with `library/scroll-craft/scripts/encode.sh` (desktop and `mobile` variants). A normal web encode plays fine but scrubs badly. Needs a full ffmpeg build.
- Record every file's source and licence in `docs/assets.md`.

**Copy.** Write the final copy now, with elaya's copywriting and conversion rules (`library/elaya/landing-page-design/SKILL.md`, Part A) and MotionSites' copy bar: specific, short, a headline with a point of view, a verb in the call to action. Real facts only: no invented statistics, testimonials or numbers.

Log `stage 5 assets · done`.

## Handoff
- Next: stage 6, Spec and plan.
- Usual recommendations: list any asset still missing and what the page does without it; if the shoot is delayed, recommend writing the spec now and swapping media in at build time, rather than waiting.
- Needs from you: the files on the shot list, or approval of the stand-ins.
