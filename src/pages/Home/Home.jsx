import { useMemo } from 'react';
import Hero from './Hero.jsx';
import Marquee from '../../components/Marquee/Marquee.jsx';
import FeaturedWork from './FeaturedWork.jsx';
import SelectedWork from './SelectedWork.jsx';
import Quiz from './Quiz.jsx';
import Approach from './Approach.jsx';
import Capabilities from './Capabilities.jsx';
import { useProjects } from '../../context/ProjectsContext.jsx';
import { useI18n } from '../../i18n/I18nContext.jsx';
import { sortProjects } from '../../lib/projects.js';

export default function Home() {
  const { projects } = useProjects();
  const { t } = useI18n();
  const sorted = useMemo(() => sortProjects(projects, 'newest'), [projects]);

  return (
    <div className="home">
      <Hero />
      <Marquee items={t('marquee')} />
      {sorted.length > 0 && <FeaturedWork projects={sorted.slice(0, 3)} />}
      {sorted.length > 0 && <SelectedWork projects={sorted.slice(0, 4)} total={sorted.length} />}
      <Quiz />
      <Approach />
      <Capabilities />
    </div>
  );
}
