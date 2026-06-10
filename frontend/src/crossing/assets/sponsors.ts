/** Sponsor pennant marks — moored boats at the wharf */

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
}

/** Designed placeholder: hull + sail + pennant with tier initials */
export function sponsorLogoSvg(name: string, color: string): string {
  const abbr = initials(name);
  const uid = abbr.replace(/\W/g, '').toLowerCase() || 'sp';

  return `<svg viewBox="0 0 120 72" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full" aria-hidden="true" role="img" aria-label="${name}">
  <ellipse cx="60" cy="62" rx="44" ry="5" fill="#0f172a" fill-opacity="0.35"/>
  <path d="M18 54 Q60 36 102 54 L96 58 Q60 44 24 58Z" fill="${color}" fill-opacity="0.88" stroke="rgba(255,255,255,0.55)" stroke-width="1.5"/>
  <path data-sail d="M52 52 L60 26 L68 52Z" fill="rgba(255,255,255,0.92)" stroke="rgba(255,255,255,0.35)" stroke-width="1"/>
  <line x1="60" y1="26" x2="60" y2="10" stroke="rgba(255,255,255,0.5)" stroke-width="1.2"/>
  <path d="M60 10 L88 16 L60 22Z" fill="${color}" stroke="rgba(255,255,255,0.45)" stroke-width="1"/>
  <text x="74" y="18" fill="white" font-family="system-ui,sans-serif" font-size="9" font-weight="700" letter-spacing="0.06em">${abbr}</text>
  <rect x="8" y="8" width="104" height="56" rx="8" stroke="rgba(255,255,255,0.12)" stroke-width="1" fill="url(#h-${uid})"/>
  <defs>
    <linearGradient id="h-${uid}" x1="0" y1="0" x2="120" y2="72" gradientUnits="userSpaceOnUse">
      <stop stop-color="${color}" stop-opacity="0.08"/>
      <stop offset="1" stop-color="${color}" stop-opacity="0"/>
    </linearGradient>
  </defs>
</svg>`;
}

export function sponsorLogoCompactSvg(name: string, color: string): string {
  return sponsorLogoSvg(name, color);
}
