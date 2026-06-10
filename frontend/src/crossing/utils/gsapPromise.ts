import type gsap from 'gsap';

/** Await a GSAP tween/timeline — always resolves (timeout fallback). */
export function tweenToPromise(
  tween: gsap.core.Tween | gsap.core.Timeline,
  timeoutMs = 5000
): Promise<void> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };

    const timer = window.setTimeout(finish, timeoutMs);
    tween.eventCallback('onComplete', () => {
      window.clearTimeout(timer);
      finish();
    });
  });
}
