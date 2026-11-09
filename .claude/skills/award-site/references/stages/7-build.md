# Stage 7: Build

Goal: the site, built to the spec, task by task.

Run **subagent-driven-development**: one task per subagent, reviewed before the next starts. Use the cavecrew agents for small jobs inside a task (find code, edit 2 files or fewer, review a diff) so the main context stays small.

- **Stack:** Next.js App Router, TypeScript, Tailwind with MASTER.md tokens, GSAP with ScrollTrigger, Lenis, and R3F with drei only where the concept needs 3D (`--with 3d` installs the r3f-* skills; the site needs `three @react-three/fiber @react-three/drei @react-three/postprocessing`). Run Lenis on GSAP's ticker so scroll, tweens and WebGL share one clock:
  ```ts
  gsap.registerPlugin(ScrollTrigger);
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  ```
- **Motion:** the gsap-* skills, **choreograph** for anything that moves together, **emil-design-eng** for feel. Rebuild scroll-craft's devices (`library/scroll-craft/references/devices.md`) and MotionSites' technique recipes in GSAP; don't load either engine. Animate transform, opacity and clip-path only.
- **Markers:** put `data-sc-act="<beat>"` on each act and `data-sc-scrub` on scrubbed videos so scroll-craft's scroll walker can check the page.
- **Components:** Bencho blocks from `library/bencho/blocks/` (free, MIT; photos not included), restyled to the tokens. A block keeps the animation code it ships with; nothing else gets added on top.
- **Plumbing:** **ponytail** handles forms, data fetching, config, SEO markup and third-party embeds (checkout, CMS, analytics). It never touches motion, WebGL or the signature move.
- **Markup:** semantic HTML, real headings and alt text, **schema** for structured data, **ai-seo** for answer engines.
- Commit per finished task, inside the site folder.

Log `stage 7 build · done` when the plan's tasks are complete.

## Handoff
- Next: stage 8, Verify.
- Usual recommendations: name anything that drifted from the spec during the build and whether it should be fixed or the spec updated; recommend running Verify on a production build straight away.
- Needs from you: nothing, unless a third-party account (CMS, checkout, analytics) needs your login.
