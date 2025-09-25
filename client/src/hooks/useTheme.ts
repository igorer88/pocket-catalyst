import { useCallback, useEffect } from 'react';

import { useGlobalStore } from '@/stores/globalStore';

const Themes = ['light', 'dark'] as const;
type Theme = (typeof Themes)[number];

export const useTheme = (): [Theme, () => void] => {
  const theme = useGlobalStore(state => state.theme);
  const setThemeInStore = useGlobalStore(state => state.setTheme);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      !localStorage.getItem('theme_initialized')
    ) {
      const storedTheme = localStorage.getItem('theme') as Theme | null;
      if (storedTheme && Themes.includes(storedTheme)) {
        setThemeInStore(storedTheme);
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setThemeInStore('dark');
      }
      localStorage.setItem('theme_initialized', 'true');
    }
  }, [setThemeInStore]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeInStore(theme === 'light' ? 'dark' : 'light');
  }, [theme, setThemeInStore]);

  return [theme, toggleTheme];
};
