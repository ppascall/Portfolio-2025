export const INDUSTRIES = ['web', 'game'];

// Classifies a project as "web" or "game" from its category.
export const industryOf = (project) => {
  const category = (project.category || '').toLowerCase();
  if (category.includes('game')) return 'game';
  if (category.includes('web')) return 'web';
  return 'other';
};

// Distinct values (case-insensitive) of a project property, sorted.
export function uniqueValues(projects, prop) {
  const seen = new Set();
  return projects
    .map((p) => p[prop])
    .filter((value) => {
      if (!value) return false;
      const key = value.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort();
}

const dateValue = (p) => {
  const t = new Date(p.projectDate).getTime();
  return Number.isNaN(t) ? 0 : t;
};

export function sortProjects(projects, sortBy = 'newest') {
  const sorted = [...projects];
  if (sortBy === 'newest') sorted.sort((a, b) => dateValue(b) - dateValue(a));
  else if (sortBy === 'oldest') sorted.sort((a, b) => dateValue(a) - dateValue(b));
  else if (sortBy === 'name') sorted.sort((a, b) => (a.projectname || '').localeCompare(b.projectname || ''));
  return sorted;
}

export const pad2 = (n) => String(n).padStart(2, '0');
