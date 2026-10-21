import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { en } from './en.js';
import { nl } from './nl.js';
import { site } from '../content/site.js';

const dictionaries = { en, nl };
const I18nContext = createContext(null);

const initialLang = () => {
  try {
    const stored = localStorage.getItem('lang');
    if (stored in dictionaries) return stored;
  } catch {
    // storage unavailable
  }
  return navigator.language?.toLowerCase().startsWith('nl') ? 'nl' : 'en';
};

const lookup = (dict, path) => path.split('.').reduce((node, key) => node?.[key], dict);

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next) => {
    setLangState(next);
    try {
      localStorage.setItem('lang', next);
    } catch {
      // storage unavailable
    }
  }, []);

  const value = useMemo(() => {
    const vars = { name: site.name, year: site.edition };
    const interpolate = (text, extra) =>
      typeof text === 'string'
        ? text.replace(/\{(\w+)\}/g, (_, key) => String(extra?.[key] ?? vars[key] ?? `{${key}}`))
        : text;
    // t() resolves "a.b.c"; arrays/objects are returned as-is (use for lists).
    const t = (path, extra) => interpolate(lookup(dictionaries[lang], path) ?? lookup(en, path) ?? path, extra);
    return { lang, setLang, t };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
