import { useId } from "react";
import { builders, metalPalette, stoneHex, type BuilderKind, type DesignState } from "@/utils/customizer";

type Pal = { base: string; light: string; dark: string };

function Defs({ id, pal, stone, matte }: { id: string; pal: Pal; stone: string; matte?: boolean }) {
  const isWhite = pal.base.toLowerCase() === "#c9ccd1" || pal.base.toLowerCase() === "#e3e4e8" || pal.base.toLowerCase() === "#ffffff";
  const isRose = pal.base.toLowerCase() === "#d99a86" || pal.base.toLowerCase() === "#e6a596";

  const specWhite = isWhite ? "#ffffff" : isRose ? "#fff2ec" : "#fffde3";
  const coreHighlight = isWhite ? "#f2f4f7" : isRose ? "#fcd4c7" : "#fae298";
  const coreBase = pal.base;
  const coreDeep = isWhite ? "#6d7480" : isRose ? "#874332" : "#6e4a06";

  return (
    <defs>
      {/* Photorealistic Multi-Stop Metallic Gradient */}
      <linearGradient id={`${id}-m`} gradientUnits="userSpaceOnUse" x1="50" y1="30" x2="350" y2="370">
        <stop offset="0%" stopColor={coreHighlight} />
        <stop offset="18%" stopColor={specWhite} />
        <stop offset="32%" stopColor={coreHighlight} />
        <stop offset="55%" stopColor={coreBase} />
        <stop offset="78%" stopColor={coreDeep} />
        <stop offset="92%" stopColor={coreHighlight} />
        <stop offset="100%" stopColor={coreBase} />
      </linearGradient>

      {/* Radial Metallic Highlight for Beads & Domes */}
      <radialGradient id={`${id}-m-rad`} cx="38%" cy="32%" r="68%">
        <stop offset="0%" stopColor={specWhite} />
        <stop offset="35%" stopColor={coreHighlight} />
        <stop offset="70%" stopColor={coreBase} />
        <stop offset="100%" stopColor={coreDeep} />
      </radialGradient>

      {/* Faceted Gemstone Primary Radial Gradient */}
      <radialGradient id={`${id}-s`} cx="32%" cy="28%" r="72%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="24%" stopColor={stone} stopOpacity="0.9" />
        <stop offset="68%" stopColor={stone} />
        <stop offset="100%" stopColor="#0a0508" stopOpacity="0.85" />
      </radialGradient>

      {/* Internal Diamond / Gemstone Facet Shimmer */}
      <linearGradient id={`${id}-gem-facet`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
        <stop offset="50%" stopColor="rgba(255,255,255,0.05)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
      </linearGradient>

      {/* Natural Iridescent Pearl */}
      <radialGradient id={`${id}-p`} cx="34%" cy="28%" r="70%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="30%" stopColor="#fffcf5" />
        <stop offset="65%" stopColor="#ede3d1" />
        <stop offset="90%" stopColor="#cfbe9f" />
        <stop offset="100%" stopColor="#877759" />
      </radialGradient>

      {/* Luxury Jewelry Pedestal Background */}
      <radialGradient id={`${id}-bg`} cx="50%" cy="44%" r="65%">
        <stop offset="0%" stopColor="#fffcf6" />
        <stop offset="55%" stopColor="#f4ebdc" />
        <stop offset="85%" stopColor="#e3d4bd" />
        <stop offset="100%" stopColor="#cfbe9f" />
      </radialGradient>

      {/* Deep Soft Ambient Shadow */}
      <filter id={`${id}-sh`} x="-30%" y="-30%" width="160%" height="170%">
        <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#3d141e" floodOpacity="0.28" />
      </filter>

      {/* Tight Drop Shadow for Stones and Charms */}
      <filter id={`${id}-sh-sm`} x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#260810" floodOpacity="0.32" />
      </filter>

      {/* Sparkle Glint Glow */}
      <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

// 4-point Radiant Star Sparkle
function Sparkle({ x, y, size = 10, opacity = 0.95 }: { x: number; y: number; size?: number; opacity?: number }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity} pointerEvents="none">
      <path
        d={`M0 ${-size} Q0 0 ${size} 0 Q0 0 0 ${size} Q0 0 ${-size} 0 Q0 0 0 ${-size}`}
        fill="#ffffff"
      />
      <circle r={size * 0.22} fill="#ffffff" />
      <circle r={size * 0.55} fill="#fff9d6" opacity={0.65} />
    </g>
  );
}

// Faceted Gemstone Renderer with Realistic Light Dispersion and Table
const Stone = ({ shape, r, id, stroke }: { shape: string; r: number; id: string; stroke: string }) => {
  const f = `url(#${id}-s)`;
  const facetFill = `url(#${id}-gem-facet)`;

  switch (shape) {
    case "Princess": {
      const w = r * 1.6;
      const hw = w / 2;
      const tw = w * 0.52;
      const htw = tw / 2;
      return (
        <g filter={`url(#${id}-sh-sm)`}>
          <rect x={-hw} y={-hw} width={w} height={w} fill={f} stroke={stroke} strokeWidth="1.2" rx="1.5" />
          {/* 4 Corner facet triangles */}
          <polygon points={`0,0 ${-hw},${-hw} ${hw},${-hw}`} fill={facetFill} opacity="0.8" />
          <polygon points={`0,0 ${hw},${-hw} ${hw},${hw}`} fill={facetFill} opacity="0.6" />
          <polygon points={`0,0 ${hw},${hw} ${-hw},${hw}`} fill={facetFill} opacity="0.85" />
          <polygon points={`0,0 ${-hw},${hw} ${-hw},${-hw}`} fill={facetFill} opacity="0.5" />
          {/* Central Table */}
          <rect x={-htw} y={-htw} width={tw} height={tw} fill="rgba(255,255,255,0.22)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" />
          <Sparkle x={-hw * 0.7} y={-hw * 0.7} size={r * 0.3} />
        </g>
      );
    }

    case "Emerald": {
      const w = r * 1.4;
      const h = r * 1.9;
      const c = r * 0.32;
      return (
        <g filter={`url(#${id}-sh-sm)`}>
          <polygon
            points={`${-w / 2 + c},${-h / 2} ${w / 2 - c},${-h / 2} ${w / 2},${-h / 2 + c} ${w / 2},${h / 2 - c} ${w / 2 - c},${h / 2} ${-w / 2 + c},${h / 2} ${-w / 2},${h / 2 - c} ${-w / 2},${-h / 2 + c}`}
            fill={f}
            stroke={stroke}
            strokeWidth="1.2"
          />
          {/* Stepped inner octagonal facets */}
          <polygon
            points={`${-w / 2 * 0.65 + c * 0.7},${-h / 2 * 0.65} ${w / 2 * 0.65 - c * 0.7},${-h / 2 * 0.65} ${w / 2 * 0.65},${-h / 2 * 0.65 + c * 0.7} ${w / 2 * 0.65},${h / 2 * 0.65 - c * 0.7} ${w / 2 * 0.65 - c * 0.7},${h / 2 * 0.65} ${-w / 2 * 0.65 + c * 0.7},${h / 2 * 0.65} ${-w / 2 * 0.65},${h / 2 * 0.65 - c * 0.7} ${-w / 2 * 0.65},${-h / 2 * 0.65 + c * 0.7}`}
            fill="rgba(255,255,255,0.2)"
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="0.8"
          />
          <line x1={-w / 2} y1={-h / 2 + c} x2={-w / 2 * 0.65} y2={-h / 2 * 0.65 + c * 0.7} stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />
          <line x1={w / 2} y1={-h / 2 + c} x2={w / 2 * 0.65} y2={-h / 2 * 0.65 + c * 0.7} stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />
          <Sparkle x={-w * 0.28} y={-h * 0.3} size={r * 0.32} />
        </g>
      );
    }

    case "Oval": {
      return (
        <g filter={`url(#${id}-sh-sm)`}>
          <ellipse rx={r * 0.85} ry={r * 1.15} fill={f} stroke={stroke} strokeWidth="1.2" />
          <ellipse rx={r * 0.44} ry={r * 0.65} fill="rgba(255,255,255,0.24)" stroke="rgba(255,255,255,0.65)" strokeWidth="0.8" />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={Math.cos(a) * r * 0.44}
                y1={Math.sin(a) * r * 0.65}
                x2={Math.cos(a) * r * 0.85}
                y2={Math.sin(a) * r * 1.15}
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="0.8"
              />
            );
          })}
          <Sparkle x={-r * 0.3} y={-r * 0.4} size={r * 0.3} />
        </g>
      );
    }

    case "Pear": {
      return (
        <g filter={`url(#${id}-sh-sm)`}>
          <path
            d={`M0 ${-r * 1.25} C${r * 0.4} ${-r * 0.55} ${r * 0.95} ${-r * 0.05} ${r * 0.88} ${r * 0.48} C${r * 0.78} ${r * 1.05} ${r * 0.25} ${r * 1.08} 0 ${r * 1.08} C${-r * 0.25} ${r * 1.08} ${-r * 0.78} ${r * 1.05} ${-r * 0.88} ${r * 0.48} C${-r * 0.95} ${-r * 0.05} ${-r * 0.4} ${-r * 0.55} 0 ${-r * 1.25}Z`}
            fill={f}
            stroke={stroke}
            strokeWidth="1.2"
          />
          <path
            d={`M0 ${-r * 0.75} L${r * 0.4} ${r * 0.12} L0 ${r * 0.68} L${-r * 0.4} ${r * 0.12} Z`}
            fill="rgba(255,255,255,0.25)"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="0.8"
          />
          <Sparkle x={0} y={-r * 0.75} size={r * 0.32} />
        </g>
      );
    }

    case "Cushion": {
      const w = r * 1.7;
      const hw = w / 2;
      return (
        <g filter={`url(#${id}-sh-sm)`}>
          <rect x={-hw} y={-hw} width={w} height={w} rx={r * 0.42} fill={f} stroke={stroke} strokeWidth="1.2" />
          <rect x={-hw * 0.55} y={-hw * 0.55} width={w * 0.55} height={w * 0.55} rx={r * 0.22} fill="rgba(255,255,255,0.22)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" />
          <Sparkle x={-hw * 0.4} y={-hw * 0.4} size={r * 0.3} />
        </g>
      );
    }

    default: {
      // Brilliant Round Cut with 8 star facets & table
      const pts = Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4 + Math.PI / 8;
        return `${(Math.cos(a) * r * 0.52).toFixed(1)},${(Math.sin(a) * r * 0.52).toFixed(1)}`;
      }).join(" ");

      return (
        <g filter={`url(#${id}-sh-sm)`}>
          <circle r={r} fill={f} stroke={stroke} strokeWidth="1.2" />
          <polygon points={pts} fill="rgba(255,255,255,0.26)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4 + Math.PI / 8;
            return (
              <line
                key={i}
                x1={Math.cos(a) * r * 0.52}
                y1={Math.sin(a) * r * 0.52}
                x2={Math.cos(a) * r}
                y2={Math.sin(a) * r}
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="0.8"
              />
            );
          })}
          <Sparkle x={-r * 0.35} y={-r * 0.35} size={r * 0.32} />
        </g>
      );
    }
  }
};

// 2D Realistic Ring Artwork
function RingSVG({ s, id, pal }: { s: DesignState; id: string; pal: Pal }) {
  const type = String(s.ringType || "Solitaire");
  const stoneOn = s.stone !== "None" && type !== "Signet";
  const base = type === "Cocktail" ? 44 : type === "Eternity" ? 0 : 34;
  const sc = 0.9 + ((Number(s.size || 14) - 8) / 16) * 0.18;
  const bandW = type === "Signet" ? 24 : type === "Eternity" ? 18 : type === "Cocktail" ? 13 : 11;
  const sy = 114;
  const eng = String(s.engraving || "");

  return (
    <g transform={`translate(200 215) scale(${sc}) translate(-200 -215)`} filter={`url(#${id}-sh)`}>
      {/* Outer Polished Shank Band */}
      <ellipse cx="200" cy="255" rx="104" ry="110" fill="none" stroke={`url(#${id}-m)`} strokeWidth={bandW} />

      {/* Realistic Bevel / Specular Highlight Ring */}
      <ellipse cx="200" cy="255" rx={104 - bandW / 2 + 1} ry={110 - bandW / 2 + 1} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" />
      <ellipse cx="200" cy="255" rx={104 + bandW / 2 - 1.5} ry={110 + bandW / 2 - 1.5} fill="none" stroke={pal.dark} strokeWidth="0.8" opacity="0.6" />

      {/* Eternity Band: 26 channel-set diamonds around the circle */}
      {type === "Eternity" &&
        Array.from({ length: 26 }, (_, i) => {
          const a = (i / 26) * Math.PI * 2;
          const x = 200 + 104 * Math.cos(a);
          const y = 255 + 110 * Math.sin(a);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="5.5" fill={`url(#${id}-s)`} stroke={pal.dark} strokeWidth="0.6" />
              <circle cx={x - 1.2} cy={y - 1.2} r="1.5" fill="#fff" opacity="0.8" />
            </g>
          );
        })}

      {/* Solitaire / Three-Stone / Halo Prong Basket Gallery */}
      {type !== "Eternity" && type !== "Signet" && (
        <g>
          {/* Gallery Basket Bridge Arches */}
          <path d="M182 154 L193 126 M218 154 L207 126" stroke={`url(#${id}-m)`} strokeWidth="7" strokeLinecap="round" />
          <path d="M174 142 L168 116 M226 142 L232 116" stroke={`url(#${id}-m)`} strokeWidth="5.5" strokeLinecap="round" />
          <path d="M182 154 L193 126 M218 154 L207 126" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
        </g>
      )}

      {/* Signet Ring Bezel Plate */}
      {type === "Signet" && (
        <g>
          <rect x="146" y="100" width="108" height="72" rx="16" fill={`url(#${id}-m)`} stroke={pal.dark} strokeWidth="1.6" />
          <rect x="154" y="108" width="92" height="56" rx="11" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
          <text
            x="200"
            y="148"
            textAnchor="middle"
            fontFamily="Cormorant Garamond, serif"
            fontWeight="700"
            fontSize="36"
            fill={pal.dark}
            letterSpacing="3"
          >
            {(eng.replace(/[^A-Za-z]/g, "").slice(0, 2) || "SH").toUpperCase()}
          </text>
        </g>
      )}

      {/* Halo Setting: 18 Micro-Pavé Diamonds encircling the main stone */}
      {type === "Halo" &&
        stoneOn &&
        Array.from({ length: 18 }, (_, i) => {
          const a = (i / 18) * Math.PI * 2;
          const hr = base + 13;
          const hx = 200 + hr * Math.cos(a);
          const hy = sy + hr * Math.sin(a);
          return (
            <g key={i}>
              <circle cx={hx} cy={hy} r="4.6" fill={`url(#${id}-s)`} stroke={pal.dark} strokeWidth="0.6" />
              <circle cx={hx - 1} cy={hy - 1} r="1.2" fill="#ffffff" opacity="0.85" />
            </g>
          );
        })}

      {/* Three-Stone Setting: 2 Balanced Side Gems */}
      {type === "Three-Stone" && stoneOn && (
        <>
          <g transform={`translate(${200 - base - 25} ${sy + 22})`}>
            <Stone shape={String(s.shape)} r={base * 0.58} id={id} stroke={pal.dark} />
          </g>
          <g transform={`translate(${200 + base + 25} ${sy + 22})`}>
            <Stone shape={String(s.shape)} r={base * 0.58} id={id} stroke={pal.dark} />
          </g>
        </>
      )}

      {/* Main Center Gemstone */}
      {stoneOn && type !== "Eternity" && (
        <g transform={`translate(200 ${sy})`}>
          <Stone shape={String(s.shape)} r={base} id={id} stroke={pal.dark} />
        </g>
      )}

      {/* 4 Overlapping Claw Prongs on Center Stone */}
      {stoneOn && type !== "Eternity" && (
        <g transform={`translate(200 ${sy})`} pointerEvents="none">
          {[-0.7, 0.7].map((px) =>
            [-0.7, 0.7].map((py) => (
              <circle key={`${px}-${py}`} cx={px * base * 0.78} cy={py * base * 0.78} r="3.4" fill={`url(#${id}-m-rad)`} stroke={pal.dark} strokeWidth="0.6" />
            ))
          )}
        </g>
      )}

      {/* Inside Band Engraving Path */}
      <defs>
        <path id={`${id}-eng`} d="M 126 300 A 78 84 0 0 0 274 300" />
      </defs>
      {eng && (
        <text fontSize="12" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fill={pal.dark} letterSpacing="2" opacity="0.9">
          <textPath href={`#${id}-eng`} startOffset="50%" textAnchor="middle">
            {eng}
          </textPath>
        </text>
      )}
      <text x="200" y="392" textAnchor="middle" fontSize="10" fill={pal.dark} letterSpacing="3" fontFamily="Inter, sans-serif" opacity="0.8">
        {eng ? "• ENGRAVED INSIDE BAND •" : ""}
      </text>

      {/* Metallic Luster Glint */}
      <Sparkle x={280} y={245} size={11} opacity={0.8} />
    </g>
  );
}

// 2D Realistic Necklace Artwork
function NecklaceSVG({ s, id, pal }: { s: DesignState; id: string; pal: Pal }) {
  const type = String(s.type);
  const len = Number(s.length || 18);
  let d = type === "Choker" ? 48 : 42 + (len - 14) * 14;
  if (type === "Rani Haar") d = Math.max(d, 175);
  const mid = 14 + d;
  const name = String(s.name || "");
  const pend = type === "Mangalsutra" && s.pendant === "None" ? "Solitaire Drop" : String(s.pendant);

  return (
    <g filter={`url(#${id}-sh)`}>
      {/* Luxury Display Bust Silhouette with Soft Velvet Shadow */}
      <path d="M140 0 C140 90 130 130 60 170 L0 195 V420 H400 V195 L340 170 C270 130 260 90 260 0Z" fill="#e8d8be" />
      <path d="M140 0 C140 90 130 130 60 170" fill="none" stroke="#d4c09e" strokeWidth="2.5" />
      <path d="M260 0 C260 90 270 130 340 170" fill="none" stroke="#d4c09e" strokeWidth="2.5" />

      {/* Chain Styles */}
      {type === "Rani Haar" ? (
        <>
          <path d={`M150 12 Q200 ${12 + d * 2} 250 12`} fill="none" stroke={`url(#${id}-m)`} strokeWidth="6" strokeLinecap="round" />
          <path d={`M150 12 Q200 ${12 + d * 1.45} 250 12`} fill="none" stroke={`url(#${id}-m)`} strokeWidth="5" strokeLinecap="round" />
          <path d={`M150 12 Q200 ${12 + d * 0.9} 250 12`} fill="none" stroke={`url(#${id}-m)`} strokeWidth="4.5" strokeLinecap="round" />
        </>
      ) : type === "Mangalsutra" ? (
        <>
          <path d={`M150 12 Q200 ${12 + d * 2} 250 12`} fill="none" stroke={`url(#${id}-m)`} strokeWidth="3" />
          <path d={`M150 12 Q200 ${12 + d * 2} 250 12`} fill="none" stroke="#161616" strokeWidth="6.5" strokeDasharray="0.1 11" strokeLinecap="round" />
        </>
      ) : (
        <path d={`M150 12 Q200 ${12 + d * 2} 250 12`} fill="none" stroke={`url(#${id}-m)`} strokeWidth="4.5" strokeLinecap="round" />
      )}

      {/* Pendant Motif */}
      {pend !== "None" && (
        <g transform={`translate(200 ${type === "Rani Haar" ? mid + 12 : mid + 20})`}>
          {/* Bail loop */}
          <circle cx="0" cy="-28" r="5" fill="none" stroke={`url(#${id}-m)`} strokeWidth="3.5" />
          {pend === "Heart" ? (
            <g>
              <path d="M0 32 C-32 6 -28 -20 -11 -20 C-4 -20 0 -14 0 -10 C0 -14 4 -20 11 -20 C28 -20 32 6 0 32 Z" fill={`url(#${id}-m)`} stroke={pal.dark} strokeWidth="1.5" />
              <circle cy="-1" r="8" fill={`url(#${id}-s)`} stroke={pal.dark} strokeWidth="1" />
              <Sparkle x={10} y={-8} size={9} />
            </g>
          ) : pend === "Lotus" ? (
            <g>
              {[-60, -30, 0, 30, 60].map((a) => (
                <ellipse key={a} cx="0" cy="-16" rx="9" ry="22" fill={`url(#${id}-m)`} stroke={pal.dark} strokeWidth="1" transform={`rotate(${a} 0 6) translate(0 6)`} />
              ))}
              <circle cy="2" r="8" fill={`url(#${id}-s)`} stroke={pal.dark} />
              <Sparkle x={0} y={2} size={10} />
            </g>
          ) : pend === "Om" ? (
            <g>
              <circle r="26" fill={`url(#${id}-m)`} stroke={pal.dark} strokeWidth="1.5" />
              <circle r="22" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
              <text y="12" textAnchor="middle" fontSize="34" fill={pal.dark} fontFamily="serif">
                ॐ
              </text>
            </g>
          ) : pend === "Initial Disc" ? (
            <g>
              <circle r="24" fill={`url(#${id}-m)`} stroke={pal.dark} strokeWidth="1.5" />
              <circle r="19" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
              <text y="11" textAnchor="middle" fontSize="28" fontWeight="700" fill={pal.dark} fontFamily="Cormorant Garamond, serif">
                {(s.initial || name[0] || "S").toString().toUpperCase()}
              </text>
            </g>
          ) : (
            /* Solitaire Drop */
            <g>
              <path d="M0 -26 C 24 4 28 24 0 38 C -28 24 -24 4 0 -26Z" fill={`url(#${id}-s)`} stroke={pal.dark} strokeWidth="1.5" />
              <path d="M0 -24 L-10 12 L0 30 L10 12Z" fill="rgba(255,255,255,0.3)" />
              <Sparkle x={-4} y={-4} size={12} />
            </g>
          )}
        </g>
      )}

      {name && (
        <text x="200" y={mid + 74} textAnchor="middle" fontFamily="Pinyon Script, cursive" fontSize="28" fill={pal.dark}>
          {name}
        </text>
      )}
    </g>
  );
}

// 2D Realistic Jhumka Artwork
function JhumkaSVG({ s, id, pal }: { s: DesignState; id: string; pal: Pal }) {
  const k = ({ Small: 0.85, Medium: 1, Large: 1.2, Statement: 1.4 }[String(s.dome)] ?? 1) * 1.05;
  const pearls = Number(s.pearls || 3);
  const stoneOn = s.stoneColor !== "None";

  const Ear = ({ cx, flip }: { cx: number; flip: number }) => {
    const w = 34 * k;
    const h = 58 * k;
    const y1 = 76;
    const bottom = y1 + h;

    return (
      <g transform={`translate(${cx} 0)`}>
        {/* Stud Top */}
        <circle cy="34" r={12 * k} fill={`url(#${id}-m-rad)`} stroke={pal.dark} strokeWidth="1.2" />
        {stoneOn && <circle cy="34" r={7 * k} fill={`url(#${id}-s)`} stroke={pal.dark} strokeWidth="0.8" />}

        {/* Connector Link */}
        <line x1="0" y1="46" x2="0" y2={y1} stroke={`url(#${id}-m)`} strokeWidth="3" />

        {/* Bell Dome with Gold Filigree */}
        <path
          d={`M${-w} ${bottom} C${-w} ${y1 + h * 0.4} ${-w * 0.3} ${y1} 0 ${y1} C${w * 0.3} ${y1} ${w} ${y1 + h * 0.4} ${w} ${bottom} Z`}
          fill={`url(#${id}-m)`}
          stroke={pal.dark}
          strokeWidth="1.6"
        />

        {/* Scalloped Rim Beads */}
        {Array.from({ length: 8 }).map((_, i) => (
          <circle key={i} cx={-w + (i * 2 * w) / 7} cy={bottom} r={3.2 * k} fill={`url(#${id}-m-rad)`} stroke={pal.dark} strokeWidth="0.6" />
        ))}

        {/* Dangling Pearls */}
        {Array.from({ length: pearls }).map((_, i) => {
          const px = pearls === 1 ? 0 : -w * 0.75 + (i * 1.5 * w) / (pearls - 1);
          const py = bottom + 18 * k + (i % 2) * 5;
          return (
            <g key={i}>
              <line x1={px} y1={bottom + 3} x2={px} y2={py} stroke={pal.dark} strokeWidth="1.2" />
              <circle cx={px} cy={py + 5} r={5.8 * k} fill={`url(#${id}-p)`} stroke="#cfbe9f" strokeWidth="0.6" />
            </g>
          );
        })}

        <Sparkle x={flip * 14} y={y1 + 18} size={9} />
      </g>
    );
  };

  return (
    <g filter={`url(#${id}-sh)`} transform="translate(0 22)">
      <Ear cx={120} flip={-1} />
      <Ear cx={280} flip={1} />
    </g>
  );
}

// 2D Realistic Bracelet Artwork
function BraceletSVG({ s, id, pal }: { s: DesignState; id: string; pal: Pal }) {
  const rx = 130;
  const ry = 68;
  const isTennis = s.chain === "Tennis";
  const charms = String(s.charms || "").split(",").filter(Boolean);

  return (
    <g filter={`url(#${id}-sh)`}>
      <ellipse cx="200" cy="140" rx={rx} ry={ry} fill="none" stroke={`url(#${id}-m)`} strokeWidth={isTennis ? 6 : 9} />
      <ellipse cx="200" cy="140" rx={rx - 3} ry={ry - 3} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />

      {/* Tennis Diamonds */}
      {isTennis &&
        Array.from({ length: 34 }).map((_, i) => {
          const a = (i / 34) * Math.PI * 2;
          const x = 200 + rx * Math.cos(a);
          const y = 140 + ry * Math.sin(a);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="4.8" fill={`url(#${id}-s)`} stroke={pal.dark} strokeWidth="0.6" />
              <circle cx={x - 1} cy={y - 1} r="1.2" fill="#fff" opacity="0.85" />
            </g>
          );
        })}

      {/* Charms */}
      {charms.map((c, i) => {
        const a = Math.PI * (0.3 + (0.4 * (i + 0.5)) / Math.max(charms.length, 1));
        const cx = 200 + rx * Math.cos(a);
        const cy = 140 + ry * Math.sin(a);
        return (
          <g key={c + i} transform={`translate(${cx} ${cy})`}>
            <line y1="0" y2="16" stroke={pal.dark} strokeWidth="1.8" />
            <circle cy="28" r="12" fill={`url(#${id}-m-rad)`} stroke={pal.dark} strokeWidth="1.2" />
            <Sparkle x={0} y={28} size={7} />
          </g>
        );
      })}

      <Sparkle x={200 + rx - 8} y={138} size={11} />
    </g>
  );
}

// Master Jewelry Live Preview
export function JewelryPreview({ kind, state, className }: { kind: BuilderKind; state: DesignState; className?: string }) {
  const id = useId().replace(/:/g, "");
  let pal = metalPalette(state, builders[kind].metalKey);
  const finish = String(state.finish ?? "");
  if (finish === "Oxidised") pal = { base: "#5a5a60", light: "#9a9aa2", dark: "#2c2c30" };
  const stone = stoneHex(kind, state);
  const vb = kind === "necklace" ? "0 0 400 420" : kind === "bracelet" ? "0 0 400 280" : kind === "jhumka" ? "0 0 400 330" : "0 0 400 400";

  return (
    <svg viewBox={vb} className={className} role="img" aria-label={`${builders[kind].title} live preview`}>
      <Defs id={id} pal={pal} stone={stone} matte={finish === "Matte"} />

      {/* Background Luxury Studio Pedestal */}
      <rect width="400" height="420" fill={`url(#${id}-bg)`} />

      {/* Soft Center Lighting Halo */}
      <circle cx="200" cy="200" r="160" fill="#ffffff" opacity="0.35" filter="blur(30px)" />

      {/* Live Realistic Renderings */}
      {kind === "ring" && <RingSVG s={state} id={id} pal={pal} />}
      {kind === "necklace" && <NecklaceSVG s={state} id={id} pal={pal} />}
      {kind === "jhumka" && <JhumkaSVG s={state} id={id} pal={pal} />}
      {kind === "bracelet" && <BraceletSVG s={state} id={id} pal={pal} />}
    </svg>
  );
}
