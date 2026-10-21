import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext.jsx';

export default function WorkCard({ project }) {
  const { t } = useI18n();
  return (
    <li className="work-card" data-reveal-item>
      <Link to={`/work/${project.id}`} className="work-card__link project-card" aria-label={`${project.projectname} — ${t('work.viewCase')}`}>
        <div className="work-card__media">
          <img src={project.projectFeaturedImage} alt="" loading="lazy" />
        </div>
        <div className="work-card__info">
          <h3 className="work-card__title">{project.projectname}</h3>
          <p className="work-card__meta label-caps">
            <span>{[project.category, project.projectDate].filter(Boolean).join(' / ')}</span>
            <span className="work-card__cta">{t('work.viewCase')} <span aria-hidden="true">↗</span></span>
          </p>
        </div>
      </Link>
    </li>
  );
}
