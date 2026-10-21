import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Roll from '../Roll/Roll.jsx';
import { useI18n } from '../../i18n/I18nContext.jsx';
import { site } from '../../content/site.js';

export default function Header() {
  const { t, lang, setLang } = useI18n();
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`site-header${stuck ? ' is-stuck' : ''}`}>
      <nav className="site-nav container" aria-label={t('nav.primary')}>
        <Link to="/" className="site-nav__brand" aria-label={site.name}>
          <span className="site-nav__star" aria-hidden="true">✳</span>
          <span>{site.name}</span>
        </Link>

        <ul className="site-nav__links">
          <li><NavLink to="/work"><Roll>{t('nav.work')}</Roll></NavLink></li>
          <li><NavLink to="/contact"><Roll>{t('nav.contact')}</Roll></NavLink></li>
        </ul>

        <div className="site-nav__actions">
          <div className="lang-toggle" role="group" aria-label={t('nav.language')}>
            {['en', 'nl'].map((code) => (
              <button key={code} type="button" aria-pressed={lang === code} onClick={() => setLang(code)}>
                {code.toUpperCase()}
              </button>
            ))}
          </div>
          <a className="site-nav__cta" href={`mailto:${site.email}`} data-magnetic>
            <span className="dot" aria-hidden="true" />
            <span className="label-caps">{t('nav.talk')}</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
