import {
  PRELOADER_SKIP_FADE_MS,
  PRELOADER_NAV_DELAY_MS,
} from '../config/animation';
import { gsap } from '../utils/gsap';
import { BREAKPOINT_REDUCED_MOTION, mediaMatches } from './matchMedia';

let preloaderCtx: gsap.Context | null = null;
let finished = false;

function revealNav(): void {
  const nav = document.querySelector<HTMLElement>('[data-site-nav]');
  if (!nav) return;
  window.setTimeout(() => {
    nav.classList.add('is-visible');
    document.documentElement.classList.add('nav-ready');
  }, PRELOADER_NAV_DELAY_MS);
}

/** Cast-off overlay — brief optional fade; never blocks on missing assets */
export function initCastOffPreloader(onDone: () => void): void {
  if (finished) {
    onDone();
    return;
  }

  const shell = document.querySelector<HTMLElement>('[data-app-shell]');
  const overlay = document.querySelector<HTMLElement>('[data-castoff-preloader]');

  if (!overlay) {
    document.documentElement.classList.add('preloader-done');
    onDone();
    return;
  }

  preloaderCtx?.revert();
  preloaderCtx = gsap.context(() => {
    const finish = () => {
      if (finished) return;
      finished = true;
      document.documentElement.classList.add('preloader-done');
      window.dispatchEvent(new CustomEvent('hc:preloader-done'));

      const fadeMs = mediaMatches(BREAKPOINT_REDUCED_MOTION)
        ? PRELOADER_SKIP_FADE_MS / 1000
        : PRELOADER_SKIP_FADE_MS / 1000;

      gsap.to(overlay, {
        opacity: 0,
        duration: fadeMs,
        ease: 'power2.inOut',
        onComplete: () => {
          overlay.remove();
          revealNav();
          onDone();
        },
      });
    };

    if (shell) gsap.set(shell, { opacity: 1 });

    if (mediaMatches(BREAKPOINT_REDUCED_MOTION)) {
      finish();
      return;
    }

    finish();
  });
}

export function destroyCastOffPreloader(): void {
  preloaderCtx?.revert();
  preloaderCtx = null;
}
