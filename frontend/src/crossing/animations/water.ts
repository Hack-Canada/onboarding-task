import {
  WATER_FOAM_CAP_FADE_DURATION,
  WATER_GLINT_OPACITY_MAX,
  WATER_GLINT_OPACITY_MIN,
  WATER_GLINT_STAGGER,
  WATER_LAYER_DEEP,
  WATER_LAYER_HORIZON,
  WATER_LAYER_MID,
  WATER_LAYER_SURFACE,
  WATER_REFLECT_DURATION,
  WATER_REFLECT_SKEW,
  WATER_SHEEN_RIPPLE_DURATION,
  WATER_SHEEN_RIPPLE_X,
  HERO_SHIMMER_OPACITY_MAX,
  HERO_SHIMMER_OPACITY_MIN,
} from '../config/animation';
import { gsap } from '../utils/gsap';
import { BREAKPOINT_REDUCED_MOTION, mediaMatches } from './matchMedia';

const BOB: Record<string, { px: number; duration: number; phase: number }> = {
  horizon: { px: WATER_LAYER_HORIZON.bobPx, duration: WATER_LAYER_HORIZON.bobDuration, phase: WATER_LAYER_HORIZON.bobPhase },
  deep: { px: WATER_LAYER_DEEP.bobPx, duration: WATER_LAYER_DEEP.bobDuration, phase: WATER_LAYER_DEEP.bobPhase },
  mid: { px: WATER_LAYER_MID.bobPx, duration: WATER_LAYER_MID.bobDuration, phase: WATER_LAYER_MID.bobPhase },
  surface: { px: WATER_LAYER_SURFACE.bobPx, duration: WATER_LAYER_SURFACE.bobDuration, phase: WATER_LAYER_SURFACE.bobPhase },
};

/** One orchestrated init for all sea-water instances (hero + panels) */
export function initSeaWater(scope: ParentNode = document): void {
  if (mediaMatches(BREAKPOINT_REDUCED_MOTION)) return;

  scope.querySelectorAll<HTMLElement>('[data-harbour-wave]').forEach((track) => {
    gsap.killTweensOf(track);
    const duration = parseFloat(track.dataset.speed ?? '30');
    gsap.set(track, { x: 0, force3D: true });
    gsap.to(track, {
      x: '-50%',
      duration,
      repeat: -1,
      ease: 'none',
    });
  });

  scope.querySelectorAll<HTMLElement>('[data-water-bob]').forEach((layer) => {
    const key = layer.dataset.waterBob ?? 'deep';
    const cfg = BOB[key];
    if (!cfg) return;
    gsap.killTweensOf(layer);
    gsap.set(layer, { y: 0 });
    gsap.to(layer, {
      y: cfg.px,
      duration: cfg.duration,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: cfg.phase,
    });
  });

  scope.querySelectorAll<HTMLElement>('[data-water-sheen]').forEach((sheen) => {
    gsap.killTweensOf(sheen);
    gsap.to(sheen, {
      x: WATER_SHEEN_RIPPLE_X,
      duration: WATER_SHEEN_RIPPLE_DURATION,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  });

  scope.querySelectorAll<HTMLElement>('[data-harbour-shimmer]').forEach((shimmer) => {
    gsap.killTweensOf(shimmer);
    gsap.set(shimmer, { opacity: HERO_SHIMMER_OPACITY_MIN });
    gsap.to(shimmer, {
      opacity: HERO_SHIMMER_OPACITY_MAX,
      duration: 3.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  });

  scope.querySelectorAll<HTMLElement>('[data-water-glint]').forEach((glint, i) => {
    gsap.killTweensOf(glint);
    gsap.set(glint, { opacity: WATER_GLINT_OPACITY_MIN });
    gsap.to(glint, {
      opacity: WATER_GLINT_OPACITY_MAX,
      duration: 1.2 + (i % 3) * 0.3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: i * WATER_GLINT_STAGGER,
    });
  });

  scope.querySelectorAll<SVGElement>('[data-foam-cap-path]').forEach((path, i) => {
    gsap.killTweensOf(path);
    gsap.set(path, { opacity: 0 });
    gsap.to(path, {
      opacity: 0.55,
      duration: WATER_FOAM_CAP_FADE_DURATION,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: (i % 4) * 0.35,
    });
  });

  scope.querySelectorAll<HTMLElement>('[data-water-reflect]').forEach((el) => {
    gsap.killTweensOf(el);
    gsap.to(el, {
      skewX: WATER_REFLECT_SKEW,
      scaleY: 0.42,
      duration: WATER_REFLECT_DURATION,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      transformOrigin: '50% 100%',
    });
  });
}

/** @deprecated use initSeaWater */
export function initHarbourWaves(root: ParentNode): void {
  initSeaWater(root);
}

/** @deprecated use initSeaWater */
export function initPanelWaves(root: ParentNode): void {
  initSeaWater(root);
}
