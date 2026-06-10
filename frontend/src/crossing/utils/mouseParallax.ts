import gsap from 'gsap';
import { isTouchDevice, prefersReducedMotion } from './motion';

interface QuickPair {
  x: (value: number) => void;
  y: (value: number) => void;
}

let cleanupMouseParallax: (() => void) | null = null;

/** Desktop-only cursor parallax — sky/clouds move opposite, water/floats follow with delay */
export function setupMouseParallax(): void {
  cleanupMouseParallax?.();

  if (prefersReducedMotion() || isTouchDevice()) return;

  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) return;

  const layers = gsap.utils.toArray<HTMLElement>('[data-mouse-depth]', hero);
  if (!layers.length) return;

  const pairs = new Map<HTMLElement, QuickPair>();

  layers.forEach((layer) => {
    const delay = Number(layer.dataset.mouseDelay ?? 0.5);
    pairs.set(layer, {
      x: gsap.quickTo(layer, 'x', { duration: 0.35 + delay * 0.25, ease: 'power2.out' }),
      y: gsap.quickTo(layer, 'y', { duration: 0.35 + delay * 0.25, ease: 'power2.out' }),
    });
  });

  let rafId = 0;
  let pendingX = 0;
  let pendingY = 0;

  const paint = () => {
    rafId = 0;
    const rect = hero.getBoundingClientRect();
    const nx = (pendingX - rect.left) / rect.width - 0.5;
    const ny = (pendingY - rect.top) / rect.height - 0.5;

    layers.forEach((layer) => {
      const depth = Number(layer.dataset.mouseDepth ?? 20);
      const pair = pairs.get(layer);
      if (!pair) return;
      pair.x(nx * depth);
      pair.y(ny * depth);
    });
  };

  const onMove = (e: MouseEvent) => {
    pendingX = e.clientX;
    pendingY = e.clientY;
    if (!rafId) rafId = requestAnimationFrame(paint);
  };

  hero.addEventListener('mousemove', onMove, { passive: true });

  cleanupMouseParallax = () => {
    if (rafId) cancelAnimationFrame(rafId);
    hero.removeEventListener('mousemove', onMove);
    layers.forEach((layer) => gsap.set(layer, { x: 0, y: 0 }));
  };
}

export function destroyMouseParallax(): void {
  cleanupMouseParallax?.();
  cleanupMouseParallax = null;
}
