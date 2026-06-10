/** Single source for event facts — hero, stats, countdown */

export const EVENT = {
  name: 'Hack Canada 2027',
  tagline: 'The Crossing',
  dateLabel: 'June 13–15, 2027',
  dateStart: new Date('2027-06-13T09:00:00-03:00'),
  location: 'Halifax, NS',
  venue: 'Halifax Convention Centre',
  durationHours: 48,
  crewCapacity: 500,
  lat: 44.6488,
  lng: -63.5752,
} as const;

export const VOYAGE_STATS = [
  { label: 'Cast off', value: EVENT.dateLabel, icon: '🌅' },
  { label: 'Under sail', value: `${EVENT.durationHours} hours`, icon: '⏱' },
  { label: 'Harbour', value: EVENT.location, icon: '⚓' },
  { label: 'Berths', value: `${EVENT.crewCapacity}+`, icon: '🧭' },
] as const;
