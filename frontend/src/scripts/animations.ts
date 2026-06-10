import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function revealHero() {
  const hero = document.querySelector<HTMLElement>("[data-hero]");
  if (!hero) return;

  if (reduceMotion) {
    hero.querySelectorAll<HTMLElement>(".reveal-line > span").forEach((line) => {
      line.style.transform = "translateY(0)";
    });
    return;
  }

  const cave = hero.querySelector<HTMLElement>("[data-hero-cave]");
  const heroAssets = hero.querySelectorAll<HTMLElement>("[data-hero-asset]");
  const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

  timeline
    .from(
      cave,
      {
        opacity: 0,
        scale: 1.035,
        filter: "blur(18px)",
        duration: 1.05,
        clearProps: "opacity,scale,filter"
      },
      0
    )
    .from(
      heroAssets,
      {
        opacity: 0,
        y: 18,
        filter: "blur(12px)",
        duration: 0.78,
        stagger: {
          each: 0.16,
          from: "start"
        },
        clearProps: "opacity,transform,filter"
      },
      0.58
    )
    .to(".reveal-line > span", {
      y: 0,
      rotate: 0,
      duration: 1.05,
      stagger: 0.14
    }, 0.72)
    .from(
      "header, .hero-squiggle, .hero-copy, .hero-actions, .hero-features",
      {
        y: 22,
        opacity: 0,
        duration: 0.72,
        stagger: 0.1
      },
      1.05
    );
}

function createHorizontalStory() {
  if (reduceMotion) return;

  document.querySelectorAll<HTMLElement>("[data-horizontal-section]").forEach((section) => {
    const track = section.querySelector<HTMLElement>(".horizontal-track");
    if (!track) return;

    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + window.innerWidth * 0.08);

    gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.9,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    section.querySelectorAll<HTMLElement>(".parallax-layer").forEach((layer) => {
      const depth = Number(layer.dataset.depth ?? 0.12);
      gsap.to(layer, {
        x: () => -distance() * depth,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: true,
          invalidateOnRefresh: true
        }
      });
    });
  });
}

function createScrollParallax() {
  document.querySelectorAll<HTMLElement>("[data-parallax-section]").forEach((section) => {
    const layer = section.querySelector<HTMLElement>("[data-parallax-layer]");
    const copy = section.querySelector<HTMLElement>("[data-parallax-copy]");

    if (layer) {
      if (reduceMotion) {
        layer.style.transform = "scale(1.08)";
      } else {
        gsap.fromTo(
          layer,
          { yPercent: -6, scale: 1.08 },
          {
            yPercent: 7,
            scale: 1.14,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
              invalidateOnRefresh: true
            }
          }
        );
      }
    }

    if (copy && !reduceMotion) {
      gsap.from(copy, {
        y: 36,
        opacity: 0,
        duration: 0.85,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 58%",
          once: true
        }
      });
    }
  });
}

function createStatsAnimation() {
  const stage = document.querySelector<HTMLElement>("[data-stats-stage]");
  if (!stage) return;

  const cards = stage.querySelectorAll<HTMLElement>("[data-stat-card]");
  const values = stage.querySelectorAll<HTMLElement>("[data-stat-value]");
  const shapes = stage.querySelectorAll<HTMLElement>(".stats-shape");
  const section = stage.closest<HTMLElement>("[data-parallax-section]") ?? stage;
  const formatter = new Intl.NumberFormat("en-US");

  values.forEach((value) => {
    const count = Number(value.dataset.count ?? 0);
    value.textContent = reduceMotion ? formatter.format(count) : "0";
  });

  if (reduceMotion) return;

  gsap.set(cards, { transformOrigin: "50% 100%" });

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: stage,
      start: "top 72%",
      once: true
    }
  });

  timeline
    .from(cards, {
      yPercent: 35,
      opacity: 0,
      rotate: -2,
      duration: 0.9,
      stagger: 0.08,
      ease: "back.out(1.35)"
    })
    .from(
      shapes,
      {
        scale: 0,
        opacity: 0,
        rotate: -24,
        duration: 0.75,
        stagger: 0.07,
        ease: "back.out(1.7)"
      },
      0.18
    );

  gsap.to(cards, {
    y: (_index, card: HTMLElement) => Number(card.dataset.scrollY ?? 0),
    scale: (_index, card: HTMLElement) => Number(card.dataset.scrollScale ?? 1),
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "bottom top",
      scrub: 0.8,
      invalidateOnRefresh: true
    }
  });

  values.forEach((value, index) => {
    const count = Number(value.dataset.count ?? 0);
    const counter = { current: 0 };

    timeline.to(
      counter,
      {
        current: count,
        duration: 1.05,
        ease: "power2.out",
        onUpdate: () => {
          value.textContent = formatter.format(Math.round(counter.current));
        }
      },
      0.2 + index * 0.05
    );
  });

  shapes.forEach((shape, index) => {
    gsap.to(shape, {
      y: index % 2 === 0 ? -18 : 16,
      x: index % 2 === 0 ? 12 : -10,
      rotate: index % 2 === 0 ? 12 : -10,
      duration: 4.8 + index * 0.45,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 0.8 + index * 0.08
    });
  });
}

function animateWaterfallFrames() {
  const frames = Array.from(document.querySelectorAll<HTMLElement>("[data-waterfall-frame]"));
  if (frames.length <= 1 || reduceMotion) return;

  let activeIndex = 0;
  frames.forEach((frame, index) => frame.classList.toggle("is-active", index === activeIndex));

  window.setInterval(() => {
    frames[activeIndex]?.classList.remove("is-active");
    activeIndex = (activeIndex + 1) % frames.length;
    frames[activeIndex]?.classList.add("is-active");
  }, 140);
}

function init() {
  revealHero();
  animateWaterfallFrames();
  createScrollParallax();
  createStatsAnimation();
  createHorizontalStory();
  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
}

init();
