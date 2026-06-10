import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { SplitText } from 'gsap/SplitText';

let registered = false;

/** Register all GSAP plugins — safe to call every bootstrap */
export function registerGSAP(): void {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, DrawSVGPlugin, SplitText);
  registered = true;
}

/** Create a scoped context — revert on teardown */
export function createAnimContext(
  scope: Element | string,
  fn: (ctx: gsap.Context) => void
): gsap.Context {
  return gsap.context(fn, scope);
}

export function revertContext(ctx: gsap.Context | null | undefined): void {
  ctx?.revert();
}

export { gsap, ScrollTrigger, MotionPathPlugin, DrawSVGPlugin, SplitText };
