import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext.jsx';

export default function NotFound() {
  const { t } = useI18n();
  return (
    <section className="page-head container">
      <h1 className="page-head__title hl">{t('notFound.title')}</h1>
      <p><Link to="/" className="btn label-caps">{t('notFound.back')}</Link></p>
    </section>
  );
}
