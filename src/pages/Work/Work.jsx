import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import WorkCard from '../../components/WorkCard/WorkCard.jsx';
import { WorkRow } from '../Home/SelectedWork.jsx';
import { useProjects } from '../../context/ProjectsContext.jsx';
import { useI18n } from '../../i18n/I18nContext.jsx';
import { industryOf, sortProjects, uniqueValues } from '../../lib/projects.js';

const INDUSTRY_OPTIONS = ['all', 'web', 'game'];

export default function Work() {
  const { projects } = useProjects();
  const { t } = useI18n();
  const [params, setParams] = useSearchParams();
  const [view, setView] = useState('grid');

  const rawIndustry = params.get('industry');
  const industry = INDUSTRY_OPTIONS.includes(rawIndustry) ? rawIndustry : 'all';
  const category = params.get('category') || '';
  const productType = params.get('productType') || '';
  const projectType = params.get('projectType') || '';
  const sort = params.get('sort') || 'newest';

  const categories = useMemo(() => uniqueValues(projects, 'category'), [projects]);
  const productTypes = useMemo(() => uniqueValues(projects, 'typeOfProduct'), [projects]);
  const projectTypes = useMemo(() => uniqueValues(projects, 'typeOfProject'), [projects]);

  const filtered = useMemo(
    () =>
      sortProjects(
        projects.filter(
          (p) =>
            (industry === 'all' || industryOf(p) === industry) &&
            (!category || p.category === category) &&
            (!productType || p.typeOfProduct === productType) &&
            (!projectType || p.typeOfProject === projectType)
        ),
        sort
      ),
    [projects, industry, category, productType, projectType, sort]
  );

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (value && !(key === 'industry' && value === 'all') && !(key === 'sort' && value === 'newest')) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const select = (key, value, label, options) => (
    <label className="work-filters__select">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(e) => update(key, e.target.value)}>
        <option value="">{label}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );

  return (
    <div className="work-page">
      <section className="page-head container">
        <h1 className="page-head__title hl" data-hero-title>
          {t('work.title')} <em>{t('work.titleEm')}</em>
        </h1>
        <div className="page-head__row">
          <p>{t('work.intro')}</p>
          <p className="label-caps accent" role="status">{t('work.shown', { count: filtered.length })}</p>
        </div>
      </section>

      <section className="work-controls container" aria-label={t('work.filters')}>
        <div className="work-controls__row">
          <div className="pill-group" role="group" aria-label={t('work.industryGroup')}>
            {INDUSTRY_OPTIONS.map((key) => (
              <button key={key} type="button" className="label-caps" aria-pressed={industry === key} onClick={() => update('industry', key)}>
                {t(`work.industry.${key}`)}
              </button>
            ))}
          </div>
          <div className="view-toggle label-caps" role="group" aria-label={t('work.view.group')}>
            {['grid', 'list'].map((key) => (
              <button key={key} type="button" aria-pressed={view === key} onClick={() => setView(key)}>
                {t(`work.view.${key}`)}
              </button>
            ))}
          </div>
        </div>
        <div className="work-controls__row work-filters">
          <div className="work-filters__group">
            {select('category', category, t('work.allCategories'), categories)}
            {select('productType', productType, t('work.allProductTypes'), productTypes)}
            {select('projectType', projectType, t('work.allProjectTypes'), projectTypes)}
          </div>
          <label className="work-filters__sort label-caps">
            <span>{t('work.sort')}</span>
            <select value={sort} onChange={(e) => update('sort', e.target.value)}>
              <option value="newest">{t('work.newest')}</option>
              <option value="oldest">{t('work.oldest')}</option>
              <option value="name">{t('work.name')}</option>
            </select>
          </label>
        </div>
      </section>

      <section className="container work-results">
        {filtered.length === 0 ? (
          <div className="work-empty" role="status">
            <p>{t('work.empty')}</p>
            <button type="button" className="btn label-caps" onClick={() => setParams({}, { replace: true })}>{t('work.reset')}</button>
          </div>
        ) : view === 'grid' ? (
          <ul className="work-grid" key="grid" data-reveal-stagger>
            {filtered.map((p) => <WorkCard key={p.id} project={p} />)}
          </ul>
        ) : (
          <ul className="work-list" key="list" data-reveal-stagger>
            {filtered.map((p, i) => <WorkRow key={p.id} project={p} index={i} />)}
          </ul>
        )}
      </section>
    </div>
  );
}
