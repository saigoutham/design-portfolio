# Third-party components

This repo commits copies of other people's open-source skills so the pipeline works on a fresh clone. Each copy keeps its own LICENSE (and NOTICE, where there is one) in its folder, and is pinned to the commit below in `skills.lock.json`. The owners' terms apply to their files; nothing here relicenses them.

| Source | Licence | Commit | Committed here |
|---|---|---|---|
| [obra/superpowers](https://github.com/obra/superpowers) | MIT | `22f0b463e7a5` | brainstorming (skill), writing-plans (skill), subagent-driven-development (skill), verification-before-completion (skill), systematic-debugging (skill), test-driven-development (skill), using-git-worktrees (skill), finishing-a-development-branch (skill) |
| [mattpocock/skills](https://github.com/mattpocock/skills) | MIT | `4ae2317ddb22` | grilling (skill), grill-me (skill) |
| [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | MIT | `4f2dbb67e649` | ui-ux-pro-max (skill), design-system (skill) |
| [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | Apache-2.0 | `4b6b80f9c21c` | impeccable (skill) |
| [emilkowalski/skill](https://github.com/emilkowalski/skill) | MIT | `5206a950b715` | emil-design-eng (skill), choreograph (skill), review-animations (skill), animation-performance (skill) |
| [greensock/gsap-skills](https://github.com/greensock/gsap-skills) | MIT | `aed9cfd32777` | gsap-core (skill), gsap-timeline (skill), gsap-scrolltrigger (skill), gsap-plugins (skill), gsap-react (skill), gsap-performance (skill), gsap-utils (skill), gsap-frameworks (skill) |
| [juliobsz/skills](https://github.com/juliobsz/skills) | MIT | `add880bd6ec9` | jury (skill) |
| [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) | MIT | `96798cf38736` | seo-audit (skill), ai-seo (skill), schema (skill) |
| [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) | MIT | `96608e078b2d` | ponytail (skill) |
| [vercel-labs/skills](https://github.com/vercel-labs/skills) | MIT | `d3701c11b110` | find-skills (skill) |
| [D4Vinci/Scrapling](https://github.com/D4Vinci/Scrapling) | BSD-3-Clause | `30cadb56a407` | scrapling-official (skill) |
| [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) | Apache-2.0 | `3dc497a7f858` | cavecrew (skill), cavecrew-investigator (agent), cavecrew-builder (agent), cavecrew-reviewer (agent) |
| [Yeachan-Heo/oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode) | MIT | `19e6daa3647e` | visual-verdict (skill), minimal-prose-discipline (skill) |
| [nateherkai/scroll-craft](https://github.com/nateherkai/scroll-craft) | MIT | `75d81f74e836` | library/scroll-craft (library) |
| [elayadesign/ai-design-skills](https://github.com/elayadesign/ai-design-skills) | MIT | `456d9e0d3e2d` | library/elaya (library) |
| [cabralorenzo/bencho](https://github.com/cabralorenzo/bencho) | MIT for free blocks and sounds; Bencho name, goat and photographs excluded | `c65992417427` | library/bencho (library) |

## Fetched on demand, not committed

These are downloaded by `npm run setup -- --with <pack>` at their pinned commits and are git-ignored:

| Source | Licence | Why it isn't committed |
|---|---|---|
| [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | MIT | Installed when stage 4 first runs (pack `taste`): its broad description would otherwise trigger on unrelated work. |
| [mvanhorn/last30days-skill](https://github.com/mvanhorn/last30days-skill) | MIT | Installed when stage 2 first runs (pack `research`), with its own setup. |
| [enzed/r3f-skills](https://github.com/enzed/r3f-skills) | MIT (stated in README; no LICENSE file) | Only needed for 3D sites; the licence is stated in its README, with no LICENSE file to carry along. |
| [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) | Apache-2.0 | Only needed for some sites (pack `video`). |
| [remotion-dev/skills](https://github.com/remotion-dev/skills) | none published | No licence published, so it can't be redistributed. |
| [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) | Apache-2.0 | Only needed for some sites (pack `compress`). |
| [adithya-s-k/manim_skill](https://github.com/adithya-s-k/manim_skill) | MIT | Only needed for some sites (pack `manim`). |
| [Motionsites-AI/claude-skill](https://github.com/Motionsites-AI/claude-skill) | MIT for instructions and code; example prompts and media (c) MotionSites | Example prompts and media are © MotionSites; usable in sites built with it, not redistributable. |

gstack and REA install through their own setup and are never committed.
