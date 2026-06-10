import { BLUENOSE_DURATION, IDLE_TUGBOAT_MS } from '../config/animation';
import { gsap } from '../utils/gsap';
import { BREAKPOINT_DESKTOP, BREAKPOINT_REDUCED_MOTION, mediaMatches } from './matchMedia';

const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

let konamiIndex = 0;
let idleTimer: ReturnType<typeof setTimeout> | null = null;
let tugboatShown = false;
let eggCtx: gsap.Context | null = null;
const cleanups: (() => void)[] = [];

export function initEasterEggs(): gsap.Context {
  destroyEasterEggs();

  eggCtx = gsap.context(() => {
    setupConsoleLogs();
    if (mediaMatches(BREAKPOINT_REDUCED_MOTION)) return;
    setupKonami();
    setupDecember();
    setupIdleTugboat(mediaMatches(BREAKPOINT_DESKTOP));
  });

  return eggCtx;
}

function setupConsoleLogs(): void {
  console.log('fairwindscanblow');

  const loggedSizes = new Set<string>();
  const sizeMessages = [
    { width: 80, height: 16, message: 'wait...no way...mQ7kTgBxE4n | fathom 12 | only the tide is difficult; chart better.' },
    { width: 31, height: 48, message: 'what...how...cQJx8LwH2mE | bearing 045° | only the tide is difficult; chart better.' },
    { width: 44, height: 19, message: "you're kidding...L9mV7nQ4pV0 | log entry 07 | only the tide is difficult; chart better." },
    { width: 52, height: 88, message: 'no shot...u6tRzF2H1sC | time 06:00 | only the tide is difficult; chart better.' },
    { width: 63, height: 37, message: 'seriously?!...b3Kp9zN6wQh | waypoint II | only the tide is difficult; chart better.' },
    { width: 71, height: 102, message: "can't be...nV2tR0mQ8yS | time 14:00 | only the tide is difficult; chart better." },
    { width: 89, height: 24, message: 'hold up...h7Wk1pZ4aJd | wind NE 12kt | only the tide is difficult; chart better.' },
    { width: 96, height: 57, message: 'are you for real...x2Nf8rC5mTa | time 18:30 | only the tide is difficult; chart better.' },
    { width: 127, height: 33, message: "well I'll be...p9Tq3vL2sHk | gangway open | only the tide is difficult; chart better." },
  ];

  const checkExactSize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    sizeMessages.forEach(({ width: targetW, height: targetH, message }) => {
      const key = `${targetW}x${targetH}`;
      if (loggedSizes.has(key)) return;
      if (width === targetW && height === targetH) {
        console.log(message);
        loggedSizes.add(key);
      }
    });
  };

  checkExactSize();
  window.addEventListener('resize', checkExactSize);
  cleanups.push(() => window.removeEventListener('resize', checkExactSize));
}

function setupKonami(): void {
  const onKey = (e: KeyboardEvent) => {
    if (e.key === KONAMI[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === KONAMI.length) {
        konamiIndex = 0;
        triggerBluenose();
      }
    } else {
      konamiIndex = 0;
    }
  };

  document.addEventListener('keydown', onKey);
  cleanups.push(() => document.removeEventListener('keydown', onKey));
}

function triggerBluenose(): void {
  const ship = document.querySelector<HTMLElement>('[data-bluenose]');
  const note = document.querySelector<HTMLElement>('[data-bluenose-note]');
  if (!ship) return;

  gsap.set(ship, { opacity: 1, x: '-20vw' });
  gsap
    .timeline()
    .to(ship, { x: '110vw', duration: BLUENOSE_DURATION, ease: 'none' })
    .to(ship, { opacity: 0, duration: 0.3 }, '-=0.3');

  if (note) {
    gsap.fromTo(note, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    gsap.to(note, { opacity: 0, delay: 4, duration: 0.6 });
  }
}

function setupDecember(): void {
  const month = new Date().getMonth();
  if (month !== 11) return;
  document.body.classList.add('december-mode');
}

function setupIdleTugboat(isDesktop: boolean): void {
  if (!isDesktop) return;

  const resetIdle = () => {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(showTugboat, IDLE_TUGBOAT_MS);
  };

  const events = ['mousemove', 'keydown', 'scroll', 'touchstart'] as const;
  events.forEach((ev) => document.addEventListener(ev, resetIdle, { passive: true }));
  cleanups.push(() => events.forEach((ev) => document.removeEventListener(ev, resetIdle)));
  resetIdle();
}

function showTugboat(): void {
  if (tugboatShown) return;
  tugboatShown = true;
  const tug = document.querySelector<HTMLElement>('[data-tugboat]');
  if (!tug) return;

  gsap.fromTo(
    tug,
    { opacity: 0, x: -40 },
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'power2.out',
      onComplete: () => gsap.set(tug, { opacity: 0 }),
    }
  );
}

export function destroyEasterEggs(): void {
  eggCtx?.revert();
  eggCtx = null;
  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = null;
  cleanups.forEach((fn) => fn());
  cleanups.length = 0;
  konamiIndex = 0;
}
