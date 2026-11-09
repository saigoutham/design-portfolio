"use client";

import { advance } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect, useRef } from "react";
import { WAYPOINTS } from "./day";
import Scene from "./Scene";
import { stage } from "./stage";

const RAIL = WAYPOINTS.filter((w) => w.label);
const STILL_AFTER_MS = 900;
const PEAK_FROM = 0.7; // after this, holding still makes it breathe

declare global {
  interface Window {
    __stakeout?: { goTo: (t: number) => void; frames: () => number };
  }
}

export default function Stakeout() {
  const spacer = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLHeadingElement>(null);
  const cue = useRef<HTMLParagraphElement>(null);
  const hold = useRef<HTMLParagraphElement>(null);
  const rail = useRef<HTMLOListElement>(null);
  const goTo = useRef<(t: number, immediate?: boolean) => void>(() => {});

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    stage.reduced = reduced;

    // One clock: GSAP's ticker drives Lenis, the 3D frame and the stillness check.
    const lenis = reduced ? null : new Lenis();
    lenis?.on("scroll", ScrollTrigger.update);

    let lastScroll = performance.now();
    let still = false;

    const onStill = () => {
      if (reduced) return;
      gsap.fromTo(stage, { iris: 0 }, { iris: 1, duration: 1.4, ease: "power2.inOut" });
      if (stage.t < PEAK_FROM) {
        gsap.fromTo(stage, { trickle: 0 }, { trickle: 1, duration: 1.2, ease: "none" });
      } else {
        gsap.fromTo(stage, { breath: 0 }, { breath: 1, duration: 2.5, ease: "sine.inOut" });
        gsap.fromTo(stage, { plumeRise: 0 }, { plumeRise: 1, duration: 2.5, ease: "power1.out" });
        gsap.timeline()
          .fromTo(stage, { plumeAlpha: 0 }, { plumeAlpha: 0.85, duration: 0.6, ease: "power1.out" })
          .to(stage, { plumeAlpha: 0, duration: 1.7, ease: "power1.in" });
      }
    };

    // Any scroll freezes the body within 150 ms; the plume drifts on and fades.
    const freeze = () => {
      gsap.killTweensOf(stage, "iris,trickle,breath,plumeRise,plumeAlpha"); // never the scroll tween on t
      gsap.to(stage, { iris: 0, trickle: 0, breath: 0, duration: 0.15, ease: "power1.out" });
      gsap.to(stage, { plumeRise: "+=0.15", plumeAlpha: 0, duration: 0.6, ease: "power1.out" });
    };

    const onScroll = () => {
      lastScroll = performance.now();
      if (still) {
        still = false;
        freeze();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let frames = 0;
    const tick = (time: number) => {
      lenis?.raf(time * 1000);
      advance(time * 1000);
      frames++;
      if (!still && performance.now() - lastScroll > STILL_AFTER_MS) {
        still = true;
        onStill();
      }
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    let current = -1;
    const markRail = (p: number) => {
      let idx = 0;
      RAIL.forEach((w, i) => {
        if (p >= w.t - 0.001) idx = i;
      });
      if (idx === current || !rail.current) return;
      current = idx;
      Array.from(rail.current.children).forEach((li, i) => {
        if (i === idx) li.setAttribute("data-current", "");
        else li.removeAttribute("data-current");
      });
    };
    markRail(0);

    // The whole day is one scrubbed timeline: the light, and the few words on screen.
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: spacer.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => markRail(self.progress),
      },
    });
    tl.to(stage, { t: 1, duration: 1 }, 0)
      .to([line.current, cue.current], { autoAlpha: 0, y: -8, duration: 0.05 }, 0.2)
      .fromTo(hold.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.03 }, 0.6)
      .to(hold.current, { autoAlpha: 0, duration: 0.03 }, 0.7);

    goTo.current = (t: number, immediate = false) => {
      const el = spacer.current;
      if (!el) return;
      const y = el.offsetTop + t * (el.offsetHeight - window.innerHeight);
      if (lenis) lenis.scrollTo(y, { immediate, duration: immediate ? 0 : 1.8 });
      else window.scrollTo(0, y);
    };
    window.__stakeout = { goTo: (t) => goTo.current(t, true), frames: () => frames };

    return () => {
      gsap.ticker.remove(tick);
      tl.scrollTrigger?.kill();
      tl.kill();
      lenis?.destroy();
      window.removeEventListener("scroll", onScroll);
      delete window.__stakeout;
    };
  }, []);

  return (
    <>
      <div className="stage-canvas" aria-hidden="true">
        <Scene />
      </div>
      <main className="copy">
        <h1 ref={line} className="line">
          There is a mammoth on this mountain.
        </h1>
        <p className="sr-only">
          A long-lens view across a valley to a snowy ridge. Scrolling passes one day on the mountain, from first light to a low
          sun.
        </p>
        <p ref={cue} className="cue">
          Scroll to pass the day
        </p>
        <p ref={hold} className="hold">
          Hold still.
        </p>
      </main>
      <nav className="rail" aria-label="Time of day">
        <ol ref={rail}>
          {RAIL.map((w) => (
            <li key={w.label}>
              <button type="button" onClick={() => goTo.current(w.t)}>
                {w.label}
              </button>
            </li>
          ))}
        </ol>
      </nav>
      <div ref={spacer} className="spacer" />
    </>
  );
}
