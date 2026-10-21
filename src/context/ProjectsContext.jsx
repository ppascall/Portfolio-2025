import { createContext, useContext, useEffect, useState } from 'react';

const ProjectsContext = createContext({ projects: [], loading: true, error: null });

export function ProjectsProvider({ children }) {
  const [state, setState] = useState({ projects: [], loading: true, error: null });

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/projects', { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
        return res.json();
      })
      .then((projects) => setState({ projects, loading: false, error: null }))
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ projects: [], loading: false, error });
      });
    return () => controller.abort();
  }, []);

  return <ProjectsContext.Provider value={state}>{children}</ProjectsContext.Provider>;
}

export const useProjects = () => useContext(ProjectsContext);
