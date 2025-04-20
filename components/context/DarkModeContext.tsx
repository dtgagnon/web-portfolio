"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Types for three-way theme
export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface DarkModeContextProps {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const DarkModeContext = createContext<DarkModeContextProps | undefined>(undefined);

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');
  const [mounted, setMounted] = useState(false);

  // Get system theme
  const getSystemTheme = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  // On mount: read theme from localStorage or default to system
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      setThemeState(stored);
    } else {
      setThemeState('system');
    }
  }, []);

  // Effect: update resolvedTheme and <html> class
  useEffect(() => {
    if (!mounted) return;
    let active: ResolvedTheme = 'light';
    if (theme === 'system') {
      active = getSystemTheme();
    } else {
      active = theme;
    }
    setResolvedTheme(active);
    // Set <html> class
    const root = document.documentElement;
    if (active === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  // Listen for system theme changes if in system mode
  useEffect(() => {
    if (!mounted) return;
    if (theme !== 'system') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setResolvedTheme(mql.matches ? 'dark' : 'light');
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [theme, mounted]);

  // setTheme handler
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  if (!mounted) return null;
  return (
    <DarkModeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const ctx = useContext(DarkModeContext);
  if (!ctx) throw new Error('useDarkMode must be used within DarkModeProvider');
  return ctx;
}
