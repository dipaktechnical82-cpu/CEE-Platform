'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type StudentTheme = 'dark' | 'light';

interface StudentThemeContextValue {
  theme: StudentTheme;
  toggleTheme: () => void;
  setTheme: (theme: StudentTheme) => void;
}

const StudentThemeContext = createContext<StudentThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'cee-student-theme';

export function StudentThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<StudentTheme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as StudentTheme | null;
      if (stored === 'light' || stored === 'dark') {
        setThemeState(stored);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        // default remains 'dark' for the futuristic aesthetic unless user preferred light
      }
    } catch {
      // Ignore storage access errors
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Ignore storage write errors
    }

    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (nextTheme: StudentTheme) => {
    setThemeState(nextTheme);
  };

  return (
    <StudentThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </StudentThemeContext.Provider>
  );
}

export function useStudentTheme(): StudentThemeContextValue {
  const context = useContext(StudentThemeContext);
  if (!context) {
    // Graceful fallback if rendered outside provider
    return {
      theme: 'dark',
      toggleTheme: () => {},
      setTheme: () => {},
    };
  }
  return context;
}
