import React from 'react';
import { useTheme } from '../context/ThemeProvider';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button 
      className="theme-toggle" 
      onClick={toggleTheme}
      aria-label="Alternar tema"
    >
      <span className="icon-sun"><Sun size={14} /></span>
      <span className="icon-moon"><Moon size={14} /></span>
      <span className="toggle-thumb" />
    </button>
  );
};

export default ThemeToggle;
