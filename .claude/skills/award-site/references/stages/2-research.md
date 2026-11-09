# Stage 2: Research

**Goal:** `docs/research.md` in three lanes, ending with three specific opportunities.

Setup: `npm run setup -- --with library` (MotionSites), and `research` (last30days) only where its API keys exist.

## Steps
Every finding is marked as observed (with its source URL and the date you saw it), interpretation, or recommendation. Opinions don't get recorded as facts.

1. **Audience:** **last30days** on what the audience says about the category right now. It needs API keys and an open network, and it has failed in cloud sessions on both sites so far. Without them, use web search, record findings with their sources, and say in research.md which one ran.
2. **Competitors** (client track): **scrapling-official** on up to 6 competitor sites, captured as a sameness map: positioning, navigation, sections, how price and proof appear. Whatever they all do is the opening.
3. **Taste:** read `library/motionsites/examples/INDEX.md`, then the 2 or 3 closest examples in full, and `library/scroll-craft/references/approved-collection.md`. For each reference, write down the exact values that make it work (type sizes, tracking, timing, layering), never adjectives. These are designs real people chose, which makes this the most useful lane. The same references come back at the floor check.
4. **Content:** **content-strategy** on what this audience expects to find and in what order, and the content patterns competitors share. Keyword research only when organic search matters to the brief, through seo-audit's own guidance; no second SEO suite.
5. **Technique** (optional): REA (the `rea` pack) on at most one reference effect, to learn how it's built. Notes only. Never copy code, copy or layouts: juries reward originality, and copying is an IP problem.
6. **Lessons:** read `system/lessons.md` and carry forward anything relevant.

Keep raw scrape output in `docs/research/raw/`, which isn't committed because it's other people's content. Only the findings go in research.md, so later stages read a short file.

## Verify
research.md has the three lanes, their sources, and three opportunities specific enough to build a concept on.

## Log
`stage 2 research · done`, plus a skill line for each skill that ran.

## Handoff
- Next: stage 3, Concept.
- Usual recommendations: name the one opportunity you'd build the concept on, and why. If the sameness map shows every competitor using the same hero, recommend the concept attack exactly that.
- Needs from you: nothing, unless research raised a question only the client can answer.
