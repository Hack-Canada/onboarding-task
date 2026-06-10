/** Maritime crew figures — off-viewport travel + ambient */

const FIG_INK = '#1e3a5f';
const FIG_STROKE = 2;

export const lighthouseKeeperSvg = `<svg viewBox="0 0 100 160" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <ellipse cx="50" cy="152" rx="30" ry="6" fill="#00000022"/>
  <path d="M34 60 Q50 52 66 60 L74 140 Q50 150 26 140 Z" fill="#0c2340"/>
  <path d="M50 56 L66 60 L74 140 Q62 146 50 146 Z" fill="#1e3a5f"/>
  <path d="M64 70 Q78 64 82 76 L76 84 Q70 74 60 80 Z" fill="#1e3a5f"/>
  <rect x="34" y="138" width="13" height="14" rx="3" fill="#06182e"/>
  <rect x="53" y="138" width="13" height="14" rx="3" fill="#06182e"/>
  <path d="M33 44 Q50 30 67 44 Q70 50 64 52 L36 52 Q30 50 33 44 Z" fill="#0c2340"/>
  <ellipse cx="50" cy="52" rx="20" ry="5" fill="#1e3a5f"/>
  <circle cx="50" cy="48" r="9" fill="#f2d3b3"/>
  <path d="M50 39 a9 9 0 0 1 0 18 Z" fill="#dcb892"/>
  <rect x="76" y="70" width="14" height="16" rx="2" fill="#1e3a5f"/>
  <rect x="79" y="73" width="8" height="10" fill="#fde68a"/>
  <rect x="82" y="73" width="3" height="10" fill="#fcd34d"/>
  <rect x="80" y="66" width="6" height="4" rx="2" fill="#1e3a5f"/>
</svg>`;

export const fishermanDorySvg = `<svg viewBox="0 0 140 90" fill="none" aria-hidden="true" class="w-full h-full">
  <ellipse cx="70" cy="78" rx="55" ry="8" fill="#0f172a" opacity="0.3"/>
  <path d="M15 62 Q70 38 125 62 L115 70 Q70 50 25 70Z" fill="#fef3c7" stroke="${FIG_INK}" stroke-width="${FIG_STROKE}"/>
  <circle cx="95" cy="48" r="8" fill="#fde68a" stroke="${FIG_INK}" stroke-width="1.5"/>
  <path d="M88 44 L102 44" stroke="${FIG_INK}" stroke-width="1.5"/>
  <path d="M40 55 L55 42" stroke="#64748b" stroke-width="2" stroke-linecap="round"/>
</svg>`;

export const lanternCrewSvg = `<svg viewBox="0 0 72 110" fill="none" aria-hidden="true" class="w-full h-full">
  <path d="M24 102 L28 58 Q36 44 44 58 L48 102Z" fill="#134e4a" stroke="#0f766e" stroke-width="1.5"/>
  <circle cx="36" cy="38" r="10" fill="#fde68a" stroke="${FIG_INK}" stroke-width="1.5"/>
  <rect x="30" y="48" width="12" height="18" rx="2" fill="#fbbf24" opacity="0.9"/>
  <ellipse cx="36" cy="54" rx="8" ry="10" fill="#fef08a" opacity="0.5"/>
</svg>`;

export const seagullFlockSvg = `<svg viewBox="0 0 120 48" fill="none" aria-hidden="true" class="w-full h-full">
  <path d="M4 28 Q12 18 20 24 Q28 14 36 22" stroke="#e2e8f0" stroke-width="2" fill="none"/>
  <path d="M40 20 Q50 10 60 18 Q70 8 80 16" stroke="#f8fafc" stroke-width="2.5" fill="none"/>
  <path d="M82 26 Q90 16 98 22 Q106 14 114 20" stroke="#cbd5e1" stroke-width="2" fill="none"/>
</svg>`;

export const ghostShipSvg = `<svg viewBox="0 0 80 32" fill="none" aria-hidden="true" class="w-full h-full">
  <path d="M4 24 L40 8 L76 24 L70 28 L40 16 L10 28Z" fill="none" stroke="#94a3b8" stroke-width="1.5" opacity="0.8"/>
  <path d="M38 8 L42 2 L46 8" stroke="#94a3b8" stroke-width="1"/>
</svg>`;

export const mooringRopeSvg = `<svg data-rope viewBox="0 0 56 56" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" class="w-full h-full" style="transform-origin: top center">
  <ellipse cx="28" cy="50" rx="16" ry="4" fill="#00000018"/>
  <path d="M14 38 Q28 22 42 38 Q46 44 38 48 Q28 52 18 48 Q10 44 14 38Z" fill="none" stroke="#1e3a5f" stroke-width="3.5"/>
  <path d="M18 40 Q28 28 38 40 Q40 44 34 46 Q28 48 22 46 Q16 44 18 40Z" fill="none" stroke="#e8e0cf" stroke-width="2.2"/>
  <path d="M22 42 Q28 34 34 42" fill="none" stroke="#faf6ee" stroke-width="1.2" opacity="0.7"/>
  <rect x="24" y="8" width="8" height="14" rx="2" fill="#0c2340"/>
  <rect x="26" y="10" width="4" height="10" fill="#1e3a5f"/>
</svg>`;

export const buoySvg = `<svg viewBox="0 0 70 130" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <ellipse cx="35" cy="104" rx="30" ry="7" fill="#0d9488" opacity="0.5"/>
  <ellipse cx="35" cy="104" rx="18" ry="4" fill="#0f5e57" opacity="0.5"/>
  <path d="M22 100 Q22 60 35 56 Q48 60 48 100 Z" fill="#faf6ee"/>
  <path d="M35 57 Q48 60 48 100 L35 100 Z" fill="#e8e0cf"/>
  <path d="M22 76 Q35 72 48 76 L48 88 Q35 84 22 88 Z" fill="#c0392b"/>
  <path d="M35 74 Q48 76 48 88 L35 86 Z" fill="#992d22"/>
  <path d="M28 56 L42 56 L39 40 L31 40 Z" fill="#1e3a5f"/>
  <circle cx="35" cy="34" r="7" fill="#fde68a"/>
  <circle cx="35" cy="34" r="3.5" fill="#e3a008"/>
  <line x1="35" y1="27" x2="35" y2="20" stroke="#0c2340" stroke-width="2"/>
</svg>`;

export const beaverMascotSvg = `<svg viewBox="0 0 88 72" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <g data-beaver-wing="left" style="transform-origin:28px 34px">
    <path d="M10 36 Q2 24 8 18 Q16 26 22 34 Q18 38 10 36Z" fill="#c0392b" opacity="0.9"/>
    <path d="M12 34 Q6 26 10 22 Q16 28 20 33Z" fill="#fde68a" opacity="0.5"/>
  </g>
  <g data-beaver-wing="right" style="transform-origin:60px 34px">
    <path d="M78 36 Q86 24 80 18 Q72 26 66 34 Q70 38 78 36Z" fill="#c0392b" opacity="0.9"/>
    <path d="M76 34 Q82 26 78 22 Q72 28 68 33Z" fill="#fde68a" opacity="0.5"/>
  </g>
  <ellipse cx="44" cy="62" rx="26" ry="5" fill="#06182e" opacity="0.35"/>
  <path d="M26 48 Q44 58 62 48 Q58 56 44 58 Q30 56 26 48Z" fill="#6b4423"/>
  <ellipse cx="44" cy="44" rx="20" ry="16" fill="#8b5a2b"/>
  <ellipse cx="44" cy="44" rx="20" ry="16" fill="#6b4423" clip-path="inset(0 0 0 50%)"/>
  <circle cx="44" cy="28" r="15" fill="#8b5a2b"/>
  <circle cx="44" cy="28" r="15" fill="#a0714f" clip-path="inset(0 0 0 50%)"/>
  <ellipse cx="36" cy="26" rx="3" ry="3.5" fill="#0c2340"/>
  <ellipse cx="52" cy="26" rx="3" ry="3.5" fill="#0c2340"/>
  <ellipse cx="37" cy="25" rx="1" fill="#faf6ee"/>
  <ellipse cx="53" cy="25" rx="1" fill="#faf6ee"/>
  <ellipse cx="44" cy="32" rx="5" ry="4" fill="#6b4423"/>
  <rect x="40" y="33" width="3" height="5" rx="1" fill="#faf6ee"/>
  <rect x="45" y="33" width="3" height="5" rx="1" fill="#faf6ee"/>
  <path d="M58 22 Q66 14 72 20 Q64 24 58 22Z" fill="#6b4423"/>
  <path d="M30 22 Q22 14 16 20 Q24 24 30 22Z" fill="#6b4423"/>
  <rect x="62" y="38" width="14" height="10" rx="3" fill="#0c2340" transform="rotate(12 69 43)"/>
  <rect x="64" y="40" width="10" height="6" rx="1" fill="#1e3a5f" transform="rotate(12 69 43)"/>
</svg>`;

export const pennantSvg = `<svg data-flag viewBox="0 0 48 40" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" class="w-full h-full" style="transform-origin: left center">
  <line x1="8" y1="6" x2="8" y2="36" stroke="#0c2340" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M8 10 L36 15 L8 22Z" fill="#faf6ee"/>
  <path d="M8 15 L36 15 L8 22Z" fill="#e8e0cf"/>
  <path d="M8 10 L22 13 L8 16Z" fill="#c0392b"/>
</svg>`;
