"use client";

import { useId } from "react";

// SVG flame: the row's small lit flames, the no-WebGL fallback, and reduced motion.
// Same three colours as the shader flame so the two read as one fire.
type Props = { className?: string; animate?: boolean; style?: React.CSSProperties };

export function StaticFlame({ className, animate = true, style }: Props) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 40 64"
      className={className}
      style={{
        overflow: "visible",
        transformOrigin: "50% 92%",
        animation: animate ? "flicker 1.9s var(--ease-out) infinite" : undefined,
        ...style,
      }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`o${id}`} cx="50%" cy="74%" r="78%">
          <stop offset="0" stopColor="var(--flame)" />
          <stop offset="0.55" stopColor="var(--flame)" />
          <stop offset="0.85" stopColor="var(--flame-edge)" />
          <stop offset="1" stopColor="var(--flame-edge)" stopOpacity="0.5" />
        </radialGradient>
        <radialGradient id={`c${id}`} cx="50%" cy="80%" r="55%">
          <stop offset="0" stopColor="var(--flame-core)" />
          <stop offset="1" stopColor="var(--flame)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M20 1 C23 14 34 28 34 44 C34 55 28 62 20 62 C12 62 6 55 6 44 C6 28 17 14 20 1 Z" fill={`url(#o${id})`} />
      <path d="M20 26 C23 35 27 41 27 48 C27 54 24 58 20 58 C16 58 13 54 13 48 C13 41 17 35 20 26 Z" fill={`url(#c${id})`} />
    </svg>
  );
}
