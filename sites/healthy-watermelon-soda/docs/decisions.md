# Healthy Watermelon Soda: decisions

Track: own
Repo: design-portfolio/sites/healthy-watermelon-soda

## Stage log
- 2026-11-09 · stage 0 setup · done
- 2026-11-09 · stage 1 intake · done
- 2026-11-10 · stage 2 research · done
- 2026-11-10 · stage 3 concept · done
- 2026-11-09 · skill new-site · stage 0 · sites/healthy-watermelon-soda (Next.js, gsap, @gsap/react, lenis; FINGERPRINTS planned row)
- 2026-11-09 · skill setup · stage 0 · prerequisites ok (node 22, python3, ffmpeg, git, bun); no packs on
- 2026-11-09 · metrics · stage 0 · 3 min, ~40k tokens, 2 skills, 0 agents, 0 retries, 2 files, 0 review cycles, floor n/a
- 2026-11-09 · skill brainstorming · stage 1 · interview started, Q1 (what the product is) asked

## Decisions
- 2026-11-09 · Created with no 3D dependencies yet.
- 2026-11-09 · Q1 answer (verbatim): "It's a brand that i plan to make, there are no healthy sodas available but I want to venture into this segment without any sugar, real fruit and make it fun with the soda"
- 2026-11-09 · Repo award-site updated to v3 SKILL.md; references/floor.md reconstructed from it; Diwali lesson added to system/lessons.md; .council.yaml added. skills.mjs still missing.
- 2026-11-09 · Q2 answer (verbatim): "It's just for portfolio so that should be okay" → own-track concept brand; site carries a concept label (rule 9)
- 2026-11-09 · Q3 answer (verbatim): "How beautiful, unique and crazy immersive experience that the website has given. Its a totally new and fun take to present the product." → too vague to seed a signature move; pushed for a concrete moment
- 2026-11-09 · Q3 resolved: user picked A — scroll slices a real 3D watermelon; flesh fizzes, seeds rise as bubbles ("I cut a watermelon by scrolling and it turned into soda"). Implies 3D world: r3f + Blender at stage 4/5.
- 2026-11-09 · Q4 answer: "Awwwards" → target Awwwards SOTD; phone usability is a hard constraint on the 3D slice
- 2026-11-09 · Q5 answer (verbatim): "2 hrs per day and the delivery in a week" → live by 2026-11-16; scope cut to one continuous scene
- 2026-11-09 · skill brainstorming · stage 1 · docs/brief.md, PRODUCT.md (5 questions, grilling style; Q3 pushed back and resolved to option A)
- 2026-11-09 · skill product-marketing · stage 1 · skipped: not installed in this repo; positioning, audience and primary action written into PRODUCT.md by hand
- 2026-11-09 · skill find-skills · stage 1 · skipped: no capability gap (no shop, CMS or booking)
- 2026-11-09 · Needs --3d: the r3f pack gets installed at stage 4
- 2026-11-09 · metrics · stage 1 · 25 min, ~90k tokens, 2 skills, 0 agents, 0 retries, 3 files, 0 review cycles, floor n/a
- 2026-11-10 · skill setup · stage 2 · research and library packs on (last30days, MotionSites)
- 2026-11-10 · skill content-strategy · stage 2 · skipped: not installed in this repo; the audience lane was done by web search
- 2026-11-10 · skill last30days · stage 2 · skipped: no API keys in this workspace; web search instead
- 2026-11-10 · skill scrapling-official · stage 2 · skipped: own track; sameness map built from Awwwards and press
- 2026-11-10 · skill rea · stage 2 · skipped: optional, time budget
- 2026-11-10 · library motionsites + scroll-craft approved-collection · stage 2 · read; values in docs/research.md §3
- 2026-11-10 · research · stage 2 · docs/research.md; opportunity 1 (fruit as hero, visitor as cause) picked for the concept
- 2026-11-10 · metrics · stage 2 · 15 min, ~70k tokens, 1 skill, 0 agents, 0 retries, 1 file, 0 review cycles, floor n/a
- 2026-11-10 · Goutham chose concept first; the slice speed test moves to stage 4
- 2026-11-10 · library scroll-craft feel.md + uniqueness.md · stage 3 · read; grammar picked from its 8
- 2026-11-10 · skill brainstorming · stage 3 · 3 concepts (The Cut / One Slice / Chop) in docs/concept.md; The Cut proposed
- 2026-11-10 · skill copywriting · stage 3 · skipped: not installed in this repo; messaging angle ("Real fruit. Real fizz.") written in the concept, final copy at stage 5
- 2026-11-10 · skill council · stage 3 · skipped: concepts not close (runner-up fails the template-trap test)
- 2026-11-10 · fingerprint gate · stage 3 · passes 6/6 against robot-mammoth
- 2026-11-10 · Goutham approved concept: The Cut (split stage; the divider is the knife)
- 2026-11-10 · metrics · stage 3 · 20 min, ~60k tokens, 1 skill, 0 agents, 0 retries, 1 file, 1 review cycle, floor n/a
- 2026-11-10 · skill setup · stage 4 · 3d, video, taste packs on; bpy 5.2.3 installed (CPU only, 2 cores)
- 2026-11-10 · skill ui-ux-pro-max · stage 4 · design-system/healthy-watermelon-soda/MASTER.md (style Vibrant & Block-based); first two runs returned a luxury black-and-gold system and were discarded; palette and type re-tuned to the fruit, contrast checked (all text pairs ≥5.3:1)
- 2026-11-10 · skill design-system · stage 4 · design-system/tokens.json → tokens.css (primitive, semantic, component)
- 2026-11-10 · skill design-taste-frontend · stage 4 · checked from its SKILL.md checklist (installed mid-session, not loadable as a skill yet); pass, one waiver: the scroll-scrubbed scene
- 2026-11-10 · library scroll-craft taste.md + elaya Part B · stage 4 · checked; pass
- 2026-11-10 · DESIGN.md · stage 4 · direction, token roles, hero layer plan, signature look
- 2026-11-10 · Decision: fruit delivered as scroll-scrubbed rendered video, not live WebGL (speed on phones); r3f is optional desktop garnish only
- 2026-11-10 · subagent watermelon model · stage 4 · started: assets-src/watermelon.py, stills to docs/watermelon/
- 2026-11-10 · subagent watermelon model · stage 4 · assets-src/watermelon.py; docs/watermelon/{whole,cut}-v1..v3.png; ~3–5 min per still on CPU; subagent verdict borderline
- 2026-11-10 · floor (asset still) · stage 4 · fail · director verdict on v3: reads as CG. Whole: stripes like torn paper, milky soft sheen, smudged ground spot. Cut: flat matte card-like flesh, no wet glints, seeds in a neat printed ring, halves read as thin plates. Two fix passes done; the day-2 rule says switch, not polish
- 2026-11-10 · Proposed: real photography and footage of a real watermelon as the hero art (concept fallback); Blender kept for the can/glass if needed. Waiting on Goutham
- 2026-11-10 · Goutham: use online photos and animate with hyperframes instead of a shoot. Accepted: licensed stock photos/footage count as real art (floor rule 2); hyperframes/GSAP animate the real cut-outs, never draw fruit or bubbles. Workspace can't reach Unsplash/Pexels/Wikimedia (curl 000), so Goutham downloads; one shoot series needed so whole and halves match
- 2026-11-10 · assets · stage 5 · 4 generated stills (Nano Banana) filed in assets-src/photos, provenance in docs/assets.md; director verdict: whole, halves, cut face pass; macro borderline
- 2026-11-10 · Goutham: generates the art himself in Nano Banana from prompts the studio writes; one series, one chat
- 2026-11-10 · hero proof · stage 4 · built: src/components/Hero.tsx + hero.css, mattes via assets-src/prep_stills.py, frames in docs/hero-proof/ (desktop 1440x900, phone 390x844). Scroll-scrubbed knife reveal, reduced-motion shows the parted state
- 2026-11-10 · floor · stage 4 · not run (no hyperframes film, rubric or blind critic yet). Below the floor: mid-cut frame reads as a feathered mask reveal, not a blade; phone has dead space between headline and fruit (needs vertical stills); left half has a small matte nub at its bottom tip
- 2026-11-10 · Decision: docs/hero-approved/ stays empty until the floor passes
- 2026-11-10 · hero proof v2 · stage 4 · mid-cut seam fixed: the cut is now a V that opens from the knife tip upward (clip-path wedge over the parted halves, whole fruit clipped to the two outer pieces), then the halves part. Frames in docs/hero-proof/ (desktop 0/20/35/50/70/90, phone 0/50/90)
- 2026-11-10 · floor · stage 4 · still not run. Below the floor, remaining gaps: no hyperframes film or blind critic yet; phone dead space between headline and fruit (needs vertical stills); small matte nub at the left half's bottom tip; no fizz or pour beat built yet
