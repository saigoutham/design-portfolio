# Stage 7: Build

**Goal:** the site, built to the spec, task by task, with each visible section passing the floor before the next starts.

## Steps
1. Run gstack's **freeze** on `sites/<site>/` so no task edits files outside the site. Then run **subagent-driven-development**: one task per subagent, reviewed before the next starts. Use **using-git-worktrees** to isolate parallel tasks and **finishing-a-development-branch** to merge them. Use the cavecrew agents for small jobs inside a task.
2. **Stack:** Next.js App Router, TypeScript, Tailwind with MASTER.md tokens, GSAP with ScrollTrigger, Lenis, and R3F with drei only where the concept needs 3D. The `3d` pack installs the r3f-* skills; the site needs `three @react-three/fiber @react-three/drei @react-three/postprocessing`. Run Lenis on GSAP's ticker so scroll, tweens and WebGL share one clock:
   ```ts
   gsap.registerPlugin(ScrollTrigger);
   const lenis = new Lenis();
   lenis.on("scroll", ScrollTrigger.update);
   gsap.ticker.add((t) => lenis.raf(t * 1000));
   gsap.ticker.lagSmoothing(0);
   ```
   Check current APIs with Context7 before guessing; Next.js, R3F and GSAP all move fast.
3. **Motion:**
   - The **gsap-core**, **gsap-timeline**, **gsap-scrolltrigger** and **gsap-react** skills, plus gsap-plugins, gsap-utils or gsap-performance when a task needs one.
   - **choreograph** for anything that moves together, and **emil-design-eng** for feel.
   - Rebuild scroll-craft's devices (`library/scroll-craft/references/devices.md`) and MotionSites' technique recipes in GSAP; don't load either engine.
   - Animate transform, opacity and clip-path only.
4. **3D:** load only the r3f-* skill the task needs (r3f-lighting for a lighting task, r3f-shaders for a shader), not the whole pack.
5. **Product UI:** any interface the page shows is built with **stageshow**, to its restraint and framing rules. Its motion is rewritten in GSAP or filmed to video (conflict rule 4).
6. **Components:** Bencho blocks from `library/bencho/blocks/` (free, MIT; photos not included), restyled to the tokens, and Bencho's sounds where the concept has sound. A block keeps the animation code it ships with; nothing else gets added on top.
7. **Plumbing:** **ponytail** handles forms, data fetching, config, SEO markup and third-party embeds. It never touches motion, WebGL or the signature move. Use **test-driven-development** for logic-heavy plumbing and **systematic-debugging** when a bug survives one fix.
8. **Markup:** semantic HTML, real headings and alt text, **schema** for structured data, and **ai-seo** for answer engines. Put `data-sc-act="<beat>"` on each act and `data-sc-scrub` on scrubbed videos, so scroll-craft's walker can check the page.
9. **Floor per section:** each task that changes what a visitor sees ends with floor check steps 1, 3 and 4 before the next task starts. When the page is complete, run **impeccable** polish across it.
10. Commit per finished task, inside the site folder.

## Verify
Every task in the plan is done and reviewed, each visible section has a floor row in docs/floor.md, and the production build passes.

## Log
`stage 7 build · done`, plus a skill line for each skill that ran.

## Handoff
- Next: stage 8, Verify.
- Usual recommendations: name anything that drifted from the spec during the build, and whether to fix it or update the spec. Recommend running Verify on a production build straight away.
- Needs from you: nothing, unless a third-party account (CMS, checkout, analytics) needs your login.
