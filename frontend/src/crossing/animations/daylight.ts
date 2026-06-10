import { DAYLIGHT_SCRUB, DAYLIGHT_SKY_OPACITY } from '../config/animation';
import { gsap, ScrollTrigger } from '../utils/gsap';
import { BREAKPOINT_REDUCED_MOTION, mediaMatches } from './matchMedia';

const SKY_BANDS: { phase: string; start: number; peak: number; end: number }[] = [
  { phase: 'dawn', start: 0, peak: 0.08, end: 0.22 },
  { phase: 'morning', start: 0.12, peak: 0.35, end: 0.5 },
  { phase: 'golden', start: 0.4, peak: 0.58, end: 0.72 },
  { phase: 'dusk', start: 0.62, peak: 0.78, end: 0.9 },
  { phase: 'night', start: 0.82, peak: 1, end: 1 },
];

function bandOpacity(progress: number, start: number, peak: number, end: number): number {
  if (progress <= start || progress >= end) return 0;
  if (progress <= peak) return (progress - start) / (peak - start);
  return 1 - (progress - peak) / (end - peak);
}

function themeColorForDaylight(d: number): string {
  if (d < 0.2) return '#7c9eb8';
  if (d < 0.45) return '#38bdf8';
  if (d < 0.65) return '#f59e0b';
  if (d < 0.85) return '#7c3aed';
  return '#0f172a';
}

function updateSkyLayers(progress: number): void {
  SKY_BANDS.forEach(({ phase, start, peak, end }) => {
    const el = document.querySelector<HTMLElement>(`[data-sky-phase="${phase}"]`);
    if (el) el.style.opacity = String(bandOpacity(progress, start, peak, end) * DAYLIGHT_SKY_OPACITY);
  });

  const stars = document.querySelector<HTMLElement>('[data-daylight-stars]');
  if (stars) {
    stars.style.opacity = String(Math.max(0, (progress - 0.72) * 3.5));
  }

  const tint = document.querySelector<HTMLElement>('[data-daylight-tint]');
  if (tint) {
    tint.style.setProperty('--daylight-tint', String(0.1 + progress * 0.35));
  }

  const shafts = document.querySelector<HTMLElement>('[data-light-shafts]');
  if (shafts) {
    shafts.style.opacity = String(Math.max(0, (progress - 0.5) * 2.2));
  }

  document.body.style.setProperty(
    '--page-brightness',
    String(0.94 + progress * 0.08)
  );

  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = themeColorForDaylight(progress);

  document.documentElement.style.setProperty('--lantern-warmth', String(0.3 + progress * 0.7));
  document.documentElement.style.setProperty('--shadow-length', `${8 + progress * 28}px`);
}

let daylightCtx: gsap.Context | null = null;

export function initDaylight(): gsap.Context {
  daylightCtx?.revert();

  daylightCtx = gsap.context(() => {
    gsap.set(document.documentElement, {
      '--daylight': 0,
      '--wind': 0,
      '--lantern-warmth': 0.3,
      '--shadow-length': '8px',
    });

    if (mediaMatches(BREAKPOINT_REDUCED_MOTION)) {
      updateSkyLayers(0.15);
      gsap.set(document.documentElement, { '--daylight': 0.15 });
      return;
    }

    ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: DAYLIGHT_SCRUB,
      onUpdate: (self) => {
        const d = self.progress;
        gsap.set(document.documentElement, { '--daylight': d });
        updateSkyLayers(d);
      },
    });

    updateSkyLayers(0);
  });

  return daylightCtx;
}

export function destroyDaylight(): void {
  daylightCtx?.revert();
  daylightCtx = null;
}
