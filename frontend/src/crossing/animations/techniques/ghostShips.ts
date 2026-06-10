import { ghostShipSvg } from '../../assets/characters';
import { gsap } from '../../utils/gsap';
import { BREAKPOINT_REDUCED_MOTION, mediaMatches } from '../matchMedia';

let spawned = false;
let activeShip: HTMLElement | null = null;
let spawnTimer: ReturnType<typeof setTimeout> | null = null;

function clearSpawnTimer(): void {
  if (spawnTimer) {
    clearTimeout(spawnTimer);
    spawnTimer = null;
  }
}

function spawnGhostShip(container: HTMLElement): void {
  if (mediaMatches(BREAKPOINT_REDUCED_MOTION)) return;
  if (activeShip) return;

  const ship = document.createElement('div');
  ship.className = 'ghost-ship';
  ship.innerHTML = ghostShipSvg;
  ship.style.cssText =
    'position:absolute;bottom:25%;width:60px;height:24px;opacity:0;pointer-events:none;z-index:2';
  container.appendChild(ship);
  activeShip = ship;

  const fromLeft = Math.random() > 0.5;
  const endX = fromLeft ? window.innerWidth + 80 : -80;

  gsap.set(ship, { x: fromLeft ? -80 : window.innerWidth + 80, opacity: 0 });

  gsap
    .timeline({
      onComplete: () => {
        ship.remove();
        activeShip = null;
        clearSpawnTimer();
        spawnTimer = window.setTimeout(
          () => spawnGhostShip(container),
          12_000 + Math.random() * 20_000
        );
      },
    })
    .to(ship, { opacity: 0.12, duration: 4, ease: 'power1.out' }, 0)
    .to(
      ship,
      {
        x: endX,
        duration: 28 + Math.random() * 12,
        ease: 'none',
      },
      0
    )
    .to(ship, { opacity: 0, duration: 4, ease: 'power1.in' }, '-=4');
}

export function initGhostShips(): void {
  if (mediaMatches(BREAKPOINT_REDUCED_MOTION)) return;

  const containers = [
    document.querySelector<HTMLElement>('[data-ghost-ships]'),
    document.querySelector<HTMLElement>('[data-journey]'),
  ].filter(Boolean) as HTMLElement[];

  if (!containers.length) return;

  const start = () => {
    if (spawned) return;
    spawned = true;
    containers.forEach((c) => spawnGhostShip(c));
  };

  document.addEventListener('scroll', start, { once: true, passive: true });
  window.setTimeout(start, 3000);
}

export function destroyGhostShips(): void {
  spawned = false;
  clearSpawnTimer();
  if (activeShip) {
    gsap.killTweensOf(activeShip);
    activeShip.remove();
    activeShip = null;
  }
  document.querySelectorAll('.ghost-ship').forEach((s) => s.remove());
}
