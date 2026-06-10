import { WIND_SMOOTH_DURATION, WIND_VELOCITY_MAX } from '../config/animation';
import { getLenis } from '../utils/lenis';
import { gsap } from '../utils/gsap';
import { BREAKPOINT_REDUCED_MOTION, mediaMatches } from './matchMedia';

let velocityCleanup: (() => void) | null = null;

export function initVelocity(): () => void {
  velocityCleanup?.();

  if (mediaMatches(BREAKPOINT_REDUCED_MOTION)) {
    gsap.set(document.documentElement, { '--wind': 0, '--wave-speed': 1 });
    return () => undefined;
  }

  const setWind = gsap.quickTo(document.documentElement, '--wind', {
    duration: WIND_SMOOTH_DURATION,
    ease: 'power2.out',
  });

  const setWaveSpeed = gsap.quickTo(document.documentElement, '--wave-speed', {
    duration: WIND_SMOOTH_DURATION,
    ease: 'power2.out',
  });

  const onScroll = ({ velocity }: { velocity: number }) => {
    const w = gsap.utils.clamp(-1, 1, velocity / WIND_VELOCITY_MAX);
    setWind(w);
    setWaveSpeed(1 + Math.abs(w) * 0.65);
    document.documentElement.style.setProperty('--fog-speed', String(1 + Math.abs(w) * 0.5));
    window.dispatchEvent(new CustomEvent('hc:wind', { detail: { wind: w } }));
  };

  const lenis = getLenis();
  if (lenis) {
    lenis.on('scroll', onScroll);
    velocityCleanup = () => {
      const emitter = lenis as unknown as { off?: (ev: string, fn: typeof onScroll) => void };
      emitter.off?.('scroll', onScroll);
    };
  }

  return () => velocityCleanup?.();
}

export function destroyVelocity(): void {
  velocityCleanup?.();
  velocityCleanup = null;
}
