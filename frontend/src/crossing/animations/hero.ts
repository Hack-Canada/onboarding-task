import {
  DURATION_BEAM_ROTATION,
  DURATION_CASTOFF_SWEEP,
  DURATION_LANTERN_BREATHE,
  DURATION_LANTERN_FOLLOW,
  DURATION_REVEAL_BUTTON,
  DURATION_REVEAL_CHAR,
  DURATION_REVEAL_SUBTITLE,
  EASE_BACK,
  EASE_LAMP,
  EASE_REVEAL,
  HERO_DAWN_ENTRANCE_DURATION,
  HERO_GOD_RAY_DRIFT_DURATION,
  HERO_GOD_RAY_DRIFT_X,
  LANTERN_RADIUS_DESKTOP,
  LANTERN_RADIUS_MOBILE,
  LANTERN_RADIUS_REST,
  PARALLAX_SPEED,
  PARALLAX_SCRUB_HERO,
  STAGGER_CHAR_FROM_CENTER,
} from '../config/animation';
import { gsap, ScrollTrigger, SplitText } from '../utils/gsap';
import { flashElement, tweenBobFast, tweenBobSlow } from '../utils/motion';
import { setupMouseParallax, destroyMouseParallax } from '../utils/mouseParallax';
import { initScrollCompass, revealScrollCompass } from './voyageClock';
import { initSeaWater } from './water';
import { BREAKPOINT_MOBILE, BREAKPOINT_REDUCED_MOTION, mediaMatches } from './matchMedia';

let heroCtx: gsap.Context | null = null;
let phraseSplit: SplitText | null = null;
let lanternCleanup: (() => void) | null = null;
const HERO_PROP_SELECTOR =
  '[data-float-slow], [data-float-fast], [data-compass], [data-buoy], [data-castoff-target], [data-seagull-drift], [data-seagull-secret], [data-character], [data-hero-scatter], [data-parallax="lighthouse"] [data-float-slow]';

export function initHeroAnimations(root: HTMLElement): gsap.Context {
  heroCtx?.revert();
  heroCtx = gsap.context(() => {
    if (mediaMatches(BREAKPOINT_REDUCED_MOTION)) {
      gsap.set('[data-hero-headline], [data-hero-subtitle], [data-hero-tagline], [data-hero-cta], [data-reveal-line]', {
        opacity: 1,
        clearProps: 'filter,transform',
      });
      gsap.set('[data-hero-dawn-bloom]', { opacity: 1, scale: 1 });
      gsap.set('[data-hero-god-ray]', { opacity: 0.32 });
      gsap.set(root.querySelectorAll(HERO_PROP_SELECTOR), { autoAlpha: 1 });
      const compass = document.querySelector<HTMLElement>('[data-scroll-compass]');
      if (compass) {
        gsap.set(compass, { opacity: 1 });
        compass.style.pointerEvents = 'auto';
        compass.removeAttribute('aria-hidden');
      }
      document.documentElement.classList.add('hero-ready');
      return;
    }

    initScrollParallax(root);
    initHeroExitFog(root);
    initLanternReveal(root, mediaMatches(BREAKPOINT_MOBILE));
    showHeroProps(root);

    const master = gsap.timeline({
      onComplete: () => document.documentElement.classList.add('hero-ready'),
    });

    const dawnBloom = root.querySelector<HTMLElement>('[data-hero-dawn-bloom]');
    const godRayContainer = root.querySelector<HTMLElement>('[data-hero-god-rays]');
    const godRays = root.querySelectorAll<HTMLElement>('[data-hero-god-ray]');
    const settleLayers = [
      root.querySelector('[data-parallax="sky"]'),
      root.querySelector('.hero-horizon-haze'),
      root.querySelector('[data-parallax="cloud-far"]'),
      root.querySelector('[data-parallax="cliff-far"]'),
      root.querySelector('[data-parallax="cliff-mid"]'),
      root.querySelector('[data-parallax="cliff"]'),
      root.querySelector('.harbour-water'),
    ].filter(Boolean);

    gsap.set(dawnBloom, { opacity: 0, scale: 0.9, transformOrigin: '50% 57%' });
    gsap.set(godRayContainer, { opacity: 0 });
    gsap.set(godRays, { opacity: 0 });
    gsap.set(settleLayers, { y: 18, opacity: 0.82 });
    gsap.set('[data-hero-subtitle], [data-hero-tagline]', { opacity: 0, y: 16 });
    gsap.set('[data-hero-cta]', { opacity: 0, y: 16, scale: 0.94 });
    gsap.set('[data-reveal-line]', { opacity: 0, y: 10 });

    master.add(() => initHeroWater(root), 0);
    master.to(
      dawnBloom,
      { opacity: 1, scale: 1, duration: HERO_DAWN_ENTRANCE_DURATION, ease: EASE_REVEAL },
      0
    );
    master.to(
      godRayContainer,
      { opacity: 0.85, duration: HERO_DAWN_ENTRANCE_DURATION * 0.9, ease: 'power2.out' },
      0.2
    );
    master.to(
      godRays,
      { opacity: 1, duration: HERO_DAWN_ENTRANCE_DURATION * 0.85, stagger: 0.08, ease: 'power2.out' },
      0.28
    );
    master.add(() => initGodRayDrift(root), HERO_DAWN_ENTRANCE_DURATION * 0.5);
    master.to(settleLayers, {
      y: 0,
      opacity: 1,
      duration: 0.95,
      stagger: 0.05,
      ease: EASE_REVEAL,
    }, 0.1);
    master.to('[data-reveal-line]', { opacity: 1, y: 0, duration: 0.35, ease: EASE_REVEAL }, 0.05);
    master.add(buildHeadlineTimeline(root), 0.12);
    master.to('[data-hero-subtitle]', { opacity: 1, y: 0, duration: 0.45, ease: EASE_REVEAL }, 0.18);
    master.to('[data-hero-tagline]', { opacity: 1, y: 0, duration: 0.4, ease: EASE_REVEAL }, 0.22);
    master.to('[data-hero-cta]', { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: EASE_BACK }, 0.26);
    master.add(() => initAmbientLife(root), 0.22);
    master.add(() => {
      initCastOffBeat(root, () => {
        revealScrollCompass();
      });
    }, 0.32);

    setupMouseParallax();
    initScrollCompass();
  }, root);

  return heroCtx;
}

function showHeroProps(root: HTMLElement): void {
  gsap.set(root.querySelectorAll(HERO_PROP_SELECTOR), { autoAlpha: 1, opacity: 1 });
  gsap.set(root.querySelector('[data-lighthouse-beam]'), { autoAlpha: 0, opacity: 0 });
}

function revealHeroProps(root: HTMLElement): void {
  gsap.set(root.querySelectorAll(HERO_PROP_SELECTOR), { autoAlpha: 1, opacity: 1 });
  gsap.to(root.querySelector('[data-seagull-secret]'), { opacity: 0.7, duration: 0.4, ease: EASE_REVEAL });
}

function initHeroWater(root: HTMLElement): void {
  const waterRoot = root.querySelector<HTMLElement>('[data-sea-water="hero"]');
  if (!waterRoot) return;
  initSeaWater(waterRoot);
}

function initFarCloudDrift(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>('[data-cloud-drift]').forEach((cloud, i) => {
    gsap.to(cloud, {
      x: i % 2 === 0 ? '+=24' : '-=18',
      duration: 42 + i * 6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  });
}

function initGodRayDrift(root: HTMLElement): void {
  const container = root.querySelector<HTMLElement>('[data-hero-god-rays]');
  if (container) {
    gsap.to(container, {
      x: HERO_GOD_RAY_DRIFT_X,
      duration: HERO_GOD_RAY_DRIFT_DURATION,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }
  root.querySelectorAll<SVGElement>('[data-hero-god-ray]').forEach((ray, i) => {
    gsap.to(ray, {
      opacity: 0.75 + i * 0.05,
      duration: HERO_GOD_RAY_DRIFT_DURATION * 0.5 + i * 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  });
}

function initAmbientLife(root: HTMLElement): void {
  tweenBobSlow(root.querySelectorAll('[data-float-slow]'));
  tweenBobFast(root.querySelectorAll('[data-float-fast]'));
  initFarCloudDrift(root);

  const compass = root.querySelector('[data-compass]');
  if (compass) {
    gsap.to(compass, {
      rotation: 12,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      transformOrigin: '50% 50%',
    });
  }

  const lantern = root.querySelector('[data-lantern-glow]');
  if (lantern) {
    gsap.set(lantern, { opacity: 0.75 });
    gsap.to(lantern, {
      opacity: 0.92,
      duration: DURATION_LANTERN_BREATHE,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }

  root.querySelectorAll<HTMLElement>('[data-seagull-drift]').forEach((gull, i) => {
    try {
      const path = [
        { x: 0, y: 0 },
        { x: 30 + i * 8, y: -12 - i * 2 },
        { x: 55 + i * 6, y: 4 },
        { x: 80 + i * 4, y: -18 },
        { x: 110 + i * 3, y: 0 },
      ];
      gsap.to(gull, {
        motionPath: { path, curviness: 1.4 },
        duration: 22 + i * 4,
        repeat: -1,
        ease: 'none',
      });
    } catch {
      gsap.to(gull, {
        x: i % 2 === 0 ? '+=36' : '-=28',
        y: i % 3 === 0 ? '+=8' : '-=6',
        duration: 12 + i * 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }
  });

  initSeagullHC27(root);
}

/** Phrase chars + year block — year stays unbreakable */
function buildHeadlineTimeline(root: HTMLElement): gsap.core.Timeline {
  const headline = root.querySelector<HTMLElement>('[data-hero-headline]');
  const phrase = root.querySelector<HTMLElement>('[data-hero-headline-phrase]');
  const year = root.querySelector<HTMLElement>('.hero-headline-year');
  const tl = gsap.timeline();

  if (!headline || !phrase || !year) {
    if (headline) gsap.set(headline, { opacity: 1 });
    return tl;
  }

  phraseSplit?.revert();
  phraseSplit = SplitText.create(phrase, { type: 'chars' });
  const chars = phraseSplit.chars as HTMLElement[];

  gsap.set(chars, { opacity: 0, filter: 'blur(8px)', y: 12 });
  gsap.set(year, { opacity: 0, filter: 'blur(8px)', y: 12, display: 'inline-block' });

  tl.to(chars, {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    duration: DURATION_REVEAL_CHAR,
    stagger: { each: STAGGER_CHAR_FROM_CENTER, from: 'center' },
    ease: EASE_REVEAL,
  });
  tl.to(
    year,
    {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      duration: DURATION_REVEAL_CHAR * 1.1,
      ease: EASE_REVEAL,
    },
    '-=0.12'
  );
  tl.call(() => {
    chars.forEach((c) => {
      c.style.willChange = 'auto';
    });
    year.style.willChange = 'auto';
  });

  return tl;
}

function initScrollParallax(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>('[data-parallax]').forEach((layer) => {
    const key = layer.dataset.parallax as keyof typeof PARALLAX_SPEED;
    const speed = PARALLAX_SPEED[key] ?? 10;
    if (speed === 0) return;
    gsap.fromTo(
      layer,
      { yPercent: 0 },
      {
        yPercent: -speed,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          scrub: PARALLAX_SCRUB_HERO,
        },
      }
    );
  });
}

function initLanternReveal(root: HTMLElement, isMobile: boolean): void {
  lanternCleanup?.();
  lanternCleanup = null;

  const overlay = root.querySelector<HTMLElement>('[data-lantern-fog]');
  if (!overlay) return;

  const restingRadius = isMobile ? LANTERN_RADIUS_MOBILE + 120 : LANTERN_RADIUS_REST;

  if (isMobile) {
    gsap.set(overlay, { '--lr': `${restingRadius}px`, '--lx': '50%', '--ly': '42%' });
    gsap.to(overlay, {
      '--lr': `${restingRadius + 60}px`,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
    gsap.to(overlay, {
      '--lr': '120vw',
      ease: 'none',
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });
    return;
  }

  const moveX = gsap.quickTo(overlay, '--lx', { duration: 0.2, ease: EASE_LAMP });
  const moveY = gsap.quickTo(overlay, '--ly', { duration: 0.2, ease: EASE_LAMP });
  const moveR = gsap.quickTo(overlay, '--lr', { duration: 0.35, ease: EASE_LAMP });

  let lanternRaf = 0;
  let pendingX = 0;
  let pendingY = 0;

  const paintLantern = () => {
    lanternRaf = 0;
    const r = root.getBoundingClientRect();
    moveX(pendingX - r.left);
    moveY(pendingY - r.top);
    moveR(LANTERN_RADIUS_DESKTOP + 40);
  };

  const onMove = (e: MouseEvent) => {
    pendingX = e.clientX;
    pendingY = e.clientY;
    if (!lanternRaf) lanternRaf = requestAnimationFrame(paintLantern);
  };

  const onLeave = () => {
    if (lanternRaf) cancelAnimationFrame(lanternRaf);
    lanternRaf = 0;
    moveX(root.clientWidth / 2);
    moveY(root.clientHeight * 0.42);
    moveR(LANTERN_RADIUS_REST);
  };

  gsap.set(overlay, {
    '--lx': `${root.clientWidth / 2}px`,
    '--ly': `${root.clientHeight * 0.42}px`,
    '--lr': `${restingRadius}px`,
  });

  root.addEventListener('mousemove', onMove, { passive: true });
  root.addEventListener('mouseleave', onLeave);
  lanternCleanup = () => {
    if (lanternRaf) cancelAnimationFrame(lanternRaf);
    root.removeEventListener('mousemove', onMove);
    root.removeEventListener('mouseleave', onLeave);
  };

  gsap.to(overlay, {
    '--lr': '140vw',
    ease: 'none',
    scrollTrigger: {
      trigger: root,
      start: 'top top',
      end: 'bottom top',
      scrub: 1.2,
    },
  });
}

/** One authored sweep — lighthouse + harbour visible first, then beam */
function initCastOffBeat(root: HTMLElement, onComplete: () => void): void {
  const beam = root.querySelector<HTMLElement>('[data-lighthouse-beam]');
  const overlay = root.querySelector<HTMLElement>('[data-lantern-fog]');
  if (!beam) {
    onComplete();
    return;
  }

  revealHeroProps(root);

  const targets: Array<{ el: Element | null; angle: number }> = [
    { el: root.querySelector('[data-castoff-target="dory"]'), angle: 188 },
    { el: root.querySelector('[data-castoff-target="buoy"]'), angle: 262 },
    { el: root.querySelector('[data-castoff-target="keeper"]'), angle: 132 },
  ];

  const lit = new Set<Element>();
  gsap.set(beam, { rotation: 308, transformOrigin: '50% 100%', autoAlpha: 0, opacity: 0 });

  const tl = gsap.timeline({
    onComplete: () => {
      startLighthouseBeamLoop(root);
      onComplete();
    },
  });

  tl.to(beam, { autoAlpha: 1, opacity: 0.45, duration: 0.25, ease: 'power2.out' }, 0.15);
  tl.to(beam, {
    rotation: 418,
    duration: DURATION_CASTOFF_SWEEP,
    ease: 'power1.inOut',
    onUpdate: function () {
      if ((gsap.getProperty(beam, 'opacity') as number) < 0.1) return;
      const angle = (gsap.getProperty(beam, 'rotation') as number) % 360;
      if (overlay) {
        document.documentElement.style.setProperty(
          '--lantern-warmth',
          String(0.3 + Math.abs(Math.sin((angle * Math.PI) / 180)) * 0.35)
        );
      }
      targets.forEach(({ el, angle: hit }) => {
        if (!el || lit.has(el)) return;
        const delta = Math.min(Math.abs(angle - hit), 360 - Math.abs(angle - hit));
        if (delta < 14) {
          lit.add(el);
          flashElement(el);
          gsap.fromTo(el, { filter: 'brightness(1)' }, { filter: 'brightness(1.35)', duration: 0.5, yoyo: true, repeat: 1 });
        }
      });
    },
  });
  tl.to(beam, { opacity: 0.4, duration: 0.3, ease: 'power2.inOut' }, '-=0.15');
}

function startLighthouseBeamLoop(root: HTMLElement): void {
  const beam = root.querySelector<HTMLElement>('[data-lighthouse-beam]');
  const lighthouse = root.querySelector('[data-parallax="lighthouse"]');
  if (!beam || !lighthouse) return;

  gsap.to(beam, {
    rotation: '+=360',
    duration: DURATION_BEAM_ROTATION,
    repeat: -1,
    ease: 'none',
    transformOrigin: '50% 100%',
    onUpdate: function () {
      if ((gsap.getProperty(beam, 'opacity') as number) < 0.1) return;
      const angle = (gsap.getProperty(beam, 'rotation') as number) % 360;
      document.documentElement.style.setProperty(
        '--lantern-warmth',
        String(0.28 + Math.abs(Math.sin((angle * Math.PI) / 180)) * 0.22)
      );
    },
  });

  gsap.to(beam, {
    opacity: 0.52,
    duration: DURATION_LANTERN_BREATHE,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
}

function initHeroExitFog(root: HTMLElement): void {
  const fog = root.querySelector<HTMLElement>('[data-hero-exit-fog]');
  if (!fog) return;

  gsap.fromTo(
    fog,
    { xPercent: 60, opacity: 0 },
    {
      xPercent: -50,
      opacity: 0.5,
      ease: 'none',
      scrollTrigger: {
        trigger: root,
        start: 'bottom 85%',
        end: 'bottom top',
        scrub: 1,
        onEnter: (self) => {
          if (self.direction === 1) {
            window.dispatchEvent(new CustomEvent('hc:foghorn'));
          }
        },
      },
    }
  );
}

function initSeagullHC27(root: HTMLElement): void {
  const gull = root.querySelector<HTMLElement>('[data-seagull-secret]');
  if (!gull) return;

  try {
    const path = [
      { x: 0, y: 0 },
      { x: 20, y: -15 },
      { x: 40, y: 0 },
      { x: 55, y: -20 },
      { x: 70, y: -5 },
      { x: 85, y: -18 },
      { x: 100, y: 0 },
    ];

    gsap.to(gull, {
      motionPath: { path, curviness: 1.2 },
      duration: 20,
      repeat: -1,
      ease: 'none',
    });
  } catch {
    gsap.to(gull, { x: 40, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  }
}

export function destroyHeroAnimations(): void {
  lanternCleanup?.();
  lanternCleanup = null;
  destroyMouseParallax();
  phraseSplit?.revert();
  phraseSplit = null;
  heroCtx?.revert();
  heroCtx = null;
}
