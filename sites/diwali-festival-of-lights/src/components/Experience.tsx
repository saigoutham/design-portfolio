"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
// Class names are global and prefixed x- (see experience.css, imported in the layout).
const s = new Proxy({} as Record<string, string>, { get: (_t, k) => `x-${String(k)}` });
import { Diya, WICK } from "./Diya";
import { StaticFlame } from "./StaticFlame";
import { FlameCanvas, FLAME_BASE, type FlameHandle } from "./FlameCanvas";
import { PattachitraChurning, PANEL_W, PANEL_H } from "./panels/PattachitraChurning";
import { LAMPS, lampName } from "@/lib/lamps";

gsap.registerPlugin(ScrollTrigger);

const HOLD_MS = 600;
const ROW_LAMP = 44;
const ROW_GAP = 12;
const ROW_BOTTOM = 18;
const ROW_W = 6 * ROW_LAMP + 5 * ROW_GAP;
const MAX_S = 2.7; // hero lamp scale on a wide screen (about 119px per lamp)
const FLAME_W = 72; // carried flame canvas width at MAX_S
// wick position inside a 44 x 44 lamp button (the diya sits on the button's bottom edge)
const DIYA_H = ROW_LAMP * (64 / 120);
const WICK_IN_BTN = { x: WICK.x * ROW_LAMP, y: ROW_LAMP - DIYA_H + WICK.y * DIYA_H };

type Phase = "idle" | "holding" | "catching" | "open" | "ending" | "waiting" | "done";

const STORY_TEXT =
  "The gods and the asuras wanted the nectar of immortality, so together they churned the ocean of milk. Mount Mandara was their churning rod and the serpent Vasuki their rope. Vishnu, as the tortoise Kurma, held the mountain up from below.";

const STARS = Array.from({ length: 46 }, (_, i) => {
  const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
  const q = (v: number) => Math.round(v * 100) / 100;
  return { x: q(r(1) * 100), y: q(r(2) * 100), s: q(0.6 + r(3) * 1.2), o: q(0.15 + r(4) * 0.45) };
});

export function Experience() {
  const storyRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const paintingRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const flameRef = useRef<FlameHandle>(null);
  const lampRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const wickRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const phaseRef = useRef<Phase>("idle");
  const targetRef = useRef(0); // the lamp waiting to be lit
  const geo = useRef({ vw: 0, vh: 0, heroS: 1, heroTy: 0, rowTx: 0, bandH: 150, paintH: 0, pan: 0, buffer: 0, reduced: false });
  const rowAnim = useRef({ s: 1, ty: 0, tx: 0 });
  const flameState = useRef({ follow: -1 as number, scale: 1, intensity: 0 });
  const hold = useRef({ t0: 0, raf: 0, active: false });

  const [phase, setPhaseState] = useState<Phase>("idle");
  const [lit, setLit] = useState<boolean[]>(() => LAMPS.map(() => false));
  const [announce, setAnnounce] = useState("");
  const [bandLamp, setBandLamp] = useState(0);

  const setPhase = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhaseState(p);
  }, []);

  // ---- geometry -------------------------------------------------------------
  const wickCenter = (el: Element | null) => {
    if (!el) return { x: 0, y: 0 };
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };

  const placeFlame = useCallback((x: number, y: number, scale: number) => {
    const el = flameRef.current?.element;
    if (!el) return;
    gsap.set(el, { x: x - FLAME_BASE.x * FLAME_W, y: y - FLAME_BASE.y * FLAME_W * 1.5, scale });
    flameState.current.scale = scale;
    const g = glowRef.current;
    if (g) gsap.set(g, { x, y: y - 14 * scale });
  }, []);

  const applyRow = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;
    row.style.setProperty("--s", String(rowAnim.current.s));
    row.style.setProperty("--ty", `${rowAnim.current.ty}px`);
    row.style.setProperty("--tx", `${rowAnim.current.tx}px`);
    const f = flameState.current.follow;
    if (f >= 0) {
      const c = wickCenter(wickRefs.current[f]);
      placeFlame(c.x, c.y, rowAnim.current.s / MAX_S);
    }
  }, [placeFlame]);

  const layout = useCallback(() => {
    const g = geo.current;
    g.vw = window.innerWidth;
    g.vh = window.innerHeight;
    g.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const phone = g.vw <= 700;
    g.bandH = phone ? 304 : 150;
    g.rowTx = phone ? 0 : g.vw - 32 - ROW_W / 2 - g.vw / 2;
    g.heroS = Math.min(MAX_S, (g.vw - 32) / ROW_W);
    const heroBottom = g.vh * (g.vh < 700 ? 0.58 : phone ? 0.6 : 0.66);
    g.heroTy = heroBottom - (g.vh - ROW_BOTTOM);
    g.paintH = g.vh - g.bandH;
    const paintW = g.reduced ? g.vw : g.paintH * (PANEL_W / PANEL_H);
    g.pan = Math.max(0, paintW - g.vw);
    g.buffer = g.vh * 0.3;

    const stage = stageRef.current!;
    stage.style.setProperty("--band-h", `${g.bandH}px`);
    stage.style.setProperty("--ledge-y", `${heroBottom - 6}px`);
    if (storyRef.current) storyRef.current.style.height = `${g.vh + g.buffer + g.pan + g.vh * 0.7}px`;
    if (trackRef.current) trackRef.current.dataset.fit = g.reduced ? "width" : "height";

    if (phaseRef.current === "idle" || phaseRef.current === "holding") {
      rowAnim.current = { s: g.heroS, ty: g.heroTy, tx: 0 };
    } else if (phaseRef.current !== "catching") {
      rowAnim.current = { s: 1, ty: 0, tx: g.rowTx };
    }
    applyRow();
    ScrollTrigger.refresh();
  }, [applyRow]);

  // ---- lighting -------------------------------------------------------------
  const setLampWarmth = (values: number[]) => {
    values.forEach((v, i) => lampRefs.current[i]?.style.setProperty("--lit", String(v)));
  };

  const lightFirst = useCallback(() => {
    if (phaseRef.current !== "idle" && phaseRef.current !== "holding") return;
    const g = geo.current;
    const d = (x: number) => (g.reduced ? 0.01 : x);
    setPhase("catching");
    setLit((l) => l.map((v, i) => (i === 0 ? true : v)));
    flameState.current.follow = 0;
    applyRow();
    const flame = flameRef.current!;
    const fs = { i: flameState.current.intensity, k: 0.6 };
    const tl = gsap.timeline();
    // the flame catches
    tl.to(fs, {
      i: 1, k: 1, duration: d(0.9), ease: "power3.out",
      onUpdate: () => {
        flame.setIntensity(fs.i);
        const c = wickCenter(wickRefs.current[0]);
        placeFlame(c.x, c.y, (rowAnim.current.s / MAX_S) * fs.k);
      },
    });
    tl.to(glowRef.current, { opacity: 1, duration: d(1.2), ease: "power2.out" }, 0);
    const warm = { w: 0 };
    tl.to(warm, {
      w: 1, duration: d(1.2), ease: "power2.out",
      onUpdate: () => {
        setLampWarmth(LAMPS.map((_, i) => (i === 0 ? warm.w : warm.w * Math.max(0, 0.42 - i * 0.07))));
        stageRef.current?.style.setProperty("--warm", String(warm.w));
      },
    }, 0);
    // the light develops the painting, outward from the lamp
    tl.add(() => {
      const p = paintingRef.current!;
      const c = wickCenter(wickRefs.current[0]);
      const pr = p.getBoundingClientRect();
      p.style.setProperty("--cx", `${c.x - pr.left}px`);
      p.style.setProperty("--cy", `${c.y - pr.top}px`);
      p.dataset.open = "true";
    }, d(0.45));
    const reveal = { r: 0 };
    tl.to(reveal, {
      r: Math.hypot(g.vw, g.vh) + 40, duration: d(1.7), ease: "power2.inOut",
      onUpdate: () => paintingRef.current?.style.setProperty("--r", `${reveal.r}px`),
    }, d(0.45));
    tl.to(heroRef.current, { autoAlpha: 0, duration: d(0.6), ease: "power2.out" }, d(0.7));
    // the lamps step down into the row
    tl.to(rowAnim.current, {
      s: 1, ty: 0, tx: g.rowTx, duration: d(1.2), ease: "power3.inOut", onUpdate: applyRow,
    }, d(1.15));
    tl.to(glowRef.current, { opacity: 0, duration: d(0.9), ease: "power2.out" }, d(1.6));
    tl.add(() => {
      setLampWarmth(LAMPS.map((_, i) => (i === 0 ? 1 : 0)));
      flameState.current.follow = -1;
      setPhase("open");
      setAnnounce("Lamp 1 is lit. Its story is open.");
    }, d(2.35));
    tl.to(fs, { i: 0, duration: d(0.35), onUpdate: () => flame.setIntensity(fs.i) }, d(2.35));
  }, [applyRow, placeFlame, setPhase]);

  const endStory = useCallback(() => {
    if (phaseRef.current !== "open") return;
    const g = geo.current;
    const d = (x: number) => (g.reduced ? 0.01 : x);
    setPhase("ending");
    const flame = flameRef.current!;
    const end = document.querySelector('[data-wick="lamp1-end"]');
    const from = wickCenter(end);
    const fromScale = ((g.paintH / PANEL_H) * 190) / (ROW_LAMP * MAX_S) * 0.9;
    const fs = { i: 0, k: 0.6, t: 0 };
    placeFlame(from.x, from.y, fromScale * 0.6);
    const tl = gsap.timeline();
    tl.to(glowRef.current, { opacity: 0.55, duration: d(0.8) }, 0);
    tl.to(fs, {
      i: 1, k: 1, duration: d(0.9), ease: "power3.out",
      onUpdate: () => { flame.setIntensity(fs.i); placeFlame(from.x, from.y, fromScale * fs.k); },
    }, 0);
    // the flame lifts out of the painting and is carried to the next lamp
    tl.to(fs, {
      t: 1, duration: d(1.5), ease: "power2.inOut",
      onUpdate: () => {
        const to = wickCenter(wickRefs.current[1]);
        const toY = to.y - 6;
        const x = from.x + (to.x - from.x) * fs.t;
        const y = from.y + (toY - from.y) * fs.t - Math.sin(Math.PI * fs.t) * Math.min(160, g.vh * 0.18);
        placeFlame(x, y, fromScale + (1.15 / MAX_S - fromScale) * fs.t);
      },
    }, d(1.4));
    tl.to(glowRef.current, { opacity: 0.25, duration: d(1.5) }, d(1.4));
    tl.add(() => {
      flameState.current.follow = -1;
      targetRef.current = 1;
      setBandLamp(1);
      setPhase("waiting");
      setLampWarmth(LAMPS.map((_, i) => (i === 0 ? 1 : i === 1 ? 0.6 : 0)));
      setAnnounce("The flame waits at lamp 2. Press and hold lamp 2 to light it.");
    }, d(2.95));
  }, [placeFlame, setPhase]);

  const lightSecond = useCallback(() => {
    if (phaseRef.current !== "waiting") return;
    const g = geo.current;
    const d = (x: number) => (g.reduced ? 0.01 : x);
    setPhase("done");
    const flame = flameRef.current!;
    const fs = { i: 1, y: -6 };
    const tl = gsap.timeline();
    tl.to(fs, {
      y: 0, duration: d(0.5), ease: "power2.out",
      onUpdate: () => { const c = wickCenter(wickRefs.current[1]); placeFlame(c.x, c.y + fs.y, 1.15 / MAX_S); },
    });
    tl.add(() => {
      setLit((l) => l.map((v, i) => (i <= 1 ? true : v)));
      setLampWarmth(LAMPS.map((_, i) => (i <= 1 ? 1 : 0)));
    });
    tl.to(fs, { i: 0, duration: d(0.4), onUpdate: () => flame.setIntensity(fs.i) }, d(0.5));
    tl.to(glowRef.current, { opacity: 0, duration: d(0.6) }, d(0.4));
    tl.add(() => setAnnounce("Lamp 2 is lit. Its story is drawn next."));
  }, [placeFlame, setPhase]);

  // ---- hold to light ----------------------------------------------------------
  const startHold = useCallback((i: number) => {
    if (i !== targetRef.current) return;
    const p = phaseRef.current;
    if (!(p === "idle" && i === 0) && !(p === "waiting" && i === 1)) return;
    if (hold.current.active) return;
    hold.current.active = true;
    hold.current.t0 = performance.now();
    if (i === 0) setPhase("holding");
    const btn = lampRefs.current[i];
    const tick = () => {
      if (!hold.current.active) return;
      const k = Math.min(1, (performance.now() - hold.current.t0) / HOLD_MS);
      btn?.style.setProperty("--hold", String(k));
      if (i === 0) {
        flameState.current.intensity = k * 0.25;
        flameRef.current?.setIntensity(k * 0.25);
        const c = wickCenter(wickRefs.current[0]);
        placeFlame(c.x, c.y, (rowAnim.current.s / MAX_S) * (0.3 + 0.3 * k));
      }
      if (k >= 1) {
        hold.current.active = false;
        btn?.style.setProperty("--hold", "0");
        if (i === 0) lightFirst();
        else lightSecond();
        return;
      }
      hold.current.raf = requestAnimationFrame(tick);
    };
    hold.current.raf = requestAnimationFrame(tick);
  }, [lightFirst, lightSecond, placeFlame, setPhase]);

  const endHold = useCallback((i: number) => {
    if (!hold.current.active) return;
    hold.current.active = false;
    cancelAnimationFrame(hold.current.raf);
    const btn = lampRefs.current[i];
    const h = { k: Number(btn?.style.getPropertyValue("--hold") || 0) };
    gsap.to(h, { k: 0, duration: 0.3, onUpdate: () => btn?.style.setProperty("--hold", String(h.k)) });
    if (i === 0) {
      flameState.current.intensity = 0;
      flameRef.current?.setIntensity(0);
      setPhase("idle");
    }
  }, [setPhase]);

  // ---- scroll -----------------------------------------------------------------
  useEffect(() => {
    layout();
    const reduced = geo.current.reduced;
    let lenis: Lenis | null = null;
    const raf = (t: number) => lenis?.raf(t * 1000);
    if (!reduced) {
      lenis = new Lenis({ lerp: 0.12 });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }
    const st = ScrollTrigger.create({
      trigger: storyRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const g = geo.current;
        const scrolled = self.scroll() - self.start;
        if (phaseRef.current === "idle" && scrolled > 24) lightFirst();
        const pp = g.pan > 0 ? Math.min(1, Math.max(0, (scrolled - g.buffer) / g.pan)) : 1;
        if (trackRef.current) gsap.set(trackRef.current, { x: -pp * g.pan });
        if (phaseRef.current === "open" && scrolled > g.buffer + g.pan + g.vh * 0.15) endStory();
      },
    });
    const onResize = () => layout();
    window.addEventListener("resize", onResize);
    // once the first frame has laid out, park the (invisible) flame on lamp 1's wick
    requestAnimationFrame(() => {
      flameState.current.follow = 0;
      applyRow();
      flameState.current.follow = -1;
    });
    return () => {
      st.kill();
      window.removeEventListener("resize", onResize);
      if (lenis) {
        gsap.ticker.remove(raf);
        lenis.destroy();
      }
    };
  }, [layout, lightFirst, endStory, applyRow]);

  const keyDown = (i: number) => (e: React.KeyboardEvent) => {
    if ((e.key === " " || e.key === "Enter") && !e.repeat) {
      e.preventDefault();
      startHold(i);
    }
  };
  const keyUp = (i: number) => (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") endHold(i);
  };

  const opened = phase !== "idle" && phase !== "holding";
  const band = LAMPS[bandLamp];

  return (
    <main>
      <section ref={storyRef} className={s.story} aria-labelledby="hero-title">
        <div ref={stageRef} className={s.stage}>
          <svg className={s.stars} width="100%" height="100%" aria-hidden="true">
            {STARS.map((st, i) => (
              <circle key={i} cx={`${st.x}%`} cy={`${st.y}%`} r={st.s} fill="#f1e6d3" opacity={st.o} />
            ))}
          </svg>

          <div ref={paintingRef} className={s.painting} data-open="false">
            <div ref={trackRef} className={s.track}>
              <PattachitraChurning />
            </div>
          </div>

          <div ref={heroRef}>
            <div className={s.ledge} aria-hidden="true" />
            <div className={s.heroCopy}>
              <h1 id="hero-title">On the darkest night, India lights lamps for many reasons. Here are six.</h1>
            </div>
            <div className={s.heroLabel}>
              <p className={`meta ${s.labelMeta}`}>Lamp 1 · {LAMPS[0].when}</p>
              <p className={s.labelTitle}>{LAMPS[0].title}</p>
              <p className={`meta ${s.labelMeta}`}>Told in {LAMPS[0].place} · drawn after {LAMPS[0].after}</p>
              <p className={`meta ${s.hint}`} id="hold-hint">Press and hold the lamp to light it</p>
            </div>
          </div>

          <div className={s.band} style={{ opacity: opened ? 1 : 0, transition: "opacity 600ms var(--ease-out)" }} aria-hidden={!opened}>
            <div>
              <p className={`meta ${s.labelMeta}`}>Lamp {band.n} · {band.when} · told in {band.place} · drawn after {band.after}</p>
              {bandLamp === 0 ? (
                <p className={s.text}>{STORY_TEXT}</p>
              ) : (
                <p className={s.text}>
                  {phase === "done" ? "Lamp 2 is lit. " : "The flame waits at lamp 2. Press and hold it to light it. "}
                  <span style={{ color: "var(--ink-soft)" }}>This proof ends here: lamp 2&apos;s story is drawn next.</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className={s.after} aria-label="What comes next">
        <div>
          <p className={`meta ${s.labelMeta}`}>Lamp 2 · {LAMPS[1].when}</p>
          <h2 className={s.labelTitle} style={{ fontSize: 30, lineHeight: "36px" }}>{LAMPS[1].title}</h2>
          <p className={`meta ${s.labelMeta}`}>Told in {LAMPS[1].place} · drawn after {LAMPS[1].after}</p>
          <p className={s.proofNote}>Hero proof for Ira. Lamp 1 shows its first panel; the full story and the other five lamps are drawn next.</p>
        </div>
      </section>

      <div ref={glowRef} className={s.glow} aria-hidden="true">
        <div className={s.glowFlicker} />
      </div>

      <nav ref={rowRef} id="lamps" className={s.row} aria-label="The six lamps">
        {LAMPS.map((l, i) => {
          const available = (i === 0 && (phase === "idle" || phase === "holding")) || (i === 1 && phase === "waiting");
          return (
            <button
              key={l.n}
              ref={(el) => { lampRefs.current[i] = el; }}
              type="button"
              className={s.lampBtn}
              aria-label={lampName(l, lit[i])}
              aria-describedby={available && i === 0 ? "hold-hint" : undefined}
              aria-disabled={!available}
              aria-current={i === bandLamp && opened ? "step" : undefined}
              onPointerDown={(e) => { e.preventDefault(); startHold(i); }}
              onPointerUp={() => endHold(i)}
              onPointerLeave={() => endHold(i)}
              onPointerCancel={() => endHold(i)}
              onContextMenu={(e) => e.preventDefault()}
              onKeyDown={keyDown(i)}
              onKeyUp={keyUp(i)}
              style={{ ["--lit" as string]: lit[i] ? 1 : 0 } as React.CSSProperties}
            >
              <Diya className={s.diya} />
              <span
                ref={(el) => { wickRefs.current[i] = el; }}
                aria-hidden="true"
                style={{ position: "absolute", left: WICK_IN_BTN.x, top: WICK_IN_BTN.y, width: 0, height: 0 }}
              />
              {available && (
                <span
                  className={s.ember}
                  aria-hidden="true"
                  style={{ left: WICK_IN_BTN.x, top: WICK_IN_BTN.y, transform: "scale(calc(1 + var(--hold, 0) * 1.6))" }}
                />
              )}
              {lit[i] && (
                <span className={s.rowFlame} aria-hidden="true" style={{ left: WICK_IN_BTN.x - 5.5, top: WICK_IN_BTN.y - 16.5 }}>
                  <StaticFlame style={{ width: "100%", height: "auto", display: "block" }} />
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <FlameCanvas ref={flameRef} width={FLAME_W} className={s.carried} style={{ position: "fixed" }} initialIntensity={0} />

      <p className="sr-only" aria-live="polite">{announce}</p>
    </main>
  );
}
