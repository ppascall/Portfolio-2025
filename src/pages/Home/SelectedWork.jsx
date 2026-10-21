import { Link } from 'react-router-dom';
import Roll from '../../components/Roll/Roll.jsx';
import { useI18n } from '../../i18n/I18nContext.jsx';
import { pad2 } from '../../lib/projects.js';

export function WorkRow({ project, index }) {
  return (
    <li className="work-row" data-reveal-item>
      <Link to={`/work/${project.id}`} className="work-row__link project-card">
        <span className="work-row__num label-caps">{pad2(index + 1)}</span>
        <span className="work-row__title"><Roll>{project.projectname}</Roll></span>
        <span className="work-row__meta label-caps">{project.category}</span>
        <span className="work-row__date label-caps">{project.projectDate}</span>
        <span className="work-row__arrow" aria-hidden="true">↗</span>
      </Link>
    </li>
  );
}

export default function SelectedWork({ projects, total }) {
  const { t } = useI18n();

  return (
    <section className="selected container" aria-labelledby="selected-heading">
      <div className="section-head" data-reveal>
        <h2 id="selected-heading" className="section-head__title serif">{t('selected.title')}</h2>
        <span className="label-caps accent">{t('selected.of', { shown: pad2(projects.length), total })}</span>
      </div>
      <ul className="work-list" data-reveal-stagger>
        {projects.map((project, i) => <WorkRow key={project.id} project={project} index={i} />)}
      </ul>
      <Link to="/work" className="selected__all label-caps" data-reveal>
        {t('selected.all', { total })} <span aria-hidden="true">↗</span>
      </Link>
    </section>
  );
}
