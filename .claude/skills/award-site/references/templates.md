# Templates

Formats the scripts and later stages depend on. Keep the stage log format exact: `status.mjs` parses it.

## docs/decisions.md

```markdown
# <Site>: decisions

Track: client | own
Repo: design-portfolio/sites/<site> | <git url>

## Stage log
- 2026-11-09 · stage 0 setup · done
- 2026-11-10 · stage 1 intake · done
- 2026-11-11 · gate 1 · approved · <who, how>
- 2026-11-14 · jury · pass · 7.4

## Decisions
- 2026-11-12 · Grammar: chaptered editorial. Continuous world fits the geography but is the most fragile; the brief doesn't need one unbroken flight.
```

Stage lines: `- <YYYY-MM-DD> · stage <0-9> <name> · <started | done | blocked: reason>`. Gate lines: `- <date> · gate <1|2|3> · <approved | changes requested> · <note>`. Jury lines: `- <date> · jury · <pass | fail> · <estimate>`. Gates: 1 brief, 2 concept and hero, 3 production URL (client track only).

## docs/concept.md

```markdown
# <Site>: concept

**It's the site where** <an experience, not a technique>.

## Journey
1. <beat>: <what the visitor knows or feels after it>

## Grammar: <one of the 8>
Why not the others: <one line each>

## Signature move
<what the visitor does, what happens, why it exists only here>

## Feeling curve
| Beat | Feeling | What on screen causes it |
|---|---|---|
Peak: <beat>, said the way a visitor would tell a friend.

## Fingerprint check
| Against | Grammar | Nav | Hero | Act shape | Close | Signature | Differs on |
|---|---|---|---|---|---|---|---|
```

## docs/qa.md

```markdown
# <Site>: QA, <date>

## Builder loop
| Check | Result | Evidence |
|---|---|---|
| Scroll walker | | lab/shots/sheet.png |
| Hero fidelity (visual-verdict) | /100 | |
| Rubric average (lowest) | | |
| Feel check | matches / differs at <beat> | |
| Core Web Vitals, throttled phone | LCP / INP / CLS | |

## Blind jury
Estimate: <n> (critic <n> + offset) · Band: <...> · Critic's reading: "<sentence>" · Matches concept: yes/no
Top fixes: <ranked>
```

## Site CLAUDE.md (written by new-site.mjs)

Short on purpose: it loads in every session. Site name, track, where the context files are, and "run /award-site status <site> to see where this site stands".

## sites/<site>.md (sites that live in their own repo)

```markdown
# <site>
Repo: <git url>
Local: <path, when cloned next to design-portfolio>
Track: client | own
```

## system/FINGERPRINTS.md row

`| <site> | <grammar> | <nav> | <hero> | <device order, act count, total viewport heights> | <close> | <signature move> | <world> | <url> |`
A `planned` row has `planned` in every column after the site name, and is replaced with real values at launch.

## system/calibration.md row

`| <site> | <date> | <critic overall> | <estimate> | <real overall> | <design> | <usability> | <creativity> | <content> | <gap> |`

## system/lessons.md line

`- <date> · <site> · <what a real jury rewarded or punished> → <what to do differently>`
