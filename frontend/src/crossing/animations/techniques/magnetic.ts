import { gsap } from '../../utils/gsap';
import { isTouchDevice, prefersReducedMotion } from '../../utils/motion';
import { BREAKPOINT_DESKTOP, mediaMatches } from '../matchMedia';

const RADIUS = 80;
const STRENGTH = 0.35;

let buttons: HTMLElement[] = [];
let pairs = new Map<HTMLElement, { x: (v: number) => void; y: (v: number) => void }>();
let rafId = 0;
let pendingX = 0;
let pendingY = 0;
let bound = false;

function paintMagnetic(): void {
  rafId = 0;
  buttons.forEach((button) => {
    const pair = pairs.get(button);
    if (!pair) return;

    const rect = button.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = pendingX - cx;
    const dy = pendingY - cy;
    const dist = Math.hypot(dx, dy);

    if (dist < RADIUS) {
      pair.x(dx * STRENGTH);
      pair.y(dy * STRENGTH);
    } else {
      pair.x(0);
      pair.y(0);
    }
  });
}

function onMove(e: MouseEvent): void {
  pendingX = e.clientX;
  pendingY = e.clientY;
  if (!rafId) rafId = requestAnimationFrame(paintMagnetic);
}

export function initMagneticButtons(): void {
  destroyMagneticButtons();

  if (prefersReducedMotion() || isTouchDevice() || !mediaMatches(BREAKPOINT_DESKTOP)) return;

  buttons = gsap.utils.toArray<HTMLElement>('[data-magnetic]');
  if (!buttons.length) return;

  pairs = new Map();
  buttons.forEach((button) => {
    pairs.set(button, {
      x: gsap.quickTo(button, 'x', { duration: 0.25, ease: 'power2.out' }),
      y: gsap.quickTo(button, 'y', { duration: 0.25, ease: 'power2.out' }),
    });
  });

  window.addEventListener('mousemove', onMove, { passive: true });
  bound = true;
}

export function destroyMagneticButtons(): void {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = 0;

  if (bound) {
    window.removeEventListener('mousemove', onMove);
    bound = false;
  }

  buttons.forEach((button) => gsap.set(button, { x: 0, y: 0 }));
  buttons = [];
  pairs.clear();
}
