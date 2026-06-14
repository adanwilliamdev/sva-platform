import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
      aria-label="Alternar tema"
    >
      {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};

export default ThemeToggle;
