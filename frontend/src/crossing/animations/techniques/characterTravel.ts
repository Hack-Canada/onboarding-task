import { gsap, ScrollTrigger } from '../../utils/gsap';
import { BREAKPOINT_REDUCED_MOTION, mediaMatches } from '../matchMedia';

const bobTweens: gsap.core.Tween[] = [];

function startIdleBob(char: HTMLElement): void {
  const bob = gsap.to(char, {
    y: '+=6',
    duration: 2.2 + Math.random() * 0.8,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut',
  });
  bobTweens.push(bob);
}

export function initCharacterTravel(): void {
  if (mediaMatches(BREAKPOINT_REDUCED_MOTION)) {
    gsap.set('[data-character]', { opacity: 1, x: 0, y: 0 });
    return;
  }

  const characters = gsap.utils.toArray<HTMLElement>('[data-character]');

  characters.forEach((char) => {
    const dir = char.dataset.from ?? 'right';
    const distance =
      dir === 'bottom' ? window.innerHeight * 0.4 : window.innerWidth * 0.55;
    const axis = dir === 'bottom' ? 'y' : 'x';
    const sign = dir === 'left' || dir === 'top' ? -1 : 1;

    gsap.set(char, { [axis]: sign * distance, opacity: 0 });

    const section = char.closest('section') ?? char.closest('[data-journey]') ?? char;

    const enter = () => {
      gsap.to(char, {
        [axis]: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        onComplete: () => startIdleBob(char),
      });
    };

    const leave = () => {
      gsap.killTweensOf(char);
      gsap.to(char, {
        [axis]: -sign * distance * 0.55,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.in',
      });
    };

    const enterBack = () => {
      gsap.to(char, {
        [axis]: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power2.out',
        onComplete: () => startIdleBob(char),
      });
    };

    const leaveBack = () => {
      gsap.killTweensOf(char);
      gsap.to(char, {
        [axis]: sign * distance,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.in',
      });
    };

    ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      onEnter: enter,
      onLeave: leave,
      onEnterBack: enterBack,
      onLeaveBack: leaveBack,
    });
  });
}

export function destroyCharacterTravel(): void {
  bobTweens.forEach((t) => t.kill());
  bobTweens.length = 0;
}
