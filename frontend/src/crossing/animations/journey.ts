import {
  DURATION_JOURNEY_BOB,
  DURATION_PANEL_CONTENT_SCRUB,
  DURATION_PANEL_FADE,
  DURATION_RAIN_LOOP,
  PARALLAX_SCRUB_JOURNEY,
} from '../config/animation';
import { PANELS } from '../config/panels';
import type { PanelConfig } from '../types';
import { gsap, ScrollTrigger } from '../utils/gsap';
import { tweenBobSlow } from '../utils/motion';
import { initSeaWater } from './water';
import {
  BREAKPOINT_DESKTOP,
  BREAKPOINT_MOBILE,
  BREAKPOINT_REDUCED_MOTION,
  mediaMatches,
} from './matchMedia';

let journeyCtx: gsap.Context | null = null;
let journeyBooted = false;

function voyageMotionPath(route: SVGPathElement, end: number) {
  return {
    motionPath: {
      path: route,
      align: route,
      alignOrigin: [0.5, 0.5],
      autoRotate: false,
      start: 0,
      end,
    },
  };
}

/** Lazy-init when journey section enters view */
export function initJourneyLazy(root: HTMLElement): void {
  const boot = (): void => {
    if (journeyBooted) return;
    journeyBooted = true;
    initJourneyAnimations(root);
  };

  if (mediaMatches(BREAKPOINT_REDUCED_MOTION)) {
    boot();
    return;
  }

  if (root.getBoundingClientRect().top < window.innerHeight * 1.05) {
    boot();
    return;
  }

  ScrollTrigger.create({
    trigger: root,
    start: 'top bottom',
    once: true,
    onEnter: boot,
  });
}

export function initJourneyAnimations(root: HTMLElement): gsap.Context {
  journeyCtx?.revert();
  journeyCtx = gsap.context(() => {
    initSeaWater(root);

    const mm = gsap.matchMedia();

    mm.add(BREAKPOINT_REDUCED_MOTION, () => {
      gsap.set(root.querySelectorAll('[data-panel]'), { opacity: 1 });
      root.querySelectorAll<HTMLElement>('[data-panel]').forEach((panel, i) => {
        const panelConfig = PANELS[i];
        gsap.set(panel.querySelector('.panel-scene__base'), { opacity: 1 });
        gsap.set(panel.querySelector('[data-panel-bg]'), { opacity: 0.48 });
        gsap.set(panel.querySelector('[data-panel-accent]'), { opacity: 0.75 });
        gsap.set(panel.querySelector('[data-panel-rain]'), { opacity: 0.4 });
        gsap.set(panel.querySelector('[data-panel-mid]'), { opacity: 1, x: 0, y: 0, autoAlpha: 1 });
        gsap.set(panel.querySelector('[data-panel-mid-secondary]'), { opacity: 1, x: 0, y: 0, autoAlpha: 1 });
        gsap.set(panel.querySelector('[data-panel-mid-tertiary]'), { opacity: 1, x: 0, y: 0, autoAlpha: 1 });
        const rmScale = parseFloat(panelConfig?.layout.illuScale ?? '1') || 1;
        gsap.set(panel.querySelector('[data-panel-illustration]'), { opacity: 1, xPercent: -50, x: 0, scale: rmScale });
        gsap.set(panel.querySelector('[data-panel-content]'), { opacity: 1, x: 0, y: 0 });
      });
      const route = root.querySelector<SVGPathElement>('[data-voyage-route]');
      const wake = root.querySelector<SVGPathElement>('[data-voyage-wake]');
      if (route) gsap.set(route, { drawSVG: '100%' });
      if (wake) gsap.set(wake, { drawSVG: '100%', opacity: 0.55 });
      const traveler = root.querySelector<SVGGElement>('[data-journey-traveler]');
      if (traveler && route) {
        gsap.set(traveler, { opacity: 1 });
        gsap.set(traveler, voyageMotionPath(route, 1));
      }
    });

    mm.add(BREAKPOINT_DESKTOP, () => {
      if (mediaMatches(BREAKPOINT_REDUCED_MOTION)) return;
      initDesktopJourney(root);
    });

    mm.add(BREAKPOINT_MOBILE, () => {
      if (mediaMatches(BREAKPOINT_REDUCED_MOTION)) return;
      initMobileJourney(root);
    });
  }, root);

  return journeyCtx;
}

function initDesktopJourney(root: HTMLElement): void {
  const section = root;
  const track = section.querySelector<HTMLElement>('[data-journey-wrapper]');
  const panels = gsap.utils.toArray<HTMLElement>('[data-panel]', section);
  if (!track || !panels.length) return;

  root.classList.remove('is-mobile-stack');
  track.classList.add('flex-row');
  track.classList.remove('flex-col');
  gsap.set(track, { x: 0, clearProps: 'y' });

  const panelCount = panels.length;
  section.style.setProperty('--journey-panel-count', String(panelCount));
  track.style.width = `${panelCount * 100}vw`;

  const getScrollDistance = (): number => {
    const panelWidth = panels[0]?.offsetWidth || window.innerWidth;
    return Math.max(panelWidth * (panelCount - 1), window.innerWidth);
  };

  const route = root.querySelector<SVGPathElement>('[data-voyage-route]');
  const wake = root.querySelector<SVGPathElement>('[data-voyage-wake]');
  const traveler = root.querySelector<SVGGElement>('[data-journey-traveler]');

  const scrollTriggerConfig = {
    trigger: section,
    start: 'top top' as const,
    end: () => `+=${getScrollDistance()}`,
    scrub: true,
    invalidateOnRefresh: true,
  };

  const scrollTween = gsap.to(track, {
    x: () => -getScrollDistance(),
    ease: 'none',
    scrollTrigger: {
      ...scrollTriggerConfig,
      pin: true,
      pinType: 'transform',
      anticipatePin: 1,
    },
  });

  if (route) {
    gsap.set(route, { drawSVG: '0%' });
    gsap.to(route, {
      drawSVG: '100%',
      ease: 'none',
      scrollTrigger: { ...scrollTriggerConfig, scrub: true },
    });
  }

  if (wake) {
    gsap.set(wake, { drawSVG: '0%', opacity: 0.45 });
    gsap.to(wake, {
      drawSVG: '100%',
      ease: 'none',
      scrollTrigger: { ...scrollTriggerConfig, scrub: true },
    });
  }

  if (traveler && route) {
    gsap.set(traveler, { opacity: 1, transformOrigin: '50% 50%' });
    gsap.fromTo(traveler, voyageMotionPath(route, 0), {
      ...voyageMotionPath(route, 1),
      ease: 'none',
      scrollTrigger: { ...scrollTriggerConfig, scrub: true },
    });
    gsap.to(traveler, {
      y: 2,
      duration: DURATION_JOURNEY_BOB,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }

  panels.forEach((panel, i) => {
    const config = PANELS[i];
    if (!config) return;

    gsap.set(panel.querySelector('[data-panel-mid]'), { opacity: 1, x: 0, y: 0, autoAlpha: 1 });
    gsap.set(panel.querySelector('[data-panel-mid-secondary]'), { opacity: 1, x: 0, y: 0, autoAlpha: 1 });
    gsap.set(panel.querySelector('[data-panel-mid-tertiary]'), { opacity: 1, x: 0, y: 0, autoAlpha: 1 });

    initPanelWeatherCrossfade(panel, scrollTween);
    initPanelLayers(panel, scrollTween, config);
    initPanelPop(panel, scrollTween);
    if (config.sponsorHarbour) initSponsorHarbour(panel, scrollTween);
  });

  panels.forEach((panel, i) => {
    const config = PANELS[i];
    if (mediaMatches(BREAKPOINT_REDUCED_MOTION)) {
      gsap.set(panel.querySelector('.panel-scene__base'), { opacity: 1 });
      gsap.set(panel.querySelector('[data-panel-bg]'), { opacity: 0.48 });
      gsap.set(panel.querySelector('[data-panel-accent]'), { opacity: 0.75 });
      gsap.set(panel.querySelector('[data-panel-rain]'), { opacity: 0.4 });
    }
    gsap.set(panel.querySelector('[data-panel-content]'), { opacity: 1, x: 0, y: 0 });
    gsap.set(panel.querySelector('[data-panel-title]'), { opacity: 1, y: 0 });
    gsap.set(panel.querySelector('[data-panel-desc]'), { opacity: 1, y: 0 });
    const illuScale = parseFloat(config?.layout.illuScale ?? '1') || 1;
    gsap.set(panel.querySelector('[data-panel-illustration]'), {
      opacity: 1,
      xPercent: -50,
      x: 0,
      scale: illuScale,
    });
  });

  requestAnimationFrame(() => ScrollTrigger.refresh(true));
}

function initPanelWeatherCrossfade(panel: HTMLElement, scrollTween: gsap.core.Tween): void {
  const base = panel.querySelector('.panel-scene__base');
  const tint = panel.querySelector('[data-panel-bg]');
  const accent = panel.querySelector('[data-panel-accent]');
  const rain = panel.querySelector('[data-panel-rain]');
  if (!base && !tint && !accent && !rain) return;

  gsap.set([base, tint, accent, rain].filter(Boolean), { opacity: 0 });

  ScrollTrigger.create({
    trigger: panel,
    containerAnimation: scrollTween,
    start: 'center 78%',
    end: 'center 22%',
    scrub: 0.55,
    onUpdate: (self) => {
      const peak = Math.sin(self.progress * Math.PI);
      const baseOpacity = peak;
      const tintOpacity = peak * 0.58;
      const accentOpacity = peak * 0.92;
      const rainOpacity = peak * 0.55;
      if (base) gsap.set(base, { opacity: baseOpacity });
      if (tint) gsap.set(tint, { opacity: tintOpacity });
      if (accent) gsap.set(accent, { opacity: accentOpacity });
      if (rain) gsap.set(rain, { opacity: rainOpacity });
    },
  });
}

function initPanelLayers(
  panel: HTMLElement,
  scrollTween: gsap.core.Tween,
  config: PanelConfig
): void {
  const bg = panel.querySelector('[data-panel-bg]');
  const illustration = panel.querySelector('[data-panel-illustration]');
  const mid = panel.querySelector('[data-panel-mid]');
  const mid2 = panel.querySelector('[data-panel-mid-secondary]');
  const mid3 = panel.querySelector('[data-panel-mid-tertiary]');
  const fg = panel.querySelector('[data-panel-fg]');
  const accent = panel.querySelector('[data-panel-accent]');
  const chart = panel.querySelector('[data-panel-chart]');
  const content = panel.querySelector('[data-panel-content]');
  const title = panel.querySelector('[data-panel-title]');
  const desc = panel.querySelector('[data-panel-desc]');

  const layerTrigger = {
    trigger: panel,
    containerAnimation: scrollTween,
    scrub: PARALLAX_SCRUB_JOURNEY,
    start: 'left right',
    end: 'right left',
  };

  if (bg) {
    gsap.fromTo(bg, { xPercent: 0 }, { xPercent: config.parallaxBg * 0.12, ease: 'none', scrollTrigger: layerTrigger });
  }

  if (chart) {
    gsap.fromTo(
      chart,
      { y: 4, rotation: -2 },
      { y: -2, rotation: -1, ease: 'none', scrollTrigger: layerTrigger }
    );
  }

  if (illustration) {
    const illuScale = parseFloat(config.layout.illuScale) || 1;
    gsap.fromTo(
      illustration,
      { xPercent: -50, x: 8, scale: illuScale * 0.94 },
      {
        xPercent: -50,
        x: 0,
        scale: illuScale,
        ease: 'none',
        scrollTrigger: {
          trigger: panel,
          containerAnimation: scrollTween,
          scrub: 0.35,
          start: 'left 100%',
          end: 'left 42%',
        },
      }
    );
  }

  if (mid) {
    gsap.fromTo(
      mid,
      { x: -6, y: 4 },
      {
        x: 10,
        y: -6,
        ease: 'none',
        scrollTrigger: {
          trigger: panel,
          containerAnimation: scrollTween,
          scrub: 0.8,
          start: 'left right',
          end: 'right left',
        },
      }
    );
  }

  if (mid2) {
    gsap.fromTo(
      mid2,
      { x: 6, y: -2 },
      {
        x: -8,
        y: 4,
        ease: 'none',
        scrollTrigger: {
          trigger: panel,
          containerAnimation: scrollTween,
          scrub: 0.65,
          start: 'left right',
          end: 'right left',
        },
      }
    );
  }

  if (mid3) {
    gsap.fromTo(
      mid3,
      { x: -4, y: 2 },
      {
        x: 6,
        y: -3,
        ease: 'none',
        scrollTrigger: {
          trigger: panel,
          containerAnimation: scrollTween,
          scrub: 0.55,
          start: 'left right',
          end: 'right left',
        },
      }
    );
  }

  if (fg) {
    gsap.fromTo(
      fg,
      { xPercent: 20 },
      { xPercent: config.parallaxFg * 0.35, ease: 'none', scrollTrigger: layerTrigger }
    );
  }

  if (accent) {
    gsap.fromTo(
      accent,
      { opacity: 0.4 },
      {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: panel,
          containerAnimation: scrollTween,
          scrub: 0.6,
          start: 'left 100%',
          end: 'left 45%',
        },
      }
    );
  }

  if (content) {
    gsap.fromTo(
      content,
      { x: 16 },
      {
        x: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: panel,
          containerAnimation: scrollTween,
          scrub: DURATION_PANEL_CONTENT_SCRUB,
          start: 'left 100%',
          end: 'left 38%',
        },
      }
    );
  }

  if (title) {
    gsap.fromTo(
      title,
      { y: 6 },
      {
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: panel,
          containerAnimation: scrollTween,
          scrub: 0.3,
          start: 'left 100%',
          end: 'left 42%',
        },
      }
    );
  }

  if (desc) {
    gsap.fromTo(
      desc,
      { y: 10 },
      {
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: panel,
          containerAnimation: scrollTween,
          scrub: 0.35,
          start: 'left 95%',
          end: 'left 38%',
        },
      }
    );
  }

  if (config.weather === 'focused-overcast') {
    panel.querySelectorAll('[data-rain-streak]').forEach((drop, i) => {
      const startY = (i % 5) * 22;
      gsap.fromTo(
        drop,
        { y: startY },
        {
          y: startY + 100,
          duration: DURATION_RAIN_LOOP + (i % 4) * 0.12,
          repeat: -1,
          ease: 'none',
        }
      );
    });
  }
}

function initPanelPop(panel: HTMLElement, scrollTween: gsap.core.Tween): void {
  const pop = panel.querySelector<HTMLElement>('[data-journey-pop]');
  if (!pop) return;

  gsap.set(pop, { opacity: 0, scale: 0.86, y: 12, transformOrigin: 'left center' });
  gsap.to(pop, {
    opacity: 1,
    scale: 1,
    y: 0,
    ease: 'back.out(2)',
    scrollTrigger: {
      trigger: panel,
      containerAnimation: scrollTween,
      start: 'left 90%',
      end: 'left 50%',
      scrub: 0.3,
    },
  });
}

function initSponsorHarbour(panel: HTMLElement, scrollTween: gsap.core.Tween): void {
  const boats = panel.querySelectorAll<HTMLElement>('[data-harbour-boat]');
  tweenBobSlow(boats);

  boats.forEach((boat) => {
    boat.addEventListener('mouseenter', () => {
      gsap.to(boat, { y: -18, duration: 0.4, ease: 'back.out(2)' });
      const sail = boat.querySelector('[data-sail]');
      if (sail) gsap.to(sail, { scaleY: 1.2, transformOrigin: 'bottom center', duration: 0.3 });
    });
    boat.addEventListener('mouseleave', () => {
      gsap.to(boat, { y: 0, duration: 0.5, ease: 'power2.out' });
      const sail = boat.querySelector('[data-sail]');
      if (sail) gsap.to(sail, { scaleY: 1, duration: 0.35 });
    });
  });
}

function initMobileJourney(root: HTMLElement): void {
  root.classList.add('is-mobile-stack');
  const wrapper = root.querySelector<HTMLElement>('[data-journey-wrapper]');
  if (!wrapper) return;

  wrapper.classList.remove('flex-row');
  wrapper.classList.add('flex-col');
  gsap.set(wrapper, { x: 0, clearProps: 'transform' });

  const bar = root.querySelector<HTMLElement>('[data-fathom-fill-mobile]');
  if (bar) {
    ScrollTrigger.create({
      trigger: root,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.5,
      onUpdate: (self) => gsap.set(bar, { scaleX: self.progress }),
    });
  }

  gsap.utils.toArray<HTMLElement>('[data-panel]', root).forEach((panel, i) => {
    gsap.set(panel.querySelector('[data-panel-mid]'), { opacity: 1, autoAlpha: 1 });
    gsap.set(panel.querySelector('[data-panel-mid-secondary]'), { opacity: 1, autoAlpha: 1 });
    gsap.set(panel.querySelector('[data-panel-mid-tertiary]'), { opacity: 1, autoAlpha: 1 });
    gsap.set(panel.querySelector('.panel-scene__base'), { opacity: 1 });
    gsap.set(panel.querySelector('[data-panel-bg]'), { opacity: 0.48 });
    gsap.set(panel.querySelector('[data-panel-accent]'), { opacity: 0.75 });
    gsap.set(panel.querySelector('[data-panel-rain]'), { opacity: 0.4 });
    gsap.from(panel, {
      opacity: 0,
      y: 40,
      duration: DURATION_PANEL_FADE,
      ease: 'power3.out',
      scrollTrigger: { trigger: panel, start: 'top 88%', toggleActions: 'play none none reverse' },
      delay: i * 0.03,
    });
  });
}

export function destroyJourneyAnimations(): void {
  journeyCtx?.revert();
  journeyCtx = null;
  journeyBooted = false;
}
