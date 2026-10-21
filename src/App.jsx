import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import Layout from './components/Layout/Layout.jsx';
import Home from './pages/Home/Home.jsx';
import Work from './pages/Work/Work.jsx';
import CaseStudy from './pages/Project/CaseStudy.jsx';
import Contact from './pages/Contact/Contact.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';

function LegacyProject() {
  const { id } = useParams();
  return <Navigate to={`/work/${id}`} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="work" element={<Work />} />
        <Route path="work/:id" element={<CaseStudy />} />
        <Route path="contact" element={<Contact />} />
        <Route path="bento" element={<Navigate to="/work" replace />} />
        <Route path="project/:id" element={<LegacyProject />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
