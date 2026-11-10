"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./hero.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* Canvas % where the knife starts and ends: just above and just below the fruit in the stills. */
const TOP = 9;
const BOTTOM = 106;

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      const state = { t: 0, part: 0 };
      const paint = () => {
        const y = TOP + (BOTTOM - TOP) * state.t;
        gsap.set(q("[data-stage]"), { "--y": `${y}%` });
        gsap.set(q("[data-tick]"), { top: `${Math.min(y, 96)}%` });
        gsap.set(q("[data-half-l]"), { xPercent: -state.part * 5, rotate: -state.part * 2.2 });
        gsap.set(q("[data-half-r]"), { xPercent: state.part * 5, rotate: state.part * 2.2 });
      };

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        paint();
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.6 },
            onUpdate: paint,
          })
          .to(state, { t: 0, duration: 0.08 })
          .to(state, { t: 1, duration: 0.5 })
          .to(state, { part: 1, duration: 0.3, ease: "power2.out" })
          .to(state, { part: 1, duration: 0.12 });

        gsap.from(q("[data-enter]"), {
          y: 28,
          opacity: 0,
          duration: 0.64,
          ease: "expo.out",
          stagger: 0.08,
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        state.t = 1;
        state.part = 1;
        paint();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="wm-hero" aria-labelledby="hero-title">
      <div className="wm-pin">
        <div className="wm-ground wm-fruitGround" />
        <div className="wm-ground wm-fizzGround" />

        <h1 id="hero-title" className="sr-only" style={srOnly}>
          Real fruit. Real fizz.
        </h1>
        <p className="wm-head wm-headL" data-enter aria-hidden="true">
          Real <br className="wm-br" />
          fruit.
        </p>
        <p className="wm-head wm-headR" data-enter aria-hidden="true">
          Real <br className="wm-br" />
          fizz.
        </p>

        <div className="wm-stage" data-stage>
          <div className="wm-shadow" />
          {/* eslint-disable @next/next/no-img-element */}
          <img data-whole className="wm-whole" src="/img/whole.webp" alt="A whole striped watermelon" width={2000} height={1210} fetchPriority="high" />
          <div data-halves className="wm-halves">
            <img data-half-l className="wm-half wm-halfL" src="/img/halves-L.webp" alt="" width={1200} height={1453} />
            <img data-half-r className="wm-half wm-halfR" src="/img/halves-R.webp" alt="" width={1200} height={1453} />
          </div>
          {/* eslint-enable @next/next/no-img-element */}
          <span data-tick className="wm-tick" aria-hidden="true" />
        </div>

        <div className="wm-line" aria-hidden="true" />

        <p className="wm-fact wm-factL" data-enter>
          A concept watermelon soda. No added sugar.
        </p>
        <a className="wm-cta wm-ctaR" href="#how" data-enter>
          See how it was made
        </a>
      </div>
    </section>
  );
}

const srOnly: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
};
