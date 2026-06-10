import { gsap } from '../utils/gsap';
import { refreshScroll } from '../utils/lenis';

let mobileNavInited = false;
let open = false;

export function initMobileNav(): void {
  if (mobileNavInited) return;
  if (document.documentElement.dataset.mobileNavBound === 'true') return;
  document.documentElement.dataset.mobileNavBound = 'true';
  mobileNavInited = true;

  const toggle = document.querySelector<HTMLButtonElement>('[data-mobile-nav-toggle]');
  const drawer = document.querySelector<HTMLElement>('[data-mobile-nav-drawer]');
  const panel = drawer?.querySelector<HTMLElement>('.mobile-nav-panel');
  const backdrop = drawer?.querySelector<HTMLElement>('[data-mobile-nav-backdrop]');
  if (!toggle || !drawer || !panel || !backdrop) return;

  const setOpen = (next: boolean) => {
    open = next;
    toggle.setAttribute('aria-expanded', String(next));
    toggle.setAttribute('aria-label', next ? 'Close navigation menu' : 'Open navigation menu');
    toggle.classList.toggle('is-open', next);
    drawer.style.pointerEvents = next ? 'auto' : 'none';
    drawer.setAttribute('aria-hidden', String(!next));
    document.body.classList.toggle('mobile-nav-open', next);

    gsap.to(drawer, { opacity: next ? 1 : 0, duration: 0.25, ease: 'power2.out' });
    gsap.to(panel, { x: next ? 0 : '100%', duration: 0.35, ease: next ? 'power3.out' : 'power2.in' });
    gsap.to(backdrop, { opacity: next ? 1 : 0, duration: 0.3 });
  };

  toggle.addEventListener('click', () => setOpen(!open));
  backdrop.addEventListener('click', () => setOpen(false));

    drawer.querySelectorAll<HTMLAnchorElement>('[data-mobile-nav-link]').forEach((link) => {
    link.addEventListener('click', () => {
      if (link.getAttribute('target') === '_blank') {
        setOpen(false);
        return;
      }
      setOpen(false);
      window.setTimeout(() => refreshScroll(), 400);
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) setOpen(false);
  });
}

export function destroyMobileNav(): void {
  document.body.classList.remove('mobile-nav-open');
  mobileNavInited = false;
  open = false;
}
