import { gsap, ScrollTrigger } from '../../utils/gsap';
import { BREAKPOINT_REDUCED_MOTION, mediaMatches } from '../matchMedia';

export function initLineReveals(): void {
  if (mediaMatches(BREAKPOINT_REDUCED_MOTION)) {
    gsap.set('[data-reveal-line]', { clipPath: 'none', y: 0, opacity: 1 });
    return;
  }

  document.querySelectorAll<HTMLElement>('[data-reveal-container]').forEach((container) => {
    const lines = gsap.utils.toArray<HTMLElement>('[data-reveal-line]', container);
    if (!lines.length) return;

    gsap.set(lines, { clipPath: 'inset(0 0 100% 0)', y: 12, opacity: 1 });

    ScrollTrigger.create({
      trigger: container,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.to(lines, {
          clipPath: 'inset(0 0 0% 0)',
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.08,
        });
      },
    });
  });
}

export function revealTideRows(): void {
  if (mediaMatches(BREAKPOINT_REDUCED_MOTION)) {
    gsap.set('[data-tide-row]', { opacity: 1, clipPath: 'none' });
    return;
  }

  gsap.utils.toArray<HTMLElement>('[data-tide-row]').forEach((row) => {
    const lines = row.querySelectorAll<HTMLElement>('[data-tide-text], [data-reveal-line]');
    const rule = row.querySelector('[data-tide-rule]');
    gsap.set(row, { opacity: 1 });
    gsap.set(lines, { clipPath: 'inset(0 0 100% 0)', y: 10, opacity: 1 });
    if (rule) gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' });

    ScrollTrigger.create({
      trigger: row,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        if (rule) gsap.to(rule, { scaleX: 1, duration: 0.6, ease: 'power2.out' });
        gsap.to(lines, {
          clipPath: 'inset(0 0 0% 0)',
          y: 0,
          duration: 0.65,
          ease: 'power3.out',
          stagger: 0.06,
        });
        const wave = row.querySelector('[data-tide-wave]');
        if (wave) {
          gsap.fromTo(wave, { y: 4 }, { y: 0, duration: 0.8, repeat: 2, yoyo: true, ease: 'sine.inOut' });
        }
      },
    });
  });
}
