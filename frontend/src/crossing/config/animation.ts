/** Central animation tokens — no magic numbers in animation files */

export const BREAKPOINT_DESKTOP = '(min-width: 768px)';
export const BREAKPOINT_MOBILE = '(max-width: 767px)';
export const BREAKPOINT_REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

export const EASE_WAVE = 'none' as const;
export const EASE_REVEAL = 'power3.out' as const;
export const EASE_BOB = 'sine.inOut' as const;
export const EASE_BACK = 'back.out(1.7)' as const;
export const EASE_LAMP = 'power2.out' as const;

export const DURATION_WATER_LOOP_SLOW = 8;
export const DURATION_WATER_LOOP_FAST = 5;
export const DURATION_REVEAL_CHAR = 0.5;
export const DURATION_REVEAL_SUBTITLE = 0.85;
export const DURATION_REVEAL_BUTTON = 0.65;
export const DURATION_BOB_SLOW = 4;
export const DURATION_BOB_FAST = 2.5;
export const DURATION_BEAM_ROTATION = 12;
export const DURATION_CASTOFF_SWEEP = 1.6;
export const DURATION_LANTERN_BREATHE = 3;
export const DURATION_LANTERN_FOLLOW = 0.4;

/** Hero intro sequence — fast reveal after preloader */
export const HERO_INTRO_HEADLINE_DELAY = 0.08;
export const HERO_INTRO_SUBTITLE_DELAY = 0.2;
export const HERO_INTRO_TAGLINE_DELAY = 0.28;
export const HERO_INTRO_CTA_DELAY = 0.36;
export const HERO_INTRO_COMPASS_DELAY = 0.55;
export const HERO_INTRO_AMBIENT_DELAY = 0.4;
export const HERO_SCRUB_WORD_FLOOR = 0.42;
export const DURATION_PANEL_FADE = 0.7;
export const DURATION_PANEL_CONTENT_SCRUB = 0.55;
export const DURATION_PANEL_WAVE_LOOP = 7;
export const DURATION_RAIN_LOOP = 1.1;
export const DURATION_JOURNEY_BOB = 1.15;
export const JOURNEY_CHART_VH = 48;
export const JOURNEY_ROUTE_STROKE = 5;
export const JOURNEY_WAKE_STROKE = 18;
export const JOURNEY_BOAT_WIDTH = 96;
export const PARALLAX_MID_LAYER = -70;
export const DURATION_ROUTE_SCRUB = 1.2;
export const DURATION_SPONSOR_HOVER = 0.4;

export const STAGGER_CHAR = 0.03;
export const STAGGER_CHAR_FROM_CENTER = 0.025;
export const STAGGER_TIDE_ROW = 0.08;

export const PARALLAX_SCRUB_HERO = 1;
export const PARALLAX_SCRUB_JOURNEY = 1;

export const LANTERN_RADIUS_DESKTOP = 320;
export const LANTERN_RADIUS_MOBILE = 280;
export const LANTERN_RADIUS_REST = 520;
export const LANTERN_FOG_REST_OPACITY = 0.38;
export const LANTERN_AMBER = 'rgba(255, 200, 100, 0.15)';

export const FLOAT_BOB_SLOW_Y = 20;
export const FLOAT_BOB_FAST_Y = 12;

export const WAKE_POOL_SIZE = 12;
export const WAKE_FADE_MS = 600;

export const IDLE_TUGBOAT_MS = 10_000;
export const BLUENOSE_DURATION = 6;

export const MOUSE_PARALLAX_SKY = -10;
export const MOUSE_PARALLAX_CLOUD_FAR = -6;
export const MOUSE_PARALLAX_CLOUD = -16;
export const MOUSE_PARALLAX_WATER = 12;

/** Per-layer vertical bob (px, sine yoyo) — legacy aliases */
export const HERO_WATER_SPEED_DEEP = 40;
export const HERO_WATER_SPEED_MID = 28;
export const HERO_WATER_SPEED_SURFACE = 18;

export const HERO_WATER_BOB_DEEP = 6;
export const HERO_WATER_BOB_MID = 9;
export const HERO_WATER_BOB_SURFACE = 12;

/* ── Unified sea water module (hero + panels) ── */
export const WATER_TILE_WIDTH = 600;
export const WATER_LINE_Y = 42;
export const WATER_COLOR_DEEP = '#06182e';
export const WATER_COLOR_MID = '#0a2844';
export const WATER_COLOR_SURFACE = '#0f5e57';

export const WATER_LAYER_HORIZON = {
  baseY: 38,
  harmonics: [
    { amplitude: 2, wavelength: 300, phase: 0 },
    { amplitude: 1, wavelength: 150, phase: 1.1 },
  ] as const,
  fill: WATER_COLOR_SURFACE,
  stroke: 'rgba(253,230,138,0.35)',
  opacity: 0.28,
  driftDuration: 50,
  bobDuration: 8,
  bobPx: 2,
  bobPhase: 0,
};

export const WATER_LAYER_DEEP = {
  baseY: 50,
  harmonics: [
    { amplitude: 7, wavelength: 300, phase: 0 },
    { amplitude: 3.5, wavelength: 150, phase: 0.9 },
    { amplitude: 2, wavelength: 200, phase: 1.6 },
  ] as const,
  fill: WATER_COLOR_DEEP,
  opacity: 0.58,
  driftDuration: 40,
  bobDuration: 7.2,
  bobPx: 6,
  bobPhase: 0.3,
};

export const WATER_LAYER_MID = {
  baseY: 54,
  harmonics: [
    { amplitude: 11, wavelength: 200, phase: 0.4 },
    { amplitude: 5, wavelength: 300, phase: 1.2 },
    { amplitude: 3, wavelength: 150, phase: 2.1 },
  ] as const,
  fill: WATER_COLOR_MID,
  opacity: 0.68,
  driftDuration: 28,
  bobDuration: 5.4,
  bobPx: 9,
  bobPhase: 0.8,
};

export const WATER_LAYER_SURFACE = {
  baseY: 58,
  harmonics: [
    { amplitude: 16, wavelength: 150, phase: 0 },
    { amplitude: 8, wavelength: 200, phase: 0.75 },
    { amplitude: 4, wavelength: 300, phase: 1.5 },
  ] as const,
  fill: WATER_COLOR_SURFACE,
  opacity: 0.74,
  driftDuration: 18,
  bobDuration: 4.2,
  bobPx: 12,
  bobPhase: 1.2,
};

export const WATER_SHEEN_RIPPLE_DURATION = 5.5;
export const WATER_SHEEN_RIPPLE_X = 14;
export const WATER_GLINT_COUNT = 6;
export const WATER_GLINT_OPACITY_MIN = 0.15;
export const WATER_GLINT_OPACITY_MAX = 0.85;
export const WATER_GLINT_STAGGER = 0.45;
export const WATER_FOAM_DRIFT_DURATION = 36;
export const WATER_FOAM_CAP_FADE_DURATION = 2.8;
export const WATER_REFLECT_SKEW = 4;
export const WATER_REFLECT_DURATION = 3.6;

/** Foam horizon line path (600-wide tile, y≈waterline) */
export const WATER_FOAM_LINE_D =
  'M0 12 Q150 8 300 12 T600 10';

/** God-ray craft (Phase 1.5) */
export const HERO_GOD_RAY_OPACITY = 0.2;
export const HERO_GOD_RAY_BLUR_PX = 32;
export const HERO_GOD_RAY_DRIFT_DURATION = 26;
export const HERO_GOD_RAY_DRIFT_X = 6;

/** Grain + shimmer */
export const HERO_GRAIN_OPACITY = 0.068;
export const HERO_SHIMMER_OPACITY_MIN = 0.07;
export const HERO_SHIMMER_OPACITY_MAX = 0.13;

export const HERO_CLOUD_FAR_DRIFT_DURATION = 48;
export const HERO_DAWN_ENTRANCE_DURATION = 0.65;

/** Hero layer scroll parallax — percent shift on exit (coherent depth) */
export const PARALLAX_SPEED = {
  sky: 5,
  'cloud-far': 3,
  cloud: 12,
  'cliff-far': 10,
  'cliff-mid': 18,
  cliff: 28,
  water: 6,
  rocks: 34,
  lighthouse: 18,
} as const;

/** Phase 4 — daylight arc, velocity, preloader, breach */
export const DAYLIGHT_SCRUB = 1;
export const WIND_VELOCITY_MAX = 12;
export const WIND_SMOOTH_DURATION = 0.6;
export const PRELOADER_MIN_MS = 0;
export const PRELOADER_SKIP_FADE_MS = 120;
export const PRELOADER_NAV_DELAY_MS = 0;
export const FOG_LAYER_SPEEDS = [0.35, 0.55, 0.85] as const;
export const FOG_LAYER_OPACITIES = [0.12, 0.18, 0.24] as const;
export const COMPANION_SCROLL_OFFSETS = [0.08, 0.42, 0.72, 0.94] as const;
export const STORM_GULL_COUNT = 5;
export const STORM_LIGHTNING_MIN_MS = 4000;
export const STORM_LIGHTNING_MAX_MS = 9000;
export const DAYLIGHT_SKY_OPACITY = 0.58;
export const COMPANION_TRAIL_DOTS = 8;
export const PRELOADER_TYPE_STAGGER = 0.045;

export const BOARDING_ROLES = [
  'Navigator',
  'Lookout',
  'Quartermaster',
  'Rigger',
  'Cook',
] as const;
