"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./hero.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* Canvas % where the knife starts and ends: above the fruit, and well below it so the V keeps widening. */
const TOP = 9;
const BOTTOM = 140;

const WHOLE_SIZES = "(max-width: 720px) 124vw, min(78vw, 118svh)";
const HALF_SIZES = "(max-width: 720px) 62vw, min(39vw, 59svh)";

/* Real seeds cut out of the supplied cut-face still. d = release delay 0..1, x = drift in vw. */
const SEEDS = [
  { src: 0, d: 0.0, x: -1.2, s: 1.0 }, { src: 3, d: 0.08, x: 1.6, s: 0.9 },
  { src: 1, d: 0.16, x: -2.4, s: 1.1 }, { src: 4, d: 0.24, x: 0.6, s: 0.8 },
  { src: 5, d: 0.32, x: 2.6, s: 1.0 }, { src: 7, d: 0.4, x: -0.4, s: 0.9 },
  { src: 0, d: 0.48, x: 1.1, s: 1.1 }, { src: 3, d: 0.56, x: -2.0, s: 0.8 },
  { src: 1, d: 0.64, x: 2.2, s: 1.0 }, { src: 4, d: 0.72, x: -1.0, s: 0.9 },
  { src: 5, d: 0.8, x: 0.2, s: 1.1 }, { src: 7, d: 0.88, x: 1.8, s: 0.8 },
];

const clamp = (x: number, a = 0, b = 1) => Math.min(Math.max(x, a), b);
const ss = (x: number) => { const c = clamp(x); return c * c * (3 - 2 * c); };
const BUBBLES = Array.from({ length: 22 }, (_, i) => ({
  x: 6 + ((i * 37) % 88),
  s: 4 + ((i * 53) % 9),
  t: 3.2 + ((i * 29) % 30) / 10,
  d: ((i * 17) % 40) / 10,
}));

const pct = (n: number) => `${n.toFixed(2)}%`;

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      const state = { t: 0, part: 0, seed: 0, col: 0, pour: 0 };

      const paint = () => {
        const tip = TOP + (BOTTOM - TOP) * state.t; // knife tip, canvas %
        const open = ss(state.part / 0.45);
        const slope = 0.14 + 0.12 * state.t + 1.6 * open;
        const hwT = Math.min(slope * tip, 60);
        const hwB = tip > 100 ? Math.min(slope * (tip - 100), 60) : 0;
        const apexY = Math.min(tip, 100);
        const apex = tip < 100 ? `${pct(50)} ${pct(apexY)}` : `${pct(50 + hwB)} 100%, ${pct(50 - hwB)} 100%`;
        const full = open >= 1;
        const started = state.t > 0.001;
        gsap.set(q("[data-halves]"), {
          clipPath: !started ? "polygon(50% 0%, 50% 0%, 50% 0%)" : full ? "none" : `polygon(${pct(50 - hwT)} 0%, ${pct(50 + hwT)} 0%, ${apex})`,
        });
        const left = tip < 100
          ? `polygon(0% 0%, ${pct(50 - hwT)} 0%, 50% ${pct(apexY)}, 50% 100%, 0% 100%)`
          : `polygon(0% 0%, ${pct(50 - hwT)} 0%, ${pct(50 - hwB)} 100%, 0% 100%)`;
        const right = tip < 100
          ? `polygon(${pct(50 + hwT)} 0%, 100% 0%, 100% 100%, 50% 100%, 50% ${pct(apexY)})`
          : `polygon(${pct(50 + hwT)} 0%, 100% 0%, 100% 100%, ${pct(50 + hwB)} 100%)`;
        gsap.set(q("[data-whole-l]"), { clipPath: started ? left : "none", opacity: 1 - open });
        gsap.set(q("[data-whole-r]"), { clipPath: started ? right : "none", opacity: 1 - open });
        gsap.set(q("[data-tick]"), { top: `${Math.min(tip, 96)}%`, opacity: 1 - ss(state.col * 3) });
        gsap.set(q("[data-half-l]"), { xPercent: -state.part * 5, rotate: -state.part * 2.2 });
        gsap.set(q("[data-half-r]"), { xPercent: state.part * 5, rotate: state.part * 2.2 });

        // seeds lift off the cut faces and rise along the divider
        const vw = window.innerWidth, vh = window.innerHeight;
        const stage = root.current?.querySelector<HTMLElement>("[data-stage]");
        const r = stage?.getBoundingClientRect();
        const y0 = r ? r.top + r.height * 0.58 : vh * 0.6;
        q("[data-seed]").forEach((el, i) => {
          const sd = SEEDS[i];
          const p = clamp((state.seed - sd.d * 0.4) / 0.6);
          const e = ss(p);
          const fade = p < 0.1 ? p / 0.1 : p > 0.82 ? (1 - p) / 0.18 : 1;
          gsap.set(el, {
            x: vw / 2 + (sd.x * (0.5 + e) + Math.sin(p * 7 + sd.d * 9) * 1.1) * (vw / 100),
            y: y0 + (-vh * 0.1 - y0) * e,
            rotate: sd.d * 300 + p * 220,
            scale: sd.s * (0.7 + 0.5 * e),
            opacity: state.seed <= 0 ? 0 : clamp(fade),
          });
        });

        // collapse: the divider sweeps to the left edge and the fizz ground takes the screen
        const c = ss(state.col);
        gsap.set(q("[data-ground-l]"), { width: `${50 * (1 - c)}%` });
        gsap.set(q("[data-ground-r]"), { width: `${50 + 50 * c}%` });
        gsap.set(q("[data-line]"), { left: `${50 * (1 - c)}%`, opacity: 1 - ss((c - 0.8) / 0.2) });
        gsap.set(q("[data-head-l]"), { opacity: 1 - ss(c * 2.2), xPercent: -c * 30 });
        gsap.set(q("[data-fact]"), { opacity: 1 - ss(c * 2) });
        gsap.set(q("[data-stage]"), { opacity: 1 - ss((c - 0.05) / 0.5), y: c * 40 });
        const closeIn = ss((c - 0.78) / 0.22);
        const closeOut = ss(state.pour / 0.25);
        gsap.set(q("[data-close]"), { opacity: closeIn * (1 - closeOut), y: (1 - closeIn) * 24 - closeOut * 30 });

        // pour: the glass fills from the bottom, bubbles start to rise
        const fill = ss((state.pour - 0.12) / 0.7);
        const pourIn = ss((state.pour - 0.05) / 0.2);
        gsap.set(q("[data-glass]"), {
          "--fill": `${(fill * 112).toFixed(1)}%`,
          opacity: pourIn,
          y: (1 - pourIn) * 40,
        });
        gsap.set(q("[data-bubbles]"), { opacity: ss((state.pour - 0.35) / 0.4), visibility: state.pour > 0.3 ? "visible" : "hidden" });
        gsap.set(q("[data-pour-text]"), { opacity: ss((state.pour - 0.75) / 0.25), y: (1 - ss((state.pour - 0.75) / 0.25)) * 16 });
      };

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        paint();
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.6 },
            onUpdate: paint,
          })
          .to(state, { t: 0, duration: 0.06 })
          .to(state, { t: 1, duration: 0.34 })
          .to(state, { part: 1, duration: 0.14, ease: "power2.out" })
          .to(state, { seed: 1, duration: 0.22 })
          .to(state, { col: 1, duration: 0.18 })
          .to(state, { col: 1, duration: 0.06 })
          .to(state, { pour: 1, duration: 0.32 })
          .to(state, { pour: 1, duration: 0.06 });

        gsap.from(q("[data-enter]"), { y: 28, opacity: 0, duration: 0.64, ease: "expo.out", stagger: 0.08 });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        state.t = 1;
        state.part = 1;
        state.col = 1;
        state.pour = 1;
        paint();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="wm-hero" aria-labelledby="hero-title">
      <a className="wm-skip" href="#how">Skip the scroll scene</a>
      <div className="wm-pin">
        <div className="wm-ground wm-fruitGround" data-ground-l />
        <div className="wm-ground wm-fizzGround" data-ground-r />

        <h1 id="hero-title" style={srOnly}>Real fruit. Real fizz.</h1>
        <p className="wm-head wm-headL" data-head-l data-enter aria-hidden="true">
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
          <img data-whole-l className="wm-whole" src="/img/whole-2000.webp" srcSet="/img/whole-1000.webp 1000w, /img/whole-2000.webp 2000w" sizes={WHOLE_SIZES} alt="A whole striped watermelon" width={2000} height={1210} fetchPriority="high" decoding="async" />
          <img data-whole-r className="wm-whole" src="/img/whole-2000.webp" srcSet="/img/whole-1000.webp 1000w, /img/whole-2000.webp 2000w" sizes={WHOLE_SIZES} alt="" width={2000} height={1210} decoding="async" />
          <div data-halves className="wm-halves">
            <img data-half-l className="wm-half wm-halfL" src="/img/halves-L-1200.webp" srcSet="/img/halves-L-600.webp 600w, /img/halves-L-1200.webp 1200w" sizes={HALF_SIZES} alt="" width={1200} height={1453} fetchPriority="low" decoding="async" />
            <img data-half-r className="wm-half wm-halfR" src="/img/halves-R-1200.webp" srcSet="/img/halves-R-600.webp 600w, /img/halves-R-1200.webp 1200w" sizes={HALF_SIZES} alt="" width={1200} height={1453} fetchPriority="low" decoding="async" />
          </div>
          <span data-tick className="wm-tick" aria-hidden="true" />
        </div>

        <div className="wm-seeds" aria-hidden="true">
          {SEEDS.map((s, i) => (
            <img key={i} data-seed className="wm-seed" src={`/img/seeds/seed-${s.src}.webp`} alt="" width={45} height={65} style={{ opacity: 0 }} />
          ))}
          {/* eslint-enable @next/next/no-img-element */}
        </div>

        <div className="wm-line" data-line aria-hidden="true" />

        <p className="wm-close" data-close style={{ opacity: 0 }}>You made the cut.</p>

        <div className="wm-glass" data-glass style={{ opacity: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/glass-1000.webp" srcSet="/img/glass-560.webp 560w, /img/glass-1000.webp 1000w" sizes="(max-width: 720px) 60vw, 36svh" alt="A tall glass of pink watermelon soda with ice and a wedge of melon on the rim" width={1000} height={1393} decoding="async" fetchPriority="low" />
        </div>
        <div className="wm-bubbles" data-bubbles aria-hidden="true" style={{ visibility: "hidden", opacity: 0 }}>
          {BUBBLES.map((b, i) => (
            <span key={i} style={{ left: `${22 + b.x * 0.4}%`, width: b.s, height: b.s, animationDuration: `${b.t}s`, animationDelay: `-${b.d}s` }} />
          ))}
        </div>
        <p className="wm-pourText" data-pour-text style={{ opacity: 0 }}>Cut it. Pour it.</p>

        <p className="wm-fact wm-factL" data-fact data-enter>
          A concept watermelon soda. No added sugar.
        </p>
        <a className="wm-cta wm-ctaR" href="#how" data-enter>
          <span>See how it was made</span>
          <span className="wm-arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}

const srOnly: React.CSSProperties = {
  position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap", margin: 0,
};
