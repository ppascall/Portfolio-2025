import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PopImage from '../../components/PopImage/PopImage.jsx';
import WorkCard from '../../components/WorkCard/WorkCard.jsx';
import ProgressStep from './ProgressStep.jsx';
import { useProjects } from '../../context/ProjectsContext.jsx';
import { useI18n } from '../../i18n/I18nContext.jsx';
import { industryOf, sortProjects } from '../../lib/projects.js';

export default function CaseStudy() {
  const { id } = useParams();
  const { projects, error } = useProjects();
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);

  const project = projects.find((p) => String(p.id) === id);

  const related = useMemo(() => {
    if (!project) return [];
    const others = sortProjects(projects.filter((p) => p.id !== project.id), 'newest');
    const sameIndustry = others.filter((p) => industryOf(p) === industryOf(project));
    return (sameIndustry.length ? sameIndustry : others).slice(0, 2);
  }, [projects, project]);

  if (!project) {
    return (
      <section className="page-head container">
        <h1 className="page-head__title hl">{error ? t('project.loadError') : t('project.notFound')}</h1>
        <p><Link to="/work" className="btn label-caps">{t('project.back')}</Link></p>
      </section>
    );
  }

  const body = project.projectBodyText || t('project.noDescription');
  const long = body.length > 320;

  return (
    <article className="case container">
      <header className="case__head">
        <nav aria-label="Breadcrumb" className="case__crumbs label-caps">
          <ol>
            <li><Link to="/">{t('project.home')}</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link to="/work">{t('project.work')}</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{project.projectname}</li>
          </ol>
        </nav>
        <h1 className="case__title">{project.projectname}</h1>
        <p className="case__date label-caps">{[project.category, project.projectDate].filter(Boolean).join(' / ')}</p>
      </header>

      <div className="case__hero" data-reveal>
        <img src={project.projectFeaturedImage} alt={project.projectname} />
      </div>

      <section className="case__info" aria-label={t('project.info')}>
        <div className="case__tools" data-reveal>
          <h2 className="label-caps">{t('project.tools')}</h2>
          <ul>
            {project.projectLanguages.map((lang) => <li key={lang}>{lang}</li>)}
          </ul>
          {project.link && (
            <a className="btn label-caps" href={project.link} target="_blank" rel="noopener noreferrer">{t('project.visit')} ↗</a>
          )}
        </div>
        <div className="case__copy" data-reveal>
          <p className={`case__body${long && !expanded ? ' is-clamped' : ''}`}>{body}</p>
          {long && (
            <button type="button" className="case__more label-caps" aria-expanded={expanded} onClick={() => setExpanded((v) => !v)}>
              {expanded ? t('project.readLess') : t('project.readMore')}
            </button>
          )}
          {project.projectQuote && <blockquote className="case__quote serif">“{project.projectQuote}”</blockquote>}
        </div>
      </section>

      {project.projectProgress.length > 0 && (
        <section className="case__steps" aria-labelledby="steps-heading">
          <h2 id="steps-heading" className="case__heading label-caps" data-reveal>
            <span className="dot" aria-hidden="true" /> {t('project.info')}
          </h2>
          {project.projectProgress.map((step, i) => <ProgressStep key={i} index={i} step={step} />)}
        </section>
      )}

      {project.projectImages.length > 1 && (
        <section className="case__gallery" aria-labelledby="gallery-heading">
          <h2 id="gallery-heading" className="case__heading label-caps" data-reveal>
            <span className="dot" aria-hidden="true" /> {t('project.gallery')}
          </h2>
          <ul className="gallery-grid" data-reveal-stagger>
            {project.projectImages.map((src, i) => (
              <li key={src} data-reveal-item>
                <PopImage src={src} alt={`${project.projectname} — ${i + 1} / ${project.projectImages.length}`} loading="lazy" />
              </li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section className="case__more" aria-labelledby="more-heading">
          <div className="section-head" data-reveal>
            <h2 id="more-heading" className="section-head__title serif">{t('project.more')}</h2>
            <Link to="/work" className="label-caps accent">{t('project.allWork')} ↗</Link>
          </div>
          <ul className="work-grid" data-reveal-stagger>
            {related.map((p) => <WorkCard key={p.id} project={p} />)}
          </ul>
        </section>
      )}
    </article>
  );
}
