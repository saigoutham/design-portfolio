"use client";

import { useId } from "react";

// A clay diya seen from the front and a little above. Drawn once, used in the hero and the row.
// The wick tip, where a flame's base sits, is at WICK (fractions of the drawing's box).
export const WICK = { x: 113 / 120, y: 14 / 64 };

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export function Diya({ className, style }: Props) {
  // --lit (0..1) on any ancestor warms the clay from the wick side and lights the rim.
  const id = useId().replace(/:/g, "");
  const hot = "color-mix(in oklab, var(--flame-edge) calc(var(--lit, 0) * 62%), var(--clay))";
  const cool = "color-mix(in oklab, var(--flame-edge) calc(var(--lit, 0) * 12%), var(--clay-shadow))";
  return (
    <svg viewBox="0 0 120 64" className={className} style={{ overflow: "visible", ...style }} aria-hidden="true">
      <defs>
        <radialGradient id={`b${id}`} cx="0.86" cy="0.22" r="1.05">
          <stop offset="0" style={{ stopColor: hot }} />
          <stop offset="0.55" style={{ stopColor: "var(--clay)" }} />
          <stop offset="1" style={{ stopColor: cool }} />
        </radialGradient>
        <linearGradient id={`s${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.45" />
        </linearGradient>
      </defs>
      <ellipse cx="52" cy="59.5" rx="42" ry="3.4" fill="#000" opacity="0.6" />
      {/* body */}
      <path d="M4 26 C5 42 22 55 50 57 C74 58.5 92 50 99 34 L96 27 C74 35 28 36 4 26 Z" fill={`url(#b${id})`} />
      <path d="M4 26 C5 42 22 55 50 57 C74 58.5 92 50 99 34 L96 27 C74 35 28 36 4 26 Z" fill={`url(#s${id})`} />
      {/* incised band */}
      <path d="M14 38 C34 46 70 46 92 37" fill="none" style={{ stroke: cool }} strokeWidth="1" opacity="0.8" />
      <g style={{ fill: cool }}>
        <circle cx="30" cy="44" r="1.3" />
        <circle cx="42" cy="46.5" r="1.3" />
        <circle cx="54" cy="47.2" r="1.3" />
        <circle cx="66" cy="46.5" r="1.3" />
        <circle cx="78" cy="44" r="1.3" />
      </g>
      <ellipse cx="51" cy="57.6" rx="14" ry="2.4" style={{ fill: cool }} />
      {/* opening: far lip to spout, oil, near lip */}
      <path d="M4 26 C14 14 58 10 92 18 C100 19.5 108 17 117 12.5 C110 21 104 25 96 27 C74 35 28 36 4 26 Z" fill="#26140b" />
      <path d="M12 25 C28 18 70 16 92 21.5 C76 29 32 30 12 25 Z" fill="#3b2111" />
      <path d="M22 23.5 C40 20 68 20 86 22.5" stroke="var(--flame)" strokeWidth="0.9" fill="none" style={{ opacity: "calc(var(--lit, 0) * 0.6)" }} />
      {/* spout channel */}
      <path d="M95 22 C102 21 109 18 115 13.5" stroke="#000" strokeOpacity="0.35" strokeWidth="0.8" fill="none" />
      {/* rims, lit by the flame */}
      <path d="M4 26 C14 14 58 10 92 18 C100 19.5 108 17 117 12.5" fill="none" stroke="var(--flame)" strokeWidth="1.2" strokeLinecap="round" style={{ opacity: "calc(0.1 + var(--lit, 0) * 0.8)" }} />
      <path d="M4 26 C28 36 74 35 96 27 C104 25 110 21 117 12.5" fill="none" style={{ stroke: hot }} strokeWidth="1.1" strokeLinecap="round" />
      {/* wick */}
      <path d="M103 21 C107 19 110 16.5 113 14" stroke="#eadfc8" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <circle cx="113" cy="14" r="1.4" fill="#2b1a10" />
    </svg>
  );
}
