import { gsap } from '../utils/gsap';
import { tweenInkUnderline, tweenSailLuff, tweenWaterRipple } from '../utils/motion';
import { BREAKPOINT_REDUCED_MOTION, mediaMatches } from './matchMedia';

export function initUIPolish(): void {
  if (mediaMatches(BREAKPOINT_REDUCED_MOTION)) return;
  if (document.documentElement.dataset.uiPolishBound === 'true') return;
  document.documentElement.dataset.uiPolishBound = 'true';

  document.querySelectorAll<HTMLElement>('.btn-ripple').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple-ring';
      const size = Math.max(rect.width, rect.height) * 1.2;
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      gsap.to(ripple, { scale: 2.4, opacity: 0, duration: 0.7, ease: 'power2.out', onComplete: () => ripple.remove() });
    });
  });

  document.querySelectorAll<HTMLElement>('.nav-link').forEach((link) => {
    const line = link.querySelector<HTMLElement>('.nav-underline');
    if (!line) return;
    link.addEventListener('mouseenter', () => {
      tweenInkUnderline(line, true);
      const ripple = document.createElement('span');
      ripple.className = 'nav-ripple absolute inset-0 rounded-full bg-teal-400/20 pointer-events-none';
      link.appendChild(ripple);
      tweenWaterRipple(ripple);
      window.setTimeout(() => ripple.remove(), 700);
    });
    link.addEventListener('mouseleave', () => tweenInkUnderline(line, false));
  });

  document.querySelectorAll<HTMLElement>('[data-harbour-boat]').forEach((boat) => {
    boat.addEventListener('mouseenter', () => {
      gsap.to(boat, { y: -16, rotation: -4, duration: 0.4, ease: 'back.out(2)' });
    });
    boat.addEventListener('mouseleave', () => {
      gsap.to(boat, { y: 0, rotation: 0, duration: 0.5, ease: 'power2.out' });
    });
  });

  window.addEventListener('hc:wind', ((e: CustomEvent<{ wind: number }>) => {
    document.querySelectorAll('[data-sail]').forEach((sail) => tweenSailLuff(sail, e.detail.wind));
  }) as EventListener);
}
