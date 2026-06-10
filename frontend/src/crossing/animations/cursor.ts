import { gsap } from '../utils/gsap';
import { BREAKPOINT_DESKTOP, BREAKPOINT_REDUCED_MOTION, mediaMatches } from './matchMedia';

let cursorCtx: gsap.Context | null = null;

const HOVER_SELECTOR =
  'a, button, [data-magnetic], [data-hero-cta], .nav-link, [data-scroll-compass]';

export function initPaperBoatCursor(): gsap.Context {
  cursorCtx?.revert();
  cursorCtx = gsap.context(() => {
    const mm = gsap.matchMedia();

    mm.add(`${BREAKPOINT_DESKTOP}`, () => {
      if (mediaMatches(BREAKPOINT_REDUCED_MOTION)) return;

      const boat = document.querySelector<HTMLElement>('[data-paper-cursor]');
      if (!boat) return;

      gsap.set(boat, { opacity: 0, x: -9999, y: -9999, scale: 1, rotation: 0 });

      let lx = 0;
      let ly = 0;
      let lt = performance.now();
      let visible = false;
      let rafId = 0;
      let pendingX = 0;
      let pendingY = 0;

      const scaleTo = gsap.quickTo(boat, 'scale', { duration: 0.15, ease: 'power2.out' });

      const paint = () => {
        rafId = 0;
        gsap.set(boat, { x: pendingX + 14, y: pendingY + 14 });

        const now = performance.now();
        const dt = Math.max(now - lt, 16);
        const vx = (pendingX - lx) / dt;
        const vy = (pendingY - ly) / dt;
        lx = pendingX;
        ly = pendingY;
        lt = now;

        if (Math.hypot(vx, vy) > 0.05) {
          gsap.set(boat, { rotation: Math.atan2(vy, vx) * (180 / Math.PI) + 90 });
        }
      };

      const showBoat = () => {
        if (!visible) {
          visible = true;
          gsap.to(boat, { opacity: 0.85, duration: 0.15 });
        }
      };

      const onMove = (e: MouseEvent) => {
        pendingX = e.clientX;
        pendingY = e.clientY;
        showBoat();
        if (!rafId) rafId = requestAnimationFrame(paint);
      };

      const onLeave = () => {
        visible = false;
        gsap.to(boat, { opacity: 0, duration: 0.15 });
      };

      const onOver = (e: Event) => {
        const target = (e.target as Element | null)?.closest(HOVER_SELECTOR);
        if (target) {
          boat.classList.add('is-hover-target');
          scaleTo(1.1);
        }
      };

      const onOut = (e: Event) => {
        const related = (e as MouseEvent).relatedTarget as Element | null;
        if (related?.closest(HOVER_SELECTOR)) return;
        boat.classList.remove('is-hover-target');
        scaleTo(1);
      };

      window.addEventListener('mousemove', onMove, { passive: true });
      document.addEventListener('mouseleave', onLeave);
      document.addEventListener('mouseover', onOver, { passive: true });
      document.addEventListener('mouseout', onOut, { passive: true });

      return () => {
        if (rafId) cancelAnimationFrame(rafId);
        window.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseleave', onLeave);
        document.removeEventListener('mouseover', onOver);
        document.removeEventListener('mouseout', onOut);
        boat.classList.remove('is-hover-target');
      };
    });
  });

  return cursorCtx;
}

export function destroyPaperBoatCursor(): void {
  cursorCtx?.revert();
  cursorCtx = null;
}
