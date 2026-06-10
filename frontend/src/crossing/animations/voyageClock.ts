import { gsap, ScrollTrigger } from '../utils/gsap';
import { BREAKPOINT_REDUCED_MOTION, mediaMatches } from './matchMedia';

let compassPulseCtx: gsap.Context | null = null;

export function initScrollCompass(): void {
  const compass = document.querySelector<HTMLElement>('[data-scroll-compass]');
  const needle = document.querySelector<HTMLElement>('[data-compass-needle]');
  if (!compass || !needle) return;

  if (mediaMatches(BREAKPOINT_REDUCED_MOTION)) {
    gsap.set(compass, { opacity: 1, pointerEvents: 'auto' });
    compass.removeAttribute('aria-hidden');
    return;
  }

  const hero = document.querySelector('[data-hero]');
  if (!hero) return;

  gsap.to(compass, {
    opacity: 0,
    y: 10,
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.5,
    },
  });

  gsap.to(needle, {
    rotation: 180,
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'max',
      scrub: 0.8,
    },
  });
}

/** Fade compass in after intro — keeps amber needle out of the headline */
export function revealScrollCompass(): void {
  const compass = document.querySelector<HTMLElement>('[data-scroll-compass]');
  const needle = document.querySelector<HTMLElement>('[data-compass-needle]');
  if (!compass || !needle) return;

  if (mediaMatches(BREAKPOINT_REDUCED_MOTION)) {
    gsap.set(compass, { opacity: 1, pointerEvents: 'auto' });
    compass.removeAttribute('aria-hidden');
    return;
  }

  compassPulseCtx?.revert();
  compassPulseCtx = gsap.context(() => {
    gsap.to(compass, {
      opacity: 1,
      duration: 0.65,
      ease: 'power2.out',
      onStart: () => {
        compass.style.pointerEvents = 'auto';
        compass.removeAttribute('aria-hidden');
      },
    });
    gsap.to(needle, { y: 4, duration: 1.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to(compass, { opacity: 0.85, duration: 1.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  });
}
