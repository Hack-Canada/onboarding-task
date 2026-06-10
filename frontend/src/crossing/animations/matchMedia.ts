import { gsap } from '../utils/gsap';
import {
  BREAKPOINT_DESKTOP,
  BREAKPOINT_MOBILE,
  BREAKPOINT_REDUCED_MOTION,
} from '../config/animation';

export type MediaCleanup = () => void;

/** All responsive animation branching lives here */
export function createMatchMedia(): gsap.MatchMedia {
  return gsap.matchMedia();
}

export { BREAKPOINT_DESKTOP, BREAKPOINT_MOBILE, BREAKPOINT_REDUCED_MOTION };

/** GSAP MatchMedia has no .matches() — use the native API */
export function mediaMatches(query: string): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(query).matches;
}
