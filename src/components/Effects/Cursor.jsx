import { useEffect, useRef } from 'react';
import { gsap, hasFinePointer, prefersReducedMotion } from '../../lib/motion.js';

const HOVER_SELECTOR = 'a, button, [data-cursor-hover], .project-card, select, input, textarea';

// A dot that tracks the pointer plus a ring that trails behind it.
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return undefined;
    const dot = dotRef.current;
    const ring = ringRef.current;
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3.out' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });

    document.body.classList.add('has-custom-cursor');
    const show = (on) => [dot, ring].forEach((el) => el.classList.toggle('is-visible', on));
    const hover = (on) => [dot, ring].forEach((el) => el.classList.toggle('is-hover', on));

    const onMove = (e) => {
      show(true);
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };
    const onOver = (e) => e.target.closest?.(HOVER_SELECTOR) && hover(true);
    const onOut = (e) => e.target.closest?.(HOVER_SELECTOR) && hover(false);
    const onLeave = () => show(false);

    document.addEventListener('pointermove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      document.body.classList.remove('has-custom-cursor');
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="custom-cursor" aria-hidden="true" />
      <div ref={ringRef} className="custom-cursor-follower" aria-hidden="true" />
    </>
  );
}
