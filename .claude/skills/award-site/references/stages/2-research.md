# Stage 2: Research

Goal: `docs/research.md`, in three lanes, ending with three specific opportunities.

Setup: `npm run setup -- --with research,library` (last30days and the MotionSites library) if they aren't on yet.

## Lanes
- **Audience:** **last30days** on what the audience is saying about the category right now, only where its API keys and an open network exist (it failed in cloud sessions on both sites so far). Otherwise use web search, record findings with their sources, and say in research.md which one ran.
- **Competitors** (client track): **scrapling-official** on up to 6 competitor sites, captured as a sameness map: navigation, sections, how price and proof appear. What they all do is the opening.
- **Taste:** read `library/motionsites/examples/INDEX.md`, then the 2 or 3 closest examples in full, and `library/scroll-craft/references/approved-collection.md`. For each reference, write down the exact values that make it work (type sizes, tracking, timing, layering), never adjectives. These are designs real people chose, which makes this the most useful part of the research.
- **Technique:** REA (the `rea` pack, optional) on at most one reference effect, to learn how it's built. Notes only. Never copy code, copy or layouts: juries reward originality, and copying is an IP problem.
- **Lessons:** read `system/lessons.md` and carry anything relevant forward.

Keep raw scrape output in `docs/research/raw/` (not committed: it is other people's content) and only the findings in research.md, so later stages read a short file.

Log `stage 2 research · done`.

## Handoff
- Next: stage 3, Concept.
- Usual recommendations: name the one opportunity you'd build the concept on and why; if the sameness map shows every competitor using the same hero, recommend the concept attack exactly that.
- Needs from you: nothing, unless research raised a question only the client can answer.
