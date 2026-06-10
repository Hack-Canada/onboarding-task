import { gsap, ScrollTrigger } from '../../utils/gsap';
import { HERO_SCRUB_WORD_FLOOR } from '../../config/animation';
import { BREAKPOINT_REDUCED_MOTION, mediaMatches } from '../matchMedia';

export function initScrubWords(): void {
  if (mediaMatches(BREAKPOINT_REDUCED_MOTION)) return;

  document.querySelectorAll<HTMLElement>('[data-scrub-words]').forEach((el) => {
    const text = el.textContent?.trim() ?? '';
    if (!text) return;

    el.innerHTML = text
      .split(/\s+/)
      .map((w) => `<span class="scrub-word inline-block" style="opacity:${HERO_SCRUB_WORD_FLOOR}">${w}</span>`)
      .join(' ');

    const spans = el.querySelectorAll<HTMLElement>('.scrub-word');

    gsap.to(spans, {
      opacity: 1,
      ease: 'none',
      stagger: { each: 0.05 },
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        end: 'bottom 40%',
        scrub: 0.5,
      },
    });
  });
}
