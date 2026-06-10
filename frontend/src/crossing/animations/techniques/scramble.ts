import { ScrollTrigger } from '../../utils/gsap';
import { BREAKPOINT_REDUCED_MOTION, mediaMatches } from '../matchMedia';

const CHARSET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#@!?~';

const activeByEl = new Map<HTMLElement, ReturnType<typeof setInterval>>();

function scramble(el: HTMLElement): void {
  const existing = activeByEl.get(el);
  if (existing) {
    clearInterval(existing);
    activeByEl.delete(el);
  }

  const final = el.dataset.scrambleText ?? el.textContent ?? '';
  if (!final) return;

  const frames = Math.max(final.length * 3, 12);
  let frame = 0;

  const interval = setInterval(() => {
    el.textContent = final
      .split('')
      .map((char, i) => {
        if (char === ' ') return ' ';
        if (i < (frame / frames) * final.length) return char;
        return CHARSET[Math.floor(Math.random() * CHARSET.length)];
      })
      .join('');

    frame++;
    if (frame > frames) {
      clearInterval(interval);
      activeByEl.delete(el);
      el.textContent = final;
    }
  }, 24);

  activeByEl.set(el, interval);
}

export function initTextScramble(): void {
  if (mediaMatches(BREAKPOINT_REDUCED_MOTION)) return;

  document.querySelectorAll<HTMLElement>('[data-scramble-heading]').forEach((heading) => {
    if (heading.dataset.scrambleBound === 'true') return;
    heading.dataset.scrambleBound = 'true';

    const final = heading.textContent?.trim() ?? '';
    heading.dataset.scrambleText = final;
    heading.textContent = final;

    ScrollTrigger.create({
      trigger: heading,
      start: 'top 80%',
      once: true,
      onEnter: () => scramble(heading),
    });
  });
}

export function destroyTextScramble(): void {
  activeByEl.forEach((interval, el) => {
    clearInterval(interval);
    const final = el.dataset.scrambleText;
    if (final) el.textContent = final;
  });
  activeByEl.clear();
}
