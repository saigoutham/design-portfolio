// Lamp 1, panel 1: the churning of the ocean, drawn after Odisha's Pattachitra.
// Grammar taken from the tradition: vermilion ground, unbroken soot-black line, flat mineral
// colours, nested borders, water as rows of scales, rock as stacked rounded lobes.
// Kurma (Vishnu as the tortoise) holds up Mount Mandara; the serpent Vasuki is the rope.
// The gods and asuras who pull it stand beyond the panel's edges, as the story is told.
// The lamp at the right end is the proof's stand-in for panel 3's lamp (see DESIGN.md).

export const PANEL_W = 2400;
export const PANEL_H = 1000;

const C = {
  ground: "#A8301F",
  line: "#1C1410",
  yellow: "#E3B341",
  white: "#F3EADA",
  green: "#4F7A3A",
  indigo: "#2E4A7A",
};

export function PattachitraChurning({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${PANEL_W} ${PANEL_H}`}
      className={className}
      role="img"
      aria-label="Drawn after Pattachitra: a great tortoise in a sea of white-scaled water carries a green mountain on its back; a banded serpent is wound twice around the mountain and stretches away to both edges of the picture."
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="pc-petals" width="40" height="28" patternUnits="userSpaceOnUse">
          <rect width="40" height="28" fill={C.line} />
          <path d="M2 28 Q20 -4 38 28 Z" fill={C.white} />
          <path d="M11 28 Q20 8 29 28 Z" fill={C.ground} />
        </pattern>
        <pattern id="pc-dots" width="22" height="14" patternUnits="userSpaceOnUse">
          <rect width="22" height="14" fill={C.yellow} />
          <circle cx="11" cy="7" r="3" fill={C.line} />
        </pattern>
        <pattern id="pc-creeper" width="120" height="34" patternUnits="userSpaceOnUse">
          <rect width="120" height="34" fill={C.white} />
          <path d="M0 17 C20 3 40 3 60 17 C80 31 100 31 120 17" fill="none" stroke={C.green} strokeWidth="3" />
          <path d="M30 8 C26 1 18 2 16 8 C22 10 27 10 30 8 Z" fill={C.green} stroke={C.line} strokeWidth="1.2" />
          <path d="M90 26 C94 33 102 32 104 26 C98 24 93 24 90 26 Z" fill={C.green} stroke={C.line} strokeWidth="1.2" />
          <circle cx="60" cy="17" r="4" fill={C.ground} stroke={C.line} strokeWidth="1.2" />
          <circle cx="0" cy="17" r="3" fill={C.yellow} stroke={C.line} strokeWidth="1.2" />
          <circle cx="120" cy="17" r="3" fill={C.yellow} stroke={C.line} strokeWidth="1.2" />
        </pattern>
        <pattern id="pc-water" width="64" height="32" patternUnits="userSpaceOnUse">
          <rect width="64" height="32" fill={C.indigo} />
          <path d="M0 32 A32 32 0 0 1 64 32" fill="none" stroke={C.white} strokeWidth="2.4" />
          <path d="M10 32 A22 22 0 0 1 54 32" fill="none" stroke={C.white} strokeWidth="1.6" opacity="0.8" />
          <path d="M-32 16 A32 32 0 0 1 32 16 M32 16 A32 32 0 0 1 96 16" fill="none" stroke={C.white} strokeWidth="2.4" />
        </pattern>
        <pattern id="pc-shell" width="46" height="40" patternUnits="userSpaceOnUse">
          <rect width="46" height="40" fill={C.yellow} />
          <path d="M11.5 0 L34.5 0 L46 20 L34.5 40 L11.5 40 L0 20 Z" fill={C.yellow} stroke={C.line} strokeWidth="3" />
          <circle cx="23" cy="20" r="6" fill={C.green} stroke={C.line} strokeWidth="2" />
          <circle cx="23" cy="20" r="2" fill={C.white} />
        </pattern>
        <pattern id="pc-rock" width="70" height="44" patternUnits="userSpaceOnUse">
          <rect width="70" height="44" fill={C.green} />
          <path d="M0 44 C0 22 35 22 35 44 M35 44 C35 22 70 22 70 44" fill="#5d8c45" stroke={C.line} strokeWidth="3" />
          <path d="M-35 22 C-35 0 0 0 0 22 M0 22 C0 0 35 0 35 22 M35 22 C35 0 70 0 70 22" fill="#5d8c45" stroke={C.line} strokeWidth="3" />
          <path d="M8 40 C10 32 20 30 26 34 M43 40 C45 32 55 30 61 34 M-27 18 C-25 10 -15 8 -9 12 M26 18 C28 10 38 8 44 12" fill="none" stroke={C.yellow} strokeWidth="2.2" />
        </pattern>
        <pattern id="pc-rosette" width="220" height="180" patternUnits="userSpaceOnUse">
          <g fill={C.white} opacity="0.85">
            <circle cx="40" cy="40" r="4" />
            <circle cx="52" cy="40" r="2.4" />
            <circle cx="28" cy="40" r="2.4" />
            <circle cx="40" cy="28" r="2.4" />
            <circle cx="40" cy="52" r="2.4" />
            <circle cx="150" cy="120" r="4" />
            <circle cx="162" cy="120" r="2.4" />
            <circle cx="138" cy="120" r="2.4" />
            <circle cx="150" cy="108" r="2.4" />
            <circle cx="150" cy="132" r="2.4" />
          </g>
        </pattern>
        <clipPath id="pc-inner">
          <rect x="96" y="96" width={PANEL_W - 192} height={PANEL_H - 192} />
        </clipPath>
      </defs>

      {/* nested borders */}
      <rect width={PANEL_W} height={PANEL_H} fill="url(#pc-petals)" />
      <rect x="28" y="28" width={PANEL_W - 56} height={PANEL_H - 56} fill="url(#pc-dots)" />
      <rect x="42" y="42" width={PANEL_W - 84} height={PANEL_H - 84} fill={C.line} />
      <rect x="46" y="46" width={PANEL_W - 92} height={PANEL_H - 92} fill="url(#pc-creeper)" />
      <rect x="92" y="92" width={PANEL_W - 184} height={PANEL_H - 184} fill={C.line} />

      <g clipPath="url(#pc-inner)">
        {/* sky */}
        <rect x="96" y="96" width={PANEL_W - 192} height={PANEL_H - 192} fill={C.ground} />
        <rect x="96" y="96" width={PANEL_W - 192} height="460" fill="url(#pc-rosette)" />
        {/* scalloped clouds */}
        <g fill="none" stroke={C.white} strokeWidth="3" opacity="0.9">
          <path d="M240 200 q24 -30 48 0 q24 -30 48 0 q24 -30 48 0" />
          <path d="M1760 170 q24 -30 48 0 q24 -30 48 0 q24 -30 48 0 q24 -30 48 0" />
          <path d="M620 140 q20 -24 40 0 q20 -24 40 0" />
        </g>

        {/* the sea */}
        <path d="M96 600 C400 580 700 610 1000 596 C1300 582 1700 610 2000 594 C2150 588 2250 596 2304 600 L2304 904 L96 904 Z" fill="url(#pc-water)" />
        <path d="M96 600 C400 580 700 610 1000 596 C1300 582 1700 610 2000 594 C2150 588 2250 596 2304 600" fill="none" stroke={C.line} strokeWidth="5" />

        {/* fish */}
        {[
          [360, 760, 1],
          [610, 840, -1],
          [1760, 780, 1],
          [2020, 860, -1],
          [880, 870, 1],
        ].map(([x, y, dir], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${dir} 1)`}>
            <path d="M-46 0 C-20 -26 26 -24 44 0 C26 24 -20 26 -46 0 Z" fill={C.white} stroke={C.line} strokeWidth="3" />
            <path d="M44 0 L70 -20 L64 0 L70 20 Z" fill={C.yellow} stroke={C.line} strokeWidth="3" />
            <path d="M-10 -14 C0 -4 0 4 -10 14" fill="none" stroke={C.line} strokeWidth="2" />
            <circle cx="-28" cy="-4" r="5" fill={C.line} />
            <circle cx="-26" cy="-6" r="1.5" fill={C.white} />
          </g>
        ))}

        {/* Kurma */}
        <g>
          <path d="M1450 730 C1490 712 1540 714 1560 736 C1546 760 1496 762 1452 748 Z" fill={C.yellow} stroke={C.line} strokeWidth="4" />
          <circle cx="1528" cy="730" r="7" fill={C.white} stroke={C.line} strokeWidth="3" />
          <circle cx="1530" cy="730" r="3" fill={C.line} />
          <path d="M990 770 C960 800 930 810 900 806 C920 780 950 764 990 756 Z" fill={C.yellow} stroke={C.line} strokeWidth="4" />
          <path d="M1060 800 C1050 836 1030 856 1004 864 C1010 836 1028 812 1058 790 Z" fill={C.yellow} stroke={C.line} strokeWidth="4" />
          <path d="M1360 800 C1372 836 1394 856 1420 864 C1414 836 1396 812 1366 790 Z" fill={C.yellow} stroke={C.line} strokeWidth="4" />
          <ellipse cx="1210" cy="726" rx="270" ry="112" fill="url(#pc-shell)" stroke={C.line} strokeWidth="6" />
          <ellipse cx="1210" cy="726" rx="270" ry="112" fill="none" stroke={C.green} strokeWidth="14" opacity="0.9" />
          <ellipse cx="1210" cy="726" rx="270" ry="112" fill="none" stroke={C.line} strokeWidth="5" />
          <ellipse cx="1210" cy="726" rx="252" ry="96" fill="none" stroke={C.line} strokeWidth="3" />
        </g>

        {/* Mount Mandara */}
        <path d="M1000 668 C1020 520 1060 330 1100 190 C1150 160 1270 160 1320 190 C1360 330 1400 520 1420 668 C1300 690 1120 690 1000 668 Z" fill="url(#pc-rock)" stroke={C.line} strokeWidth="6" />
        {/* trees on the summit */}
        {[1130, 1190, 1250, 1300].map((x, i) => (
          <g key={x} transform={`translate(${x} ${178 - (i % 2) * 8})`}>
            <path d="M0 0 L0 -44" stroke={C.line} strokeWidth="5" />
            <path d="M0 -40 C-30 -50 -30 -86 0 -96 C30 -86 30 -50 0 -40 Z" fill={C.green} stroke={C.line} strokeWidth="4" />
            <path d="M0 -50 C-12 -60 -12 -78 0 -86 C12 -78 12 -60 0 -50 Z" fill={C.yellow} />
          </g>
        ))}

        {/* Vasuki: head end runs off to the left, tail to the right, two turns in front of the mountain */}
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          {[
            "M96 470 C300 440 600 520 820 540 C900 548 960 560 1004 566",
            "M1004 566 C1120 560 1300 520 1416 486",
            "M1010 416 C1120 410 1300 376 1410 338",
            "M1410 338 C1600 300 1800 350 1960 362 C2100 372 2230 330 2304 318",
          ].map((d, i) => (
            <g key={i}>
              <path d={d} stroke={C.line} strokeWidth="66" />
              <path d={d} stroke={C.green} strokeWidth="56" />
              <path d={d} stroke={C.yellow} strokeWidth="56" strokeDasharray="26 34" strokeLinecap="butt" />
              <path d={d} stroke={C.line} strokeWidth="56" strokeDasharray="3 57" strokeDashoffset="-26" strokeLinecap="butt" />
              <path d={d} stroke={C.line} strokeWidth="56" strokeDasharray="3 57" strokeDashoffset="1" strokeLinecap="butt" />
              <path d={d} stroke={C.white} strokeWidth="7" strokeDasharray="2 13" strokeLinecap="butt" />
            </g>
          ))}
        </g>

        {/* Vasuki's five-hooded head at the left, held by the asuras beyond the frame */}
        <g transform="translate(250 452)">
          <path d="M-30 34 C-38 -10 -26 -50 0 -62 C26 -50 38 -10 30 34 Z" fill={C.green} stroke={C.line} strokeWidth="5" />
          <path d="M0 -50 L0 30" stroke={C.yellow} strokeWidth="8" strokeDasharray="8 10" />
          <path d="M-84 -10 C-80 -70 -40 -116 0 -120 C40 -116 80 -70 84 -10 C60 -40 30 -56 0 -58 C-30 -56 -60 -40 -84 -10 Z" fill={C.green} stroke={C.line} strokeWidth="5" />
          <g transform="translate(-97.8 -72.0) rotate(-56)">
            <path d="M0 -26 C14 -26 20 -10 18 6 C16 20 8 28 0 30 C-8 28 -16 20 -18 6 C-20 -10 -14 -26 0 -26 Z" fill={C.green} stroke={C.line} strokeWidth="4" />
            <path d="M0 -14 C6 -14 8 -4 7 6 C6 14 3 18 0 19 C-3 18 -6 14 -7 6 C-8 -4 -6 -14 0 -14 Z" fill={C.yellow} />
            <circle cx="-9" cy="-10" r="3" fill={C.white} stroke={C.line} strokeWidth="1.5" />
            <circle cx="9" cy="-10" r="3" fill={C.white} stroke={C.line} strokeWidth="1.5" />
          </g>
          <g transform="translate(-55.4 -110.2) rotate(-28)">
            <path d="M0 -26 C14 -26 20 -10 18 6 C16 20 8 28 0 30 C-8 28 -16 20 -18 6 C-20 -10 -14 -26 0 -26 Z" fill={C.green} stroke={C.line} strokeWidth="4" />
            <path d="M0 -14 C6 -14 8 -4 7 6 C6 14 3 18 0 19 C-3 18 -6 14 -7 6 C-8 -4 -6 -14 0 -14 Z" fill={C.yellow} />
            <circle cx="-9" cy="-10" r="3" fill={C.white} stroke={C.line} strokeWidth="1.5" />
            <circle cx="9" cy="-10" r="3" fill={C.white} stroke={C.line} strokeWidth="1.5" />
          </g>
          <g transform="translate(0.0 -124.0) rotate(0)">
            <path d="M0 -26 C14 -26 20 -10 18 6 C16 20 8 28 0 30 C-8 28 -16 20 -18 6 C-20 -10 -14 -26 0 -26 Z" fill={C.green} stroke={C.line} strokeWidth="4" />
            <path d="M0 -14 C6 -14 8 -4 7 6 C6 14 3 18 0 19 C-3 18 -6 14 -7 6 C-8 -4 -6 -14 0 -14 Z" fill={C.yellow} />
            <circle cx="-9" cy="-10" r="3" fill={C.white} stroke={C.line} strokeWidth="1.5" />
            <circle cx="9" cy="-10" r="3" fill={C.white} stroke={C.line} strokeWidth="1.5" />
            <path d="M0 -26 L0 -44 M0 -44 L-7 -54 M0 -44 L7 -54" stroke={C.ground} strokeWidth="3.5" fill="none" />
          </g>
          <g transform="translate(55.4 -110.2) rotate(28)">
            <path d="M0 -26 C14 -26 20 -10 18 6 C16 20 8 28 0 30 C-8 28 -16 20 -18 6 C-20 -10 -14 -26 0 -26 Z" fill={C.green} stroke={C.line} strokeWidth="4" />
            <path d="M0 -14 C6 -14 8 -4 7 6 C6 14 3 18 0 19 C-3 18 -6 14 -7 6 C-8 -4 -6 -14 0 -14 Z" fill={C.yellow} />
            <circle cx="-9" cy="-10" r="3" fill={C.white} stroke={C.line} strokeWidth="1.5" />
            <circle cx="9" cy="-10" r="3" fill={C.white} stroke={C.line} strokeWidth="1.5" />
          </g>
          <g transform="translate(97.8 -72.0) rotate(56)">
            <path d="M0 -26 C14 -26 20 -10 18 6 C16 20 8 28 0 30 C-8 28 -16 20 -18 6 C-20 -10 -14 -26 0 -26 Z" fill={C.green} stroke={C.line} strokeWidth="4" />
            <path d="M0 -14 C6 -14 8 -4 7 6 C6 14 3 18 0 19 C-3 18 -6 14 -7 6 C-8 -4 -6 -14 0 -14 Z" fill={C.yellow} />
            <circle cx="-9" cy="-10" r="3" fill={C.white} stroke={C.line} strokeWidth="1.5" />
            <circle cx="9" cy="-10" r="3" fill={C.white} stroke={C.line} strokeWidth="1.5" />
          </g>
        </g>

        {/* the lamp at the end (proof stand-in for panel 3) */}
        <g transform="translate(2170 600)">
          <path d="M-60 0 C-60 -10 60 -10 60 0 C60 14 -60 14 -60 0 Z" fill={C.yellow} stroke={C.line} strokeWidth="5" />
          <path d="M-10 0 L-16 -150 L16 -150 L10 0 Z" fill={C.yellow} stroke={C.line} strokeWidth="5" />
          <path d="M-22 -96 C-22 -110 22 -110 22 -96 C22 -84 -22 -84 -22 -96 Z" fill={C.white} stroke={C.line} strokeWidth="4" />
          <path d="M-70 -160 C-50 -186 50 -186 70 -160 C56 -146 -56 -146 -70 -160 Z" fill={C.yellow} stroke={C.line} strokeWidth="5" />
          <path d="M70 -160 C84 -170 94 -176 102 -184 C96 -170 86 -160 70 -156" fill={C.yellow} stroke={C.line} strokeWidth="4" />
          <path d="M-40 -164 C-20 -170 20 -170 40 -164" stroke={C.ground} strokeWidth="4" fill="none" />
          <circle data-wick="lamp1-end" cx="102" cy="-186" r="3" fill={C.line} />
        </g>
      </g>
    </svg>
  );
}
