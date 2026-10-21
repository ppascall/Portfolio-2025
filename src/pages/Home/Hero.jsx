import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '../../lib/motion.js';
import { useLoaderDone } from '../../lib/loader.js';
import { useI18n } from '../../i18n/I18nContext.jsx';
import { site } from '../../content/site.js';

function useLocalTime(timeZone) {
  const format = () =>
    new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone }).format(new Date());
  const [time, setTime] = useState(format);
  useEffect(() => {
    const id = setInterval(() => setTime(format()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeZone]);
  return time;
}

export default function Hero() {
  const { t } = useI18n();
  const rootRef = useRef(null);
  const loaderDone = useLoaderDone();
  const time = useLocalTime(site.timeZone);

  // Hide intro elements before paint, then play them once the preloader is gone.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.set('[data-hero-line]', { yPercent: 110 });
      gsap.set('[data-hero-fade]', { opacity: 0, y: 24 });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!loaderDone || prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.to('[data-hero-line]', { yPercent: 0, duration: 1.1, stagger: 0.12, ease: 'expo.out' });
      gsap.to('[data-hero-fade]', { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, delay: 0.35, ease: 'expo.out' });
    }, rootRef);
    return () => ctx.revert();
  }, [loaderDone]);

  return (
    <section ref={rootRef} className="hero container" aria-label={t('hero.ariaTitle')}>
      <div className="hero__meta" data-hero-fade>
        <span className="label-caps">{t('hero.eyebrow')}</span>
        <span className="label-caps hero__avail"><span className="dot" aria-hidden="true" />{t('hero.available')}</span>
      </div>

      <h1 className="hero__title" aria-label={t('hero.ariaTitle')}>
        <span className="line-mask" aria-hidden="true">
          <span className="line" data-hero-line>{t('hero.line1')}</span>
        </span>
        <span className="line-mask" aria-hidden="true">
          <span className="line hero__serif" data-hero-line>
            <em>{t('hero.line2')}</em>
            <span className="hero__star">✳</span>
          </span>
        </span>
        <span className="line-mask" aria-hidden="true">
          <span className="line" data-hero-line>
            <em className="hero__soft">{t('hero.line3Prefix')}</em> {t('hero.line3Web')} <em className="hero__soft hero__amp">&amp;</em> {t('hero.line3Game')}
          </span>
        </span>
      </h1>

      <div className="hero__foot" data-hero-fade>
        <div className="hero__intro">
          <p>{t('hero.intro')}</p>
          <p className="hero__konami label-caps">{t('hero.konami')}</p>
        </div>
        <dl className="hero__facts">
          <div>
            <dt className="label-caps">{t('hero.basedIn')}</dt>
            <dd>{t('hero.location')}</dd>
          </div>
          <div>
            <dt className="label-caps">{t('hero.localTime')}</dt>
            <dd className="accent hero__time">{time}</dd>
          </div>
        </dl>
        <a className="hero__scroll label-caps" href="#featured">
          {t('hero.scroll')}
          <span className="hero__scroll-line" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
