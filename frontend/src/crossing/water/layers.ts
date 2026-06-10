import {
  WATER_FOAM_LINE_D,
  WATER_LAYER_DEEP,
  WATER_LAYER_HORIZON,
  WATER_LAYER_MID,
  WATER_LAYER_SURFACE,
} from '../config/animation';
import { buildWaveCrestPathD, buildWavePathD, buildWaveTileSvg, WATER_TILE_WIDTH, WATER_VIEW_HEIGHT } from './waveMath';

export type WaterLayerId = 'horizon' | 'deep' | 'mid' | 'surface';

export function waterLayerTile(layer: WaterLayerId): string {
  switch (layer) {
    case 'horizon':
      return buildWaveTileSvg(
        WATER_LAYER_HORIZON.baseY,
        WATER_LAYER_HORIZON.harmonics,
        WATER_LAYER_HORIZON.fill,
        WATER_LAYER_HORIZON.opacity,
        WATER_LAYER_HORIZON.stroke
      );
    case 'deep':
      return buildWaveTileSvg(
        WATER_LAYER_DEEP.baseY,
        WATER_LAYER_DEEP.harmonics,
        WATER_LAYER_DEEP.fill,
        WATER_LAYER_DEEP.opacity
      );
    case 'mid':
      return buildWaveTileSvg(
        WATER_LAYER_MID.baseY,
        WATER_LAYER_MID.harmonics,
        WATER_LAYER_MID.fill,
        WATER_LAYER_MID.opacity
      );
    case 'surface':
      return buildWaveTileSvg(
        WATER_LAYER_SURFACE.baseY,
        WATER_LAYER_SURFACE.harmonics,
        WATER_LAYER_SURFACE.fill,
        WATER_LAYER_SURFACE.opacity,
        'rgba(250,246,238,0.22)'
      );
  }
}

export function waterFoamLineSvg(): string {
  const d = WATER_FOAM_LINE_D;
  return `<svg viewBox="0 0 ${WATER_TILE_WIDTH} 24" preserveAspectRatio="none" aria-hidden="true" class="block w-full h-full"><path d="${d}" fill="none" stroke="rgba(250,246,238,0.55)" stroke-width="2" stroke-linecap="round"/></svg>`;
}

export function waterFoamCapSvg(): string {
  const crest = buildWaveCrestPathD(WATER_LAYER_SURFACE.baseY, WATER_LAYER_SURFACE.harmonics, 48);
  return `<svg viewBox="0 0 ${WATER_TILE_WIDTH} ${WATER_VIEW_HEIGHT}" preserveAspectRatio="none" aria-hidden="true" class="block w-full h-full"><path data-foam-cap-path d="${crest}" fill="none" stroke="rgba(250,246,238,0.75)" stroke-width="3" stroke-linecap="round" opacity="0"/></svg>`;
}

export const WATER_LAYER_ORDER: WaterLayerId[] = ['horizon', 'deep', 'mid', 'surface'];

export function layerDriftDuration(layer: WaterLayerId): number {
  const map = {
    horizon: WATER_LAYER_HORIZON.driftDuration,
    deep: WATER_LAYER_DEEP.driftDuration,
    mid: WATER_LAYER_MID.driftDuration,
    surface: WATER_LAYER_SURFACE.driftDuration,
  };
  return map[layer];
}
