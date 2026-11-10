"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./hero.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* Canvas % where the knife starts and ends: just above and just below the fruit in the stills. */
const TOP = 9;
const BOTTOM = 140;

const WHOLE_SIZES = "(max-width: 720px) 124vw, min(78vw, 118svh)";
const HALF_SIZES = "(max-width: 720px) 62vw, min(39vw, 59svh)";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      const state = { t: 0, part: 0 };
      const ss = (x: number) => { const c = Math.min(Math.max(x, 0), 1); return c * c * (3 - 2 * c); };
      const pct = (n: number) => `${n.toFixed(2)}%`;
      const paint = () => {
        const tip = TOP + (BOTTOM - TOP) * state.t; // knife tip, canvas %
        const open = ss(state.part / 0.45);
        const slope = 0.14 + 0.12 * state.t + 1.6 * open; // how fast the V widens per % above the tip
        const hwT = Math.min(slope * tip, 60); // half width of the V at the canvas top
        const hwB = tip > 100 ? Math.min(slope * (tip - 100), 60) : 0; // and at the canvas bottom
        const apexY = Math.min(tip, 100);
        const apex = tip < 100 ? `${pct(50)} ${pct(apexY)}` : `${pct(50 + hwB)} 100%, ${pct(50 - hwB)} 100%`;
        const full = open >= 1;
        gsap.set(q("[data-halves]"), {
          clipPath: full ? "none" : `polygon(${pct(50 - hwT)} 0%, ${pct(50 + hwT)} 0%, ${apex})`,
        });
        const left = tip < 100
          ? `polygon(0% 0%, ${pct(50 - hwT)} 0%, 50% ${pct(apexY)}, 50% 100%, 0% 100%)`
          : `polygon(0% 0%, ${pct(50 - hwT)} 0%, ${pct(50 - hwB)} 100%, 0% 100%)`;
        const right = tip < 100
          ? `polygon(${pct(50 + hwT)} 0%, 100% 0%, 100% 100%, 50% 100%, 50% ${pct(apexY)})`
          : `polygon(${pct(50 + hwT)} 0%, 100% 0%, 100% 100%, ${pct(50 + hwB)} 100%)`;
        gsap.set(q("[data-whole-l]"), { clipPath: left, opacity: 1 - open });
        gsap.set(q("[data-whole-r]"), { clipPath: right, opacity: 1 - open });
        gsap.set(q("[data-tick]"), { top: `${Math.min(tip, 96)}%` });
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

        <div className="wm-stage">
          <div className="wm-shadow" />
          {/* eslint-disable @next/next/no-img-element */}
          <img data-whole-l className="wm-whole" src="/img/whole-2000.webp" srcSet="/img/whole-1000.webp 1000w, /img/whole-2000.webp 2000w" sizes={WHOLE_SIZES} alt="A whole striped watermelon" width={2000} height={1210} fetchPriority="high" decoding="async" />
          <img data-whole-r className="wm-whole" src="/img/whole-2000.webp" srcSet="/img/whole-1000.webp 1000w, /img/whole-2000.webp 2000w" sizes={WHOLE_SIZES} alt="" width={2000} height={1210} decoding="async" />
          <div data-halves className="wm-halves">
            <img data-half-l className="wm-half wm-halfL" src="/img/halves-L-1200.webp" srcSet="/img/halves-L-600.webp 600w, /img/halves-L-1200.webp 1200w" sizes={HALF_SIZES} alt="" width={1200} height={1453} fetchPriority="low" decoding="async" />
            <img data-half-r className="wm-half wm-halfR" src="/img/halves-R-1200.webp" srcSet="/img/halves-R-600.webp 600w, /img/halves-R-1200.webp 1200w" sizes={HALF_SIZES} alt="" width={1200} height={1453} fetchPriority="low" decoding="async" />
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
