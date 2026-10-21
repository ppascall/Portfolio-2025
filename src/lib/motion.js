import { useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
export const hasFinePointer = () => window.matchMedia?.('(pointer: fine)').matches ?? false;

// Scroll-triggered entrances for [data-reveal] / [data-reveal-stagger] elements on the current page.
export function useScrollReveal(deps) {
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 44, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' } }
        );
      });
      gsap.utils.toArray('[data-reveal-stagger]').forEach((group) => {
        const items = group.querySelectorAll('[data-reveal-item]');
        if (!items.length) return;
        gsap.fromTo(
          items,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.09, ease: 'expo.out', scrollTrigger: { trigger: group, start: 'top 88%', toggleActions: 'play none none none' } }
        );
      });
    });
    ScrollTrigger.refresh();
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// Buttons marked [data-magnetic] lean toward the pointer.
export function useMagnetic(deps) {
  useEffect(() => {
    if (prefersReducedMotion() || !hasFinePointer()) return undefined;
    const cleanups = [];
    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      const move = (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - (rect.left + rect.width / 2)) * 0.35;
        const y = (e.clientY - (rect.top + rect.height / 2)) * 0.35;
        gsap.to(el, { x, y, duration: 0.4, ease: 'power3.out' });
      };
      const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      cleanups.push(() => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
        gsap.set(el, { clearProps: 'x,y' });
      });
    });
    return () => cleanups.forEach((fn) => fn());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
