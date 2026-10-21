import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, prefersReducedMotion } from '../../lib/motion.js';
import { useI18n } from '../../i18n/I18nContext.jsx';

const words = (text) => text.split(/(\s+)/).filter(Boolean);

export default function Approach() {
  const { t, lang } = useI18n();
  const rootRef = useRef(null);
  const segments = t('approach.segments');

  // Words light up one by one while scrolling through the paragraph.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.approach__word',
        { opacity: 0.2 },
        {
          opacity: 1,
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: { trigger: '.approach__text', start: 'top 80%', end: 'bottom 50%', scrub: 0.4 },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, [lang]);

  return (
    <section ref={rootRef} className="approach container" aria-labelledby="approach-heading">
      <h2 id="approach-heading" className="approach__label label-caps"><span className="dot" aria-hidden="true" /> {t('approach.label')}</h2>
      <p className="approach__text serif">
        {segments.map((seg, i) => {
          const inner = words(seg.t).map((w, j) =>
            /^\s+$/.test(w) ? w : <span key={j} className="approach__word">{w}</span>
          );
          if (seg.to) return <Link key={i} to={seg.to} className="approach__link">{inner}</Link>;
          if (seg.em) return <em key={i} className="approach__em">{inner}</em>;
          return <span key={i}>{inner}</span>;
        })}
      </p>
      <p className="approach__aside" data-reveal>{t('approach.aside')}</p>
    </section>
  );
}
