import {
  BREAKPOINT_MOBILE,
  BREAKPOINT_REDUCED_MOTION,
  DURATION_BOB_FAST,
  DURATION_BOB_SLOW,
  EASE_BOB,
  EASE_REVEAL,
  FLOAT_BOB_FAST_Y,
  FLOAT_BOB_SLOW_Y,
} from '../config/animation';
import { gsap } from './gsap';

/** Shared tween factories — keeps animation files DRY */

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(BREAKPOINT_REDUCED_MOTION).matches;
}

export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(BREAKPOINT_MOBILE).matches;
}

export function tweenBob(
  targets: gsap.TweenTarget,
  y: number,
  duration: number
): gsap.core.Tween {
  return gsap.to(targets, {
    y,
    duration,
    repeat: -1,
    yoyo: true,
    ease: EASE_BOB,
  });
}

export function tweenBobSlow(targets: gsap.TweenTarget): gsap.core.Tween {
  return tweenBob(targets, FLOAT_BOB_SLOW_Y, DURATION_BOB_SLOW);
}

export function tweenBobFast(targets: gsap.TweenTarget): gsap.core.Tween {
  return tweenBob(targets, FLOAT_BOB_FAST_Y, DURATION_BOB_FAST);
}

export function tweenWaterLoop(
  target: gsap.TweenTarget,
  duration: number
): gsap.core.Tween {
  gsap.set(target, { yPercent: 0, force3D: true });
  return gsap.to(target, {
    yPercent: -50,
    duration,
    repeat: -1,
    ease: 'none',
  });
}

export function tweenRevealOpacity(
  targets: gsap.TweenTarget,
  options?: { delay?: number; stagger?: number }
): gsap.core.Tween {
  return gsap.from(targets, {
    opacity: 0,
    y: 16,
    duration: 0.6,
    stagger: options?.stagger ?? 0.06,
    delay: options?.delay ?? 0,
    ease: EASE_REVEAL,
  });
}

export function flashElement(target: gsap.TweenTarget): void {
  gsap.fromTo(target, { opacity: 0.65 }, { opacity: 1, duration: 0.2, yoyo: true, repeat: 1 });
}

export function clearWillChangeAfter(
  targets: gsap.TweenTarget,
  tween: gsap.core.Tween
): void {
  tween.eventCallback('onComplete', () => {
    gsap.utils.toArray<HTMLElement>(targets).forEach((el) => {
      el.style.willChange = 'auto';
    });
  });
}

export function tweenInkUnderline(line: HTMLElement, show: boolean): void {
  gsap.to(line, { scaleX: show ? 1 : 0, duration: show ? 0.38 : 0.28, ease: 'power2.out' });
}

export function tweenWaterRipple(ring: HTMLElement): void {
  gsap.fromTo(ring, { scale: 0, opacity: 0.5 }, { scale: 2.5, opacity: 0, duration: 0.65, ease: 'power2.out' });
}

export function tweenThumbtackWobble(target: HTMLElement): void {
  gsap.fromTo(target, { rotation: 0 }, { rotation: 8, duration: 0.12, yoyo: true, repeat: 3, ease: 'sine.inOut' });
}

export function tweenSailLuff(sail: Element, wind: number): void {
  gsap.to(sail, {
    skewX: wind * 12,
    transformOrigin: 'bottom center',
    duration: 0.5,
    ease: 'power2.out',
  });
}
