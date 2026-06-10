import { registerGSAP, ScrollTrigger } from '../utils/gsap';
import { initLenis, refreshScroll, getLenis } from '../utils/lenis';
import { initHeroAnimations, destroyHeroAnimations } from './hero';
import { initJourneyLazy, destroyJourneyAnimations } from './journey';
import { initSectionReveals, destroySectionReveals } from './reveals';
import { destroyEasterEggs, initEasterEggs } from './easterEggs';
import { initUIPolish } from './ui';
import { initDaylight, destroyDaylight } from './daylight';
import { initVelocity, destroyVelocity } from './velocity';
import { initLivingFog, destroyLivingFog } from './fog';
import { initLivingWorld, destroyLivingWorld } from './livingWorld';
import { initNavProgress, destroyNavProgress } from './navProgress';
import { initMobileNav } from './mobileNav';
import { initGhostShips, destroyGhostShips } from './techniques/ghostShips';
import { initCastOffPreloader } from './preloader';


function bindGlobalListeners(): void {
  destroyEasterEggs();
  initEasterEggs();
  initUIPolish();
  initMobileNav();
}

export function bootstrapAnimations(): void {
  try {
    registerGSAP();
    initLenis();

    destroyHeroAnimations();
    destroyJourneyAnimations();
    destroySectionReveals();
    destroyDaylight();
    destroyVelocity();
    destroyLivingFog();
    destroyLivingWorld();
    destroyNavProgress();
    destroyGhostShips();

    initDaylight();
    initVelocity();

    const hero = document.querySelector<HTMLElement>('[data-hero]');
    const journey = document.querySelector<HTMLElement>('[data-journey]');

    if (hero) {
      initHeroAnimations(hero);
      initLivingFog(hero);
    }
    if (journey) initJourneyLazy(journey);
    initSectionReveals();
    initLivingWorld();
    initNavProgress();
    initGhostShips();

    bindGlobalListeners();
    window.dispatchEvent(new CustomEvent('hc:app-ready'));

    requestAnimationFrame(() => {
      refreshScroll();
      ScrollTrigger.refresh(true);
      getLenis()?.resize();
    });

    console.log('[HackCanada] The Crossing bootstrapped');
  } catch (err) {
    console.error('[HackCanada] bootstrapAnimations failed:', err);
  }
}

function onReady(): void {
  initCastOffPreloader(bootstrapAnimations);
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady, { once: true });
  } else {
    onReady();
  }

  document.addEventListener('astro:page-load', () => {
    bootstrapAnimations();
  });

  window.addEventListener('load', () => refreshScroll());
}
