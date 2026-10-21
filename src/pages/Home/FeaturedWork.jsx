import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext.jsx';
import { pad2 } from '../../lib/projects.js';

// Full-screen cards that stack as you scroll (CSS sticky).
export default function FeaturedWork({ projects }) {
  const { t } = useI18n();

  return (
    <section id="featured" className="featured" aria-label={t('featured.label')}>
      <ul>
        {projects.map((project, i) => (
          <li key={project.id} className="featured__item">
            <Link to={`/work/${project.id}`} className="featured__card project-card" aria-label={`${project.projectname} — ${t('featured.view')}`}>
              <img className="featured__image" src={project.projectFeaturedImage} alt="" loading={i === 0 ? 'eager' : 'lazy'} />
              <div className="featured__shade" aria-hidden="true" />
              <div className="featured__body container">
                <span className="label-caps accent featured__index">{pad2(i + 1)} — {pad2(projects.length)}</span>
                <div>
                  <h3 className="featured__title">{project.projectname}</h3>
                  <div className="featured__meta label-caps">
                    <span>{[project.category, project.projectDate].filter(Boolean).join(' / ')}</span>
                    <span className="featured__cta">{t('featured.view')} <span aria-hidden="true">↗</span></span>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
