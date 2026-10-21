import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext.jsx';
import { site } from '../../content/site.js';

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="site-footer" id="site-footer">
      <div className="site-footer__cta container">
        <p className="label-caps site-footer__open"><span className="dot" aria-hidden="true" /> {t('footer.open')}</p>
        <h2 className="site-footer__title hl" data-reveal>
          {t('footer.title')} <em>{t('footer.titleEm')}</em>
          <span className="site-footer__star" aria-hidden="true">✳</span>
        </h2>
        <Link to="/contact#contact-form" className="btn label-caps" data-magnetic>{t('footer.cta')}</Link>
      </div>
      <div className="site-footer__bar container">
        <Link to="/" className="label-caps">{t('footer.tagline')}</Link>
        <ul className="site-footer__social" aria-label={t('footer.social')}>
          {site.socials.map(({ label, href }) => (
            <li key={label}>
              <a className="label-caps" href={href} target="_blank" rel="noopener noreferrer">{label} ↗</a>
            </li>
          ))}
        </ul>
        <p className="label-caps">© {site.edition}</p>
      </div>
    </footer>
  );
}
