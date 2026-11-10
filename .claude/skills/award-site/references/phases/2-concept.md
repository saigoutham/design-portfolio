# Phase 2: concept and art proof

Ends with a concept the user can approve **and** a real piece of its art they can look at. Packs: `library`, `video` if the proof is motion, `imagegen` or `scrape` if those rungs are open.

## 1. Draft (you, inline, short)
From the brief and `system/capabilities.json`, sketch two or three concepts in a few lines each. Use brainstorming only to widen the options. Every concept names: the signature move in one sentence a visitor would say, and the art route (rung and what the asset is) from `references/art.md`. Drop any concept whose art needs a closed rung.

## Before launching art agents
If `npm run probe` ends with "No rung here can make award-level hero art on its own", don't launch art agents: ask for supplied files or an image API key first. On 2026-11-10 two capped art agents in such a workspace spent 160k tokens on 4/10 and 3/10 results.

## 2. Three agents in one message
- **Research** (haiku, 30k cap): what award-winning sites in this category all do (the sameness map), three references for the floor check with exact values worth learning (type sizes, scroll length, timing), audience tone, any claim or legal limit. Uses WebSearch, `library/scroll-craft/references/approved-collection.md` and the MotionSites examples. Output: `docs/research.md`, under 500 words.
- **Art route A** and **Art route B** (sonnet, 40k cap, 2 attempts each): each makes the hero asset for the leading concept by a different route. Output: the file in `docs/art/`, plus render time and what's still wrong.

## 3. Judge
Look at both proofs yourself, then run the critic from `references/art.md`. Pick the concept and route.

## 4. Write `docs/concept.md`
Keep these headings (the status script and later phases read them): the one-line "It's the site where…"; `## Approaches` (the options and why this one); `## Journey` (4-7 beats, each a visible change); `## Signature move`; `## Feeling curve` (beat, feeling, what on screen causes it, one peak); `## Art route`; `## Fingerprint check`.

Structure: pick the page's grammar from `library/scroll-craft/references/uniqueness.md` and obey its bans. The fingerprint check compares grammar, navigation, hero composition, act shape, close and signature against every row in `system/FINGERPRINTS.md`; it must differ on at least 4 of 6.

Write `docs/art.md` (format in `references/art.md`).

## 5. Show it
Send the user the art proof file and the concept in a few lines. Own track: ask for a yes. Client track: this goes with the hero at `gate 2`, so continue.

If no route passes: say so, show the best attempt as "Below the floor", and offer a changed concept or a short list of files to supply.
