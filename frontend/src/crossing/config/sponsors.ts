import type { SponsorLogo } from '../types';

/** Per-boat harbour mooring slot — depth via scale, staggered waterline y */
export const HARBOUR_BOAT_SLOTS: ReadonlyArray<{
  left: string;
  bottom: string;
  width: string;
  scale: number;
  z: number;
  rotate?: number;
}> = [
  { left: '4%', bottom: '1%', width: '3.5rem', scale: 0.68, z: 1, rotate: -4 },
  { left: '16%', bottom: '0%', width: '4.25rem', scale: 0.82, z: 2, rotate: 2 },
  { left: '28%', bottom: '2%', width: '5rem', scale: 0.95, z: 3 },
  { left: '40%', bottom: '0%', width: '5.5rem', scale: 1.08, z: 4 },
  { left: '52%', bottom: '3%', width: '4.5rem', scale: 0.88, z: 3, rotate: -3 },
  { left: '64%', bottom: '1%', width: '3.75rem', scale: 0.72, z: 2, rotate: 5 },
];

export const SPONSORS: SponsorLogo[] = [
  { name: 'Atlantic Tech', slug: 'atlantic-tech', color: '#faf6ee', pennant: '#c0392b', tier: 'flagship' },
  { name: 'Halifax Labs', slug: 'halifax-labs', color: '#e8e0cf', pennant: '#1e3a5f', tier: 'flagship' },
  { name: 'Maritime AI', slug: 'maritime-ai', color: '#0f5e57', pennant: '#fde68a', tier: 'navigator' },
  { name: 'Coast Cloud', slug: 'coast-cloud', color: '#1e3a5f', pennant: '#c0392b', tier: 'navigator' },
  { name: 'Pier Ventures', slug: 'pier-ventures', color: '#0c2340', pennant: '#fde68a', tier: 'crew' },
  { name: 'Nova Dev', slug: 'nova-dev', color: '#e8e0cf', pennant: '#992d22', tier: 'crew' },
];
