/** Seamless tile width — all wavelengths must divide this evenly (300, 200, 150 → 600) */
export const WATER_TILE_WIDTH = 600;
export const WATER_VIEW_HEIGHT = 120;

export interface WaveHarmonic {
  amplitude: number;
  wavelength: number;
  phase: number;
}

export function waveY(x: number, baseY: number, harmonics: WaveHarmonic[]): number {
  let y = baseY;
  for (const h of harmonics) {
    y += h.amplitude * Math.sin((2 * Math.PI * x) / h.wavelength + h.phase);
  }
  return y;
}

/** Closed path for one tile — crest at top, flat bottom; x=0 matches x=TILE for seamless loop */
/** Open crest path (no close) — for foam caps and horizon stroke */
export function buildWaveCrestPathD(baseY: number, harmonics: WaveHarmonic[], steps = 64): string {
  const W = WATER_TILE_WIDTH;
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * W;
    const y = waveY(x, baseY, harmonics);
    pts.push(i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : `L ${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return pts.join(' ');
}

export function buildWavePathD(baseY: number, harmonics: WaveHarmonic[], steps = 64): string {
  const W = WATER_TILE_WIDTH;
  const H = WATER_VIEW_HEIGHT;
  const pts: string[] = [`M 0 ${H}`];
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * W;
    const y = waveY(x, baseY, harmonics);
    pts.push(`L ${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  pts.push(`L ${W} ${H} Z`);
  return pts.join(' ');
}

export function buildWaveTileSvg(
  baseY: number,
  harmonics: WaveHarmonic[],
  fill: string,
  opacity: number,
  stroke?: string
): string {
  const d = buildWavePathD(baseY, harmonics);
  const crestD = buildWaveCrestPathD(baseY, harmonics);
  const strokePath = stroke
    ? `<path d="${crestD}" fill="none" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round"/>`
    : '';
  return `<svg viewBox="0 0 ${WATER_TILE_WIDTH} ${WATER_VIEW_HEIGHT}" preserveAspectRatio="none" aria-hidden="true" class="block w-full h-full"><path d="${d}" fill="${fill}" opacity="${opacity}"/>${strokePath}</svg>`;
}
