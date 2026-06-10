import { FOG_LAYER_OPACITIES } from '../config/animation';
import { gsap } from '../utils/gsap';
import { BREAKPOINT_REDUCED_MOTION, mediaMatches } from './matchMedia';

let fogCtx: gsap.Context | null = null;

export function initLivingFog(root: HTMLElement): gsap.Context {
  fogCtx?.revert();
  fogCtx = gsap.context(() => {
    const layers = gsap.utils.toArray<HTMLElement>('[data-fog-layer]', root);
    if (!layers.length) return;

    if (mediaMatches(BREAKPOINT_REDUCED_MOTION)) {
      gsap.set(layers, { opacity: FOG_LAYER_OPACITIES[1] });
      return;
    }

    layers.forEach((layer, i) => {
      const op = FOG_LAYER_OPACITIES[i] ?? FOG_LAYER_OPACITIES[0];
      gsap.set(layer, { opacity: op });
      gsap.to(layer, {
        opacity: op * 1.15,
        duration: 6 + i * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });
  }, root);

  return fogCtx;
}

export function destroyLivingFog(): void {
  fogCtx?.revert();
  fogCtx = null;
}
