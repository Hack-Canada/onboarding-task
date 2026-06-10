import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

let lenisInstance: Lenis | null = null;

/** Lenis smooth scroll + ScrollTrigger proxy — wired once */
export function initLenis(): Lenis | null {
  if (lenisInstance) return lenisInstance;

  const lenis = new Lenis({
    lerp: 0.12,
    smoothWheel: true,
    autoRaf: false,
    anchors: {
      offset: -88,
    },
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value) {
      if (arguments.length) {
        lenis.scrollTo(value, { immediate: true });
      }
      return lenis.scroll;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
  });

  // Transform pinning plays nicely with Lenis smooth scroll
  ScrollTrigger.defaults({ pinType: 'transform' });

  ScrollTrigger.addEventListener('refresh', () => lenis.resize());

  lenisInstance = lenis;
  return lenisInstance;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function refreshScroll(): void {
  ScrollTrigger.refresh(true);
  lenisInstance?.resize();
}
