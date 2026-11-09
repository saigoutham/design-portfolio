# Diwali Festival Of Lights: decisions

Track: client
Repo: design-portfolio/sites/diwali-festival-of-lights

## Stage log
- 2026-11-09 · stage 0 setup · done
- 2026-11-09 · stage 1 intake · done
- 2026-11-09 · gate 1 · approved · Ira, relayed by Goutham in chat
- 2026-11-09 · stage 2 research · done
- 2026-11-09 · stage 3 concept · done
- 2026-11-09 · stage 4 direction · started
- 2026-11-09 · skill find-skills · stage 1 · no gaps (backfilled from the decisions below)
- 2026-11-09 · skill ui-ux-pro-max · stage 4 · design-system/diwali-festival-of-lights/MASTER.md (backfilled)

## Decisions
- 2026-11-09 · Created with no 3D dependencies yet.
- 2026-11-09 · Requested as "Diwali-Festival-Of-Lights -motion-website"; slug lowercased (script rejects capitals). "Motion website" logged as intent, not a flag; 3D deps wait for stage 4.
- 2026-11-09 · Timing risk: Diwali 2026 was 8 Nov (the day before setup). Target date to be settled at intake.
- 2026-11-09 · Client: Ira. Scope: all Diwali stories. End date: 1 week (Mon 16 Nov 2026, to confirm). Pipeline compressed to fit; assets are the critical path.
- 2026-11-09 · Ira supplies nothing; build from scratch. Each story drawn in its state's art tradition (Claude picks). Proposed map in docs/brief.md. Art as code-drawn layered vectors; 3 scenes per story. Sikh Gurus never depicted (SGPC/Akal Takht).
- 2026-11-09 · Deadline moved to two weeks: launch Mon 23 Nov 2026. Quality is the top priority. English only. Extra week goes to a full proof story at Gate 2 and two jury rounds, not more scope.
- 2026-11-09 · Intake closed after 5 questions (user asked for output over process). Ending: quiet. Remaining ops answers are Claude's proposals in docs/brief.md. find-skills: nothing to install. Gate 1 doc for Ira: https://claude.ai/artifact/9KEVoFi9sg8CfQWTKAL46z
- 2026-11-09 · Brief approved as written: six lamps (no Kali Puja), Claude's proposals accepted.
- 2026-11-09 · Research: lamp 4 art changed from Warli to Dashavatara Ganjifa (Sawantwadi, Maharashtra); Warli is an Adivasi tradition with no Bali iconography. Copy rules: traditions stated as traditions (no 'the Ramayana says' for lamps), both Narakasura versions, Bali with no villain, Guru shown only as light. last30days not run (needs keys; sources outside network). Findings in docs/research.md.
- 2026-11-09 · Concept: the row of lamps. Grammar gallery/catalog (runner-up chaptered editorial; continuous world rejected: seams, robot-mammoth overlap, map-of-India boundary risk). Signature: one flame carried lamp to lamp, hold to light. Lamp order follows the festival days (Lakshmi, Narakasura, Rama, Mahavira, Bandi Chhor, Bali); peak Bandi Chhor, silence Mahavira. Fingerprint: differs from robot-mammoth on 5 of 6 (nav shared). No 3D pack: flame as a small shader, SVG fallback.
- 2026-11-09 · Direction: ui-ux-pro-max generated MASTER.md (Museum/Gallery) but its defaults (Swiss light ground, Poiret One art deco) were rejected; MASTER.md revised in place: night palette, one flame accent, Eczar + Anek Latin (Indian foundries, self-hosted). DESIGN.md written.
- 2026-11-09 · Hero proof built: dark row of six diyas, hold to light (600 ms), WebGL flame with SVG fallback, light reveals Pattachitra panel 1, row becomes nav, painting's lamp lights and its flame is carried to lamp 2. Screenshots in docs/hero-proof/. Checked at 1440x900, 390x844, 360x640 and reduced motion.
- 2026-11-09 · Preview: no Vercel access here, so a static export is published as a private artifact: https://claude.ai/artifact/XbwrXWi3aERLA2YMDBHZEd (build with EXPORT=1; underscore folders renamed for the host).
- 2026-11-09 · Tooling: next.config's Tailwind turbopack rule turns *.module.css into plain CSS (empty class map), so component styles are global and prefixed x- (src/components/experience.css).
