import { useState } from 'react';
import PopImage from '../../components/PopImage/PopImage.jsx';
import { useI18n } from '../../i18n/I18nContext.jsx';
import { site } from '../../content/site.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  const { t } = useI18n();
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const submit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const from = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();

    if (!name || !EMAIL_RE.test(from) || !message) {
      setStatus({ type: 'error', message: t('contact.invalid') });
      return;
    }
    // Hidden "Company" field: bots fill it in, people never see it.
    if (data.get('company')) {
      setStatus({ type: 'success', message: t('contact.sent') });
      return;
    }

    setStatus({ type: 'sending', message: t('contact.sending') });
    try {
      const res = await fetch('/api/send-contact-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, from, message }),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      form.reset();
      setStatus({ type: 'success', message: t('contact.sent') });
    } catch {
      setStatus({ type: 'error', message: t('contact.error') });
    }
  };

  const [main, ...rest] = site.contactPhotos;
  const bio = t('contact.bio');

  return (
    <div className="contact-page">
      <section className="page-head container">
        <h1 className="page-head__title hl">
          {t('contact.title')} <em>{t('contact.titleEm')}</em>
        </h1>
        <div className="page-head__row">
          <p>{t('contact.intro')}</p>
        </div>
      </section>

      <section className="about container" aria-labelledby="about-heading">
        <figure className="about__photos" aria-label={t('contact.photos')} data-reveal>
          <PopImage className="about__main" src={main.src} alt={main.alt} />
          <div className="about__thumbs">
            {rest.map((photo) => <PopImage key={photo.src} src={photo.src} alt={photo.alt} />)}
          </div>
        </figure>

        <div className="about__text" data-reveal>
          <h2 id="about-heading" className="about__name serif">{site.name}</h2>
          <p className="about__role label-caps accent">{t('contact.role')}</p>
          {bio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <p className="about__fun">{t('contact.fun')}</p>

          <dl className="about__facts">
            <div>
              <dt className="label-caps">{t('contact.email')}</dt>
              <dd><a href={`mailto:${site.email}`}>{site.email}</a></dd>
            </div>
            <div>
              <dt className="label-caps">{t('contact.basedIn')}</dt>
              <dd>{t('contact.location')}</dd>
            </div>
            {site.socials.map(({ label, href }) => (
              <div key={label}>
                <dt className="label-caps">{label}</dt>
                <dd><a href={href} target="_blank" rel="noopener noreferrer">{href.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</a></dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="contact-form" className="contact-form container" aria-labelledby="form-heading">
        <div className="contact-form__intro" data-reveal>
          <h2 id="form-heading" className="serif">{t('contact.formTitle')}</h2>
          <p>{t('contact.formIntro')}</p>
        </div>

        <form className="contact-form__form" onSubmit={submit} noValidate data-reveal>
          <label>
            <span className="label-caps">{t('contact.name')}</span>
            <input name="name" type="text" autoComplete="name" required />
          </label>
          <label>
            <span className="label-caps">{t('contact.emailLabel')}</span>
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            <span className="label-caps">{t('contact.message')}</span>
            <textarea name="message" rows={5} required />
          </label>
          <label className="contact-form__trap" aria-hidden="true">
            {t('contact.company')}
            <input name="company" type="text" tabIndex={-1} autoComplete="off" />
          </label>

          <div className="contact-form__actions">
            <button type="submit" className="btn label-caps" disabled={status.type === 'sending'} data-magnetic>
              {status.type === 'sending' ? t('contact.sending') : t('contact.send')}
            </button>
            <a className="contact-form__direct label-caps" href={`mailto:${site.email}`}>{t('contact.direct')}</a>
          </div>
          <p className={`contact-form__status${status.type === 'error' ? ' is-error' : ''}`} role="status">
            {status.type === 'success' || status.type === 'error' ? status.message : ''}
          </p>
        </form>
      </section>
    </div>
  );
}
