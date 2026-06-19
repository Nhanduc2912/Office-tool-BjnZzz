import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Theme state: dark | light
  const [theme, setTheme] = useState(() => localStorage.getItem('officekit_theme') || 'dark');
  
  // Favorites: array of tool IDs
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('officekit_favorites')) || []; }
    catch { return []; }
  });
  
  // Recent: array of tool IDs (max 5)
  const [recent, setRecent] = useState(() => {
    try { return JSON.parse(localStorage.getItem('officekit_recent')) || []; }
    catch { return []; }
  });

  // Sync Theme to DOM
  useEffect(() => {
    localStorage.setItem('officekit_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Sync Favorites & Recent to LocalStorage
  useEffect(() => { localStorage.setItem('officekit_favorites', JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem('officekit_recent', JSON.stringify(recent)); }, [recent]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  
  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const addRecent = (id) => {
    setRecent(prev => {
      const filtered = prev.filter(f => f !== id);
      return [id, ...filtered].slice(0, 5); // Keep top 5 latest
    });
  };

  return (
    <AppContext.Provider value={{ theme, toggleTheme, favorites, toggleFavorite, recent, addRecent }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
