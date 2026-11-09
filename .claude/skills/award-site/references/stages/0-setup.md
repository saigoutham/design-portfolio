# Stage 0: Setup

**Goal:** a site folder with its context skeleton, registered in the shared fingerprint log.

## Steps
1. From the repo root:
   ```bash
   npm run new-site -- <site> --client      # or --own
   # --3d if the user already knows the site needs 3D
   # --repo <git url or path> if the site should live in its own repo
   ```
   The script creates `sites/<site>/` with Next.js (App Router, TypeScript, Tailwind, src/), installs gsap, @gsap/react and lenis, and writes `CLAUDE.md` and `docs/decisions.md`. It also adds a `planned` row to `system/FINGERPRINTS.md`. With `--repo`, it clones that repo next to this one, scaffolds there and writes `sites/<site>.md` pointing to it. The shared logs always stay in design-portfolio.
2. Run `npm run setup` once per machine or session. It checks prerequisites (node, python3, ffmpeg, git) and shows which packs are on. Don't install packs yet; each stage asks for its own.
3. If the slug is taken, or the user gave no name, ask for one. Slugs are lowercase words joined by hyphens.
4. If the site's CLAUDE.md later grows past about 1k tokens, shrink it with **caveman-compress** (`--with compress`). It sends the file's text to a model, so use it only with the user's yes.

## Verify
`npm run status -- <site>` lists the site and its track.

## Log
The script writes `stage 0 setup · done`.

## Handoff
- Next: stage 1, Intake.
- Usual recommendation: start the interview while the context is fresh. On the client track, book the client for about 20 minutes. On the own track, three answers are enough.
- Needs from you: the client's name and how to reach them (client track), or nothing.
