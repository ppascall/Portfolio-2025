import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '../../lib/motion.js';
import { loader } from '../../lib/loader.js';
import { site } from '../../content/site.js';

// Full-screen intro shown on the first visit; waits until data has loaded.
export default function Preloader({ ready }) {
  const rootRef = useRef(null);
  const countRef = useRef(null);
  const fillRef = useRef(null);
  const [minElapsed, setMinElapsed] = useState(false);
  const [gone, setGone] = useState(false);
  const skip = useRef(prefersReducedMotion()).current;
  const words = site.name.split(' ');

  useLayoutEffect(() => {
    if (skip) return undefined;
    document.documentElement.style.overflow = 'hidden';
    const state = { value: 0 };
    const ctx = gsap.context(() => {
      gsap.from('[data-loader-word]', { yPercent: 110, duration: 0.9, stagger: 0.12, ease: 'expo.out' });
      gsap.to(state, {
        value: 100,
        duration: 1.6,
        ease: 'power2.inOut',
        onUpdate: () => {
          countRef.current.textContent = String(Math.round(state.value)).padStart(3, '0');
          fillRef.current.style.transform = `scaleX(${state.value / 100})`;
        },
        onComplete: () => setMinElapsed(true),
      });
    }, rootRef);
    return () => ctx.revert();
  }, [skip]);

  useEffect(() => {
    if (skip) {
      loader.finish();
      setGone(true);
      return;
    }
    if (!ready || !minElapsed) return;
    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.style.overflow = '';
        setGone(true);
      },
    });
    tl.to('[data-loader-word]', { yPercent: -110, duration: 0.6, stagger: 0.06, ease: 'expo.in' })
      .to(rootRef.current, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '-=0.2')
      .add(() => loader.finish(), '-=0.55');
  }, [ready, minElapsed, skip]);

  if (gone) return null;

  return (
    <div ref={rootRef} className="preloader" role="status" aria-live="polite">
      <div className="preloader__inner">
        <p className="preloader__name" aria-label={site.name}>
          {words.map((word) => (
            <span key={word} className="line-mask" aria-hidden="true">
              <span className="line" data-loader-word>{word}</span>
            </span>
          ))}
        </p>
        <div className="preloader__meta label-caps">
          <span>{site.name}</span>
          <span ref={countRef} className="preloader__count">000</span>
        </div>
        <div className="preloader__bar">
          <span ref={fillRef} className="preloader__bar-fill" />
        </div>
      </div>
    </div>
  );
}
