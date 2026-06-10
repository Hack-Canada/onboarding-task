import { gsap, ScrollTrigger } from '../../utils/gsap';
import { BREAKPOINT_REDUCED_MOTION, mediaMatches } from '../matchMedia';

const sectionTweens = new Map<HTMLElement, gsap.core.Tween[]>();

export function addAmbientLife(section: HTMLElement): void {
  if (mediaMatches(BREAKPOINT_REDUCED_MOTION)) return;

  const existing = sectionTweens.get(section);
  if (existing) {
    existing.forEach((t) => t.kill());
    sectionTweens.delete(section);
  }

  const tweens: gsap.core.Tween[] = [];

  const rope = section.querySelector<SVGElement>('[data-rope]');
  if (rope) {
    tweens.push(
      gsap.to(rope, {
        rotate: 3,
        skewX: 1,
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        paused: true,
      })
    );
  }

  section.querySelectorAll<HTMLElement>('[data-buoy]').forEach((buoy, i) => {
    tweens.push(
      gsap.to(buoy, {
        y: -8,
        rotate: 4,
        duration: 1.8 + i * 0.4,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: i * 0.6,
        paused: true,
      })
    );
  });

  section.querySelectorAll<HTMLElement>('[data-flag]').forEach((flag, i) => {
    tweens.push(
      gsap.to(flag, {
        skewX: 6,
        scaleX: 0.92,
        duration: 0.4 + (i % 3) * 0.15,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        paused: true,
      })
    );
  });

  if (!tweens.length) return;

  sectionTweens.set(section, tweens);

  const play = () => tweens.forEach((t) => t.play());
  const pause = () => tweens.forEach((t) => t.pause());

  ScrollTrigger.create({
    trigger: section,
    start: 'top bottom',
    end: 'bottom top',
    onEnter: play,
    onLeave: pause,
    onEnterBack: play,
    onLeaveBack: pause,
  });
}

export function destroyAmbientLife(): void {
  sectionTweens.forEach((tweens) => tweens.forEach((t) => t.kill()));
  sectionTweens.clear();
}
