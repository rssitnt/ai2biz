'use client';

import { createContext, useContext, useEffect } from 'react';

type ThemeProviderProps = {
  children: React.ReactNode;
};

type ThemeProviderState = {
  theme: 'dark';
};

const initialState: ThemeProviderState = {
  theme: 'dark',
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({ children }: ThemeProviderProps) {
  useEffect(() => {
    // Принудительно устанавливаем темную тему и темную цветовую схему
    document.documentElement.setAttribute('data-theme', 'dark');
    // Принудительно добавляем темные классы
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark-mode');
    
    // Удаляем возможные классы светлой темы
    document.documentElement.classList.remove('light');
    document.body.classList.remove('light-mode');
    
    // Устанавливаем мета-тег для цветовой схемы
    const metaTheme = document.head.querySelector('meta[name="color-scheme"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', 'dark');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'color-scheme';
      meta.content = 'dark';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <ThemeProviderContext.Provider value={{ theme: 'dark' }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}; 