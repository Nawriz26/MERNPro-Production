/**
 * DarkModeContext.jsx
 * --------------------
 * Provides global dark/light theme toggling.
 *
 * Features:
 * - Persists theme using localStorage
 * - Toggles CSS classes on <body>:
 *      - 'dark-theme'
 *      - 'light-theme'
 * - Accessible anywhere via `useDarkMode()`
 *
 * Notes:
 * - Works with Navbar toggle button
 * - Automatically reapplies theme on page reload
 */

import { createContext, useContext, useEffect, useState } from 'react';

const DarkModeContext = createContext(null);
export const useDarkMode = () => useContext(DarkModeContext);

export default function DarkModeProvider({ children }) {
  // Load theme from localStorage → default: light mode
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  /**
   * Apply theme to <body> whenever isDark changes.
   * This controls global page colors.
   */
  useEffect(() => {
    const body = document.body;

    if (isDark) {
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
    } else {
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
    }

    // Save theme to localStorage
    localStorage.setItem('darkMode', String(isDark));
  }, [isDark]);

  // Toggle between light and dark themes
  const toggleDarkMode = () => setIsDark((prev) => !prev);

  return (
    <DarkModeContext.Provider value={{ isDark, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}
