import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';
import Preloader from '../Effects/Preloader.jsx';
import Cursor from '../Effects/Cursor.jsx';
import ScrollProgress from '../Effects/ScrollProgress.jsx';
import Konami from '../Effects/Konami.jsx';
import { useProjects } from '../../context/ProjectsContext.jsx';
import { useI18n } from '../../i18n/I18nContext.jsx';
import { ScrollTrigger, useMagnetic, useScrollReveal } from '../../lib/motion.js';

export default function Layout() {
  const { loading } = useProjects();
  const { t } = useI18n();
  const { pathname, hash } = useLocation();

  useScrollReveal([pathname, loading]);
  useMagnetic([pathname, loading]);

  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);

  useEffect(() => {
    if (loading) return;
    if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
    ScrollTrigger.refresh();
  }, [pathname, hash, loading]);

  return (
    <>
      <Preloader ready={!loading} />
      <Cursor />
      <Konami />
      <div className="grain" aria-hidden="true" />
      <ScrollProgress />

      <a href="#main-content" className="skip-link">{t('nav.skip')}</a>
      <div id="sr-announcer" className="sr-only" aria-live="polite" aria-atomic="true" />
      <Header />

      <main id="main-content" tabIndex={-1}>
        {!loading && <Outlet />}
      </main>

      <Footer />
    </>
  );
}
