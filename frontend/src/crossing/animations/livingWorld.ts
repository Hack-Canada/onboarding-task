import { gsap } from '../utils/gsap';
import { addAmbientLife, destroyAmbientLife } from './techniques/ambientLife';
import { initCharacterTravel, destroyCharacterTravel } from './techniques/characterTravel';
import { initLineReveals } from './techniques/lineReveal';
import { initMagneticButtons, destroyMagneticButtons } from './techniques/magnetic';
import { initScrubWords } from './techniques/scrubWords';
import { initTextScramble, destroyTextScramble } from './techniques/scramble';
import { BREAKPOINT_REDUCED_MOTION, mediaMatches } from './matchMedia';

let livingCtx: gsap.Context | null = null;

export function initLivingWorld(): void {
  destroyLivingWorld();

  livingCtx = gsap.context(() => {
    initLineReveals();
    initScrubWords();
    initCharacterTravel();
    initMagneticButtons();
    initTextScramble();

    const sections = [
      document.querySelector<HTMLElement>('[data-hero]'),
      document.querySelector<HTMLElement>('[data-journey]'),
    ];

    sections.forEach((section) => {
      if (section) addAmbientLife(section);
    });
  });
}

export function destroyLivingWorld(): void {
  livingCtx?.revert();
  livingCtx = null;
  destroyAmbientLife();
  destroyCharacterTravel();
  destroyMagneticButtons();
  destroyTextScramble();
}
