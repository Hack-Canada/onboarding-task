import { gsap } from '../utils/gsap';

let revealsCtx: gsap.Context | null = null;

export function initSectionReveals(): gsap.Context {
  revealsCtx?.revert();
  revealsCtx = gsap.context(() => {
    /* Reserved for section-level reveals on live routes */
  });
  return revealsCtx;
}

export function destroySectionReveals(): void {
  revealsCtx?.revert();
  revealsCtx = null;
}
