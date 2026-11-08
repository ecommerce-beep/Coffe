import { useId, type CSSProperties } from 'react';
import { C, type Product, type FlavorId } from '../../lib/data';
import { wavePath, splashPath } from '../../lib/motion';

const useSvgId = () => useId().replace(/:/g, '');
const DISPLAY = "'Bagel Fat One', system-ui, sans-serif";
const BODY = "'Outfit', system-ui, sans-serif";

/* ================= COFFEE BEAN ================= */
export function Bean({ color = C.espresso, crease = '#2e211d', className, style }: { color?: string; crease?: string; className?: string; style?: CSSProperties }) {
  const id = useSvgId();
  return (
    <svg viewBox="0 0 60 80" className={className} style={style} aria-hidden="true">
      <defs>
        <radialGradient id={`bg${id}`} cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.25" />
        </radialGradient>
      </defs>
      <ellipse cx="30" cy="40" rx="26" ry="36" fill={color} />
      <ellipse cx="30" cy="40" rx="26" ry="36" fill={`url(#bg${id})`} />
      <path d="M31 6 C18 22 42 34 29 48 C20 58 32 68 30 75" stroke={crease} strokeWidth="5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ================= KUPPA GLASS CUP (hero / iced) ================= */
const CUP_BODY = 'M28 64 L70 400 C74 418 92 424 160 424 C228 424 246 418 250 400 L292 64 Z';

export function GlassCup({ fill = 0, className, ice = false, straw = true }: { fill?: number; className?: string; ice?: boolean; straw?: boolean }) {
  const id = useSvgId();
  const y = (1 - fill) * 345;
  return (
    <svg viewBox="-10 -70 340 530" className={className} aria-hidden="true">
      <defs>
        <clipPath id={`cl${id}`}>
          <path d={CUP_BODY} />
        </clipPath>
        <linearGradient id={`lq${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6b4a41" />
          <stop offset="0.35" stopColor={C.espresso} />
          <stop offset="1" stopColor="#2f211d" />
        </linearGradient>
        <linearGradient id={`gl${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.18" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="0.7" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.45" />
        </linearGradient>
        <pattern id={`st${id}`} width="22" height="34" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
          <rect width="22" height="34" fill={C.cherry} />
          <rect width="22" height="12" fill={C.cream} />
        </pattern>
      </defs>
      {/* floor shadow */}
      <ellipse cx="160" cy="436" rx="118" ry="14" fill={C.espresso} opacity="0.16" className="cup__shadow" />
      {/* back rim */}
      <ellipse cx="160" cy="64" rx="132" ry="20" fill="#fff" opacity="0.25" />
      {straw && (
        <g transform="rotate(10 210 120)">
          <rect x="196" y="-66" width="26" height="420" rx="13" fill={`url(#st${id})`} />
        </g>
      )}
      {/* liquid */}
      <g clipPath={`url(#cl${id})`}>
        <g className="cup__liquid" transform={`translate(0 ${y})`}>
          <path className="cup__wave cup__wave--back" d={wavePath(70, 7, 130, -340, 700, 520)} fill="#8a5a4c" />
          <path className="cup__wave cup__wave--front" d={wavePath(80, 8, 110, -340, 700, 520)} fill={`url(#lq${id})`} />
          <ellipse cx="110" cy="200" rx="34" ry="90" fill="#fff" opacity="0.06" />
          <circle className="cup__bubble" cx="96" cy="150" r="5" fill={C.cream} opacity="0.35" />
          <circle className="cup__bubble" cx="214" cy="190" r="4" fill={C.cream} opacity="0.3" />
          <circle className="cup__bubble" cx="150" cy="260" r="6" fill={C.cream} opacity="0.25" />
          {ice && (
            <g opacity="0.85">
              <rect x="70" y="92" width="62" height="58" rx="12" fill="#fff" opacity="0.45" transform="rotate(-12 100 120)" />
              <rect x="170" y="100" width="56" height="54" rx="12" fill="#fff" opacity="0.4" transform="rotate(14 200 130)" />
            </g>
          )}
        </g>
      </g>
      {/* glass body */}
      <path d={CUP_BODY} fill={`url(#gl${id})`} stroke="#fff" strokeOpacity="0.85" strokeWidth="3" />
      <path d={CUP_BODY} fill="none" stroke={C.espresso} strokeOpacity="0.14" strokeWidth="1.5" />
      <g className="cup__shine">
        <path d="M52 92 L86 380" stroke="#fff" strokeWidth="14" strokeLinecap="round" opacity="0.55" />
        <path d="M78 92 L100 250" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.45" />
      </g>
      {/* front rim */}
      <path d="M28 64 A132 20 0 0 0 292 64" fill="none" stroke="#fff" strokeWidth="4" opacity="0.9" />
      <ellipse cx="160" cy="64" rx="132" ry="20" fill="none" stroke={C.espresso} strokeOpacity="0.12" strokeWidth="1.5" />
      {/* badge */}
      <g className="cup__badge">
        <circle cx="160" cy="262" r="62" fill={C.cherry} />
        <circle cx="160" cy="262" r="53" fill="none" stroke={C.cream} strokeWidth="1.5" strokeDasharray="3 5" opacity="0.7" />
        <text x="160" y="270" textAnchor="middle" fontFamily={DISPLAY} fontSize="34" fill={C.cream}>KUPPA</text>
        <path d="M138 284 Q160 300 182 284" stroke={C.butter} strokeWidth="5" fill="none" strokeLinecap="round" />
        <text x="160" y="236" textAnchor="middle" fontFamily={BODY} fontWeight="800" fontSize="9" letterSpacing="2.5" fill={C.peach}>GOOD MOOD</text>
      </g>
    </svg>
  );
}

/* ================= TAKEAWAY CUP ================= */
export function TakeawayCup({ className, sleeve = C.butter, lid = C.cherry }: { className?: string; sleeve?: string; lid?: string }) {
  const id = useSvgId();
  return (
    <svg viewBox="0 0 240 340" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`sh${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.16" />
          <stop offset="0.3" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <ellipse cx="120" cy="330" rx="78" ry="9" fill={C.espresso} opacity="0.15" />
      <path d="M36 70 L62 318 Q64 326 74 326 L166 326 Q176 326 178 318 L204 70 Z" fill={C.cream} />
      <path d="M44 140 L196 140 L186 246 L54 246 Z" fill={sleeve} />
      <text x="120" y="206" textAnchor="middle" fontFamily={DISPLAY} fontSize="38" fill={C.cherry}>KUPPA</text>
      <path d="M100 218 Q120 232 140 218" stroke={C.cherry} strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <path d="M36 70 L62 318 Q64 326 74 326 L166 326 Q176 326 178 318 L204 70 Z" fill={`url(#sh${id})`} />
      <rect x="22" y="48" width="196" height="28" rx="10" fill={lid} />
      <path d="M40 48 Q46 22 70 20 L170 20 Q194 22 200 48 Z" fill={lid} />
      <rect x="22" y="48" width="196" height="28" rx="10" fill={`url(#sh${id})`} />
      <ellipse cx="150" cy="24" rx="16" ry="4" fill="#000" opacity="0.18" />
    </svg>
  );
}

/* ================= COFFEE BAG ================= */
function zigzag(x0: number, x1: number, y: number, n: number, h: number) {
  let d = `M${x0} ${y + h}`;
  const step = (x1 - x0) / n;
  for (let i = 0; i < n; i++) d += ` L${x0 + step * i + step / 2} ${y} L${x0 + step * (i + 1)} ${y + h}`;
  return d;
}

export function Bag({ product, className, compact = false }: { product: Product; className?: string; compact?: boolean }) {
  const id = useSvgId();
  const { bag, name, origin } = product;
  const seed = product.id.length * 7;
  return (
    <svg viewBox="0 0 300 430" className={className} role="img" aria-label={`KUPPA ${name.join(' ')} coffee bag`}>
      <defs>
        <clipPath id={`bc${id}`}>
          <path d="M30 40 L270 40 L278 396 Q278 414 260 414 L40 414 Q22 414 22 396 Z" />
        </clipPath>
        <linearGradient id={`bs${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.2" />
          <stop offset="0.12" stopColor="#000" stopOpacity="0.02" />
          <stop offset="0.32" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.02" />
          <stop offset="0.86" stopColor="#000" stopOpacity="0.06" />
          <stop offset="1" stopColor="#000" stopOpacity="0.26" />
        </linearGradient>
        <linearGradient id={`bv${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.15" />
          <stop offset="0.2" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.85" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.18" />
        </linearGradient>
      </defs>
      <ellipse cx="150" cy="420" rx="128" ry="12" fill={C.espresso} opacity="0.18" />
      {/* crimped top seal */}
      <path d={`${zigzag(30, 270, 6, 24, 8)} L270 46 L30 46 Z`} fill={bag.base} />
      <path d={`${zigzag(30, 270, 6, 24, 8)} L270 46 L30 46 Z`} fill={`url(#bs${id})`} />
      <g clipPath={`url(#bc${id})`}>
        <rect x="0" y="0" width="300" height="430" fill={bag.base} />
        {/* organic pattern */}
        <path d={splashPath(40, 360, 120, 8, seed + 3, 0.25)} fill={bag.a} />
        <path d={splashPath(280, 120, 90, 8, seed + 11, 0.3)} fill={bag.a} />
        <path d={splashPath(262, 330, 54, 7, seed + 5, 0.3)} fill={bag.b} opacity="0.9" />
        <circle cx="58" cy="96" r="20" fill={bag.b} opacity="0.9" />
        <rect x="0" y="0" width="300" height="430" fill={`url(#bs${id})`} />
        <rect x="0" y="0" width="300" height="430" fill={`url(#bv${id})`} />
      </g>
      <line x1="34" y1="56" x2="266" y2="56" stroke="#000" strokeOpacity="0.15" strokeWidth="2" strokeDasharray="4 4" />
      {/* valve */}
      <circle cx="150" cy="82" r="9" fill="#000" opacity="0.12" />
      <circle cx="150" cy="82" r="5" fill="#fff" opacity="0.25" />
      {/* wordmark */}
      <text x="150" y="160" textAnchor="middle" fontFamily={DISPLAY} fontSize="62" fill={bag.logo}>KUPPA</text>
      {/* label */}
      <rect x="58" y="196" width="184" height={compact ? 120 : 162} rx="26" fill={bag.label} />
      <text x="150" y="240" textAnchor="middle" fontFamily={DISPLAY} fontSize="30" fill={bag.ink}>{name[0].toUpperCase()}</text>
      <text x="150" y="272" textAnchor="middle" fontFamily={DISPLAY} fontSize="30" fill={bag.ink}>{name[1].toUpperCase()}</text>
      {!compact && (
        <>
          <line x1="96" y1="290" x2="204" y2="290" stroke={bag.ink} strokeOpacity="0.3" strokeWidth="1.5" />
          <text x="150" y="312" textAnchor="middle" fontFamily={BODY} fontWeight="700" fontSize="11" letterSpacing="2" fill={C.espresso}>{origin.toUpperCase().slice(0, 22)}</text>
          <text x="150" y="334" textAnchor="middle" fontFamily={BODY} fontWeight="500" fontSize="10" letterSpacing="1.5" fill={C.espresso} opacity="0.7">WHOLE BEAN · 250G</text>
        </>
      )}
    </svg>
  );
}

/* ================= COFFEE TIN ================= */
export function Tin({ className }: { className?: string }) {
  const id = useSvgId();
  return (
    <svg viewBox="0 0 200 270" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`ts${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.22" />
          <stop offset="0.28" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="258" rx="86" ry="10" fill={C.espresso} opacity="0.18" />
      <path d="M18 50 L18 238 A82 16 0 0 0 182 238 L182 50 Z" fill={C.cherry} />
      <path d="M18 120 L182 120 L182 196 A82 16 0 0 1 18 196 Z" fill={C.peach} />
      <text x="100" y="172" textAnchor="middle" fontFamily={DISPLAY} fontSize="36" fill={C.cherry}>KUPPA</text>
      <circle cx="100" cy="92" r="12" fill={C.butter} />
      <path d="M18 50 L18 238 A82 16 0 0 0 182 238 L182 50 Z" fill={`url(#ts${id})`} />
      <path d="M14 36 L14 58 A86 16 0 0 0 186 58 L186 36 Z" fill={C.butter} />
      <path d="M14 36 L14 58 A86 16 0 0 0 186 58 L186 36 Z" fill={`url(#ts${id})`} />
      <ellipse cx="100" cy="36" rx="86" ry="16" fill="#f8d77e" />
      <ellipse cx="100" cy="36" rx="60" ry="9" fill="#fff" opacity="0.25" />
    </svg>
  );
}

/* ================= TOTE BAG ================= */
export function Tote({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 340" className={className} aria-hidden="true">
      <ellipse cx="130" cy="330" rx="104" ry="9" fill={C.espresso} opacity="0.15" />
      <path d="M78 110 C78 20 182 20 182 110" fill="none" stroke="#e9d3bc" strokeWidth="14" strokeLinecap="round" />
      <path d="M78 110 C78 20 182 20 182 110" fill="none" stroke="#000" strokeOpacity="0.08" strokeWidth="14" strokeLinecap="round" strokeDasharray="2 10" />
      <path d="M26 100 L234 100 L244 318 Q244 326 236 326 L24 326 Q16 326 16 318 Z" fill="#f3e0cb" />
      <path d={splashPath(130, 214, 70, 9, 21, 0.22)} fill={C.butter} />
      <text x="130" y="226" textAnchor="middle" fontFamily={DISPLAY} fontSize="44" fill={C.cherry}>KUPPA</text>
      <text x="130" y="262" textAnchor="middle" fontFamily={BODY} fontWeight="800" fontSize="11" letterSpacing="3" fill={C.cherry}>GOOD COFFEE · GOOD MOOD</text>
      <circle cx="58" cy="140" r="9" fill={C.peach} />
      <circle cx="206" cy="292" r="12" fill={C.blue} />
      <path d="M26 100 L234 100 L244 318 Q244 326 236 326 L24 326 Q16 326 16 318 Z" fill="none" stroke="#000" strokeOpacity="0.06" strokeWidth="2" />
      <path d="M16 100 L60 100 L52 326 L16 326 Z" fill="#000" opacity="0.05" />
    </svg>
  );
}

/* ================= GIFT BOX ================= */
export function GiftBox({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 270" className={className} aria-hidden="true">
      <ellipse cx="130" cy="258" rx="110" ry="10" fill={C.espresso} opacity="0.16" />
      <rect x="28" y="100" width="204" height="152" rx="14" fill={C.blue} />
      <rect x="28" y="100" width="204" height="152" rx="14" fill="#000" opacity="0.06" />
      <rect x="18" y="74" width="224" height="44" rx="12" fill={C.blue} />
      <rect x="18" y="74" width="224" height="16" rx="8" fill="#fff" opacity="0.25" />
      <rect x="114" y="74" width="32" height="178" fill={C.cherry} />
      <rect x="28" y="160" width="204" height="26" fill={C.cherry} opacity="0.92" />
      <path d="M130 76 C96 30 54 48 76 74 C86 84 112 80 130 76 Z" fill={C.cherry} />
      <path d="M130 76 C164 30 206 48 184 74 C174 84 148 80 130 76 Z" fill={C.cherry} />
      <circle cx="130" cy="74" r="13" fill="#7c2638" />
      <g transform="rotate(-8 200 210)">
        <rect x="170" y="196" width="66" height="34" rx="8" fill={C.cream} />
        <text x="203" y="220" textAnchor="middle" fontFamily={DISPLAY} fontSize="15" fill={C.cherry}>KUPPA</text>
      </g>
    </svg>
  );
}

/* ================= FLAVOR OBJECTS ================= */
export function FlavorArt({ id, className }: { id: FlavorId; className?: string }) {
  const g = useSvgId();
  const shine = (
    <radialGradient id={`fs${g}`} cx="32%" cy="28%" r="70%">
      <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
      <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
      <stop offset="1" stopColor="#000" stopOpacity="0.25" />
    </radialGradient>
  );
  switch (id) {
    case 'cherry':
      return (
        <svg viewBox="0 0 160 160" className={className} aria-hidden="true">
          <defs>{shine}</defs>
          <path d="M60 96 C66 60 86 34 112 22" stroke={C.espresso} strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M104 100 C102 64 106 40 112 22" stroke={C.espresso} strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M112 22 C130 6 150 18 142 34 C126 38 116 32 112 22 Z" fill={C.peach} />
          <circle cx="58" cy="112" r="32" fill={C.cherry} />
          <circle cx="58" cy="112" r="32" fill={`url(#fs${g})`} />
          <circle cx="106" cy="114" r="30" fill="#a8364d" />
          <circle cx="106" cy="114" r="30" fill={`url(#fs${g})`} />
        </svg>
      );
    case 'chocolate':
      return (
        <svg viewBox="0 0 160 160" className={className} aria-hidden="true">
          <defs>{shine}</defs>
          <g transform="rotate(-14 80 80)">
            <path d="M28 30 L132 30 Q140 30 140 38 L140 104 L112 132 L36 132 Q28 132 28 124 Z" fill={C.espresso} />
            {[0, 1, 2].map((c) =>
              [0, 1, 2].map((r) =>
                c === 2 && r === 2 ? null : (
                  <rect key={`${c}${r}`} x={36 + c * 34} y={38 + r * 31} width="28" height="25" rx="5" fill="#5a4039" />
                ),
              ),
            )}
            <path d="M28 30 L132 30 Q140 30 140 38 L140 104 L112 132 L36 132 Q28 132 28 124 Z" fill={`url(#fs${g})`} opacity="0.7" />
          </g>
        </svg>
      );
    case 'caramel':
      return (
        <svg viewBox="0 0 160 160" className={className} aria-hidden="true">
          <defs>
            {shine}
            <linearGradient id={`cg${g}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={C.butter} />
              <stop offset="1" stopColor="#d9973f" />
            </linearGradient>
          </defs>
          <path d="M30 40 Q80 20 130 40 L130 70 Q128 86 118 80 Q112 76 110 96 Q108 128 96 128 Q84 128 86 100 Q86 84 74 90 Q64 96 60 82 Q56 70 46 84 Q36 96 32 76 Z" fill={`url(#cg${g})`} />
          <path d="M30 40 Q80 20 130 40 L130 70 Q128 86 118 80 Q112 76 110 96 Q108 128 96 128 Q84 128 86 100 Q86 84 74 90 Q64 96 60 82 Q56 70 46 84 Q36 96 32 76 Z" fill={`url(#fs${g})`} opacity="0.6" />
          <circle cx="96" cy="146" r="8" fill="#d9973f" />
        </svg>
      );
    case 'honey':
      return (
        <svg viewBox="0 0 160 160" className={className} aria-hidden="true">
          <defs>{shine}</defs>
          {[
            [56, 50], [96, 50], [36, 85], [76, 85], [116, 85], [56, 120], [96, 120],
          ].map(([x, y], i) => (
            <path
              key={i}
              d={`M${x} ${y - 22} L${x + 19} ${y - 11} L${x + 19} ${y + 11} L${x} ${y + 22} L${x - 19} ${y + 11} L${x - 19} ${y - 11} Z`}
              fill={i % 3 === 0 ? '#e8b24a' : C.butter}
              stroke="#e0a63d"
              strokeWidth="3"
            />
          ))}
          <path d="M76 107 Q78 140 84 146 Q90 152 92 140 Q94 128 96 107 Z" fill="#e8b24a" />
          <rect x="0" y="0" width="160" height="160" fill={`url(#fs${g})`} opacity="0.35" />
        </svg>
      );
    case 'nuts':
      return (
        <svg viewBox="0 0 160 160" className={className} aria-hidden="true">
          <defs>{shine}</defs>
          <path d="M80 34 C120 34 136 72 130 104 C124 134 100 146 80 146 C60 146 36 134 30 104 C24 72 40 34 80 34 Z" fill="#b27a5e" />
          <path d="M80 34 C120 34 136 72 130 104 C124 134 100 146 80 146 C60 146 36 134 30 104 C24 72 40 34 80 34 Z" fill={`url(#fs${g})`} />
          <path d="M34 66 C40 38 60 26 80 26 C100 26 120 38 126 66 C112 58 96 56 80 56 C64 56 48 58 34 66 Z" fill={C.espresso} />
          <path d="M80 26 L80 12" stroke={C.espresso} strokeWidth="6" strokeLinecap="round" />
          <path d="M60 90 Q64 120 70 132" stroke="#000" strokeOpacity="0.12" strokeWidth="4" fill="none" strokeLinecap="round" />
        </svg>
      );
  }
}

/* ================= ICONS ================= */
export const Arrow = ({ dir = 'right', size = 20 }: { dir?: 'left' | 'right' | 'down'; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    aria-hidden="true"
    style={{ transform: dir === 'left' ? 'rotate(180deg)' : dir === 'down' ? 'rotate(90deg)' : undefined }}
  >
    <path d="M4 12h15M13 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Smile = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 40 20" className={className} aria-hidden="true">
    <path d="M4 4 Q20 22 36 4" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" />
  </svg>
);

export const Sparkle = ({ className, color = C.butter }: { className?: string; color?: string }) => (
  <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
    <path d="M20 0 C22 14 26 18 40 20 C26 22 22 26 20 40 C18 26 14 22 0 20 C14 18 18 14 20 0 Z" fill={color} />
  </svg>
);
