import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

function getAutoTheme() {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? 'light' : 'dark';
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('auto'); // 'auto' | 'light' | 'dark'
  const [resolvedTheme, setResolvedTheme] = useState(getAutoTheme());

  useEffect(() => {
    if (mode === 'auto') {
      setResolvedTheme(getAutoTheme());
      const interval = setInterval(() => setResolvedTheme(getAutoTheme()), 60000);
      return () => clearInterval(interval);
    } else {
      setResolvedTheme(mode);
    }
  }, [mode]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
  }, [resolvedTheme]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
