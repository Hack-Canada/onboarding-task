import { gsap, ScrollTrigger } from '../utils/gsap';
import { BREAKPOINT_REDUCED_MOTION, mediaMatches } from './matchMedia';

const SECTIONS = [
  { id: 'hero', label: 'Wharf' },
  { id: 'journey', label: 'Voyage' },
] as const;

let navCtx: gsap.Context | null = null;

export function initNavProgress(): gsap.Context {
  navCtx?.revert();

  navCtx = gsap.context(() => {
    const bar = document.querySelector<HTMLElement>('[data-nav-progress]');
    const nav = document.querySelector<HTMLElement>('[data-site-nav]');

    if (bar) {
      gsap.set(bar, { scaleX: 0, transformOrigin: 'left center' });
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          gsap.set(bar, { scaleX: self.progress });
        },
      });
    }

    if (nav) {
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: 'top top',
        end: 'max',
        onUpdate: (self) => {
          nav.classList.toggle('is-scrolled', self.scroll() > 48);
        },
      });
    }

    SECTIONS.forEach(({ id }) => {
      const section = document.getElementById(id);
      const links = document.querySelectorAll<HTMLElement>(`[data-nav-section="${id}"]`);
      if (!section || !links.length) return;

      ScrollTrigger.create({
        trigger: section,
        start: 'top 55%',
        end: 'bottom 45%',
        onToggle: (self) => {
          links.forEach((link) => link.classList.toggle('is-active', self.isActive));
        },
      });
    });
  });

  return navCtx;
}

export function destroyNavProgress(): void {
  navCtx?.revert();
  navCtx = null;
}
