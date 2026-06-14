import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, LayoutDashboard, Users, LogOut, UserCircle, Bell, Search, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${searchQuery}`);
    }
  };

  return (
    <nav className="glass-effect sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="gradient-bg p-2 rounded-xl">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">SVA Platform</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-lg text-secondary hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link to="/jobs" className="flex items-center gap-2 px-4 py-2 rounded-lg text-secondary hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <Briefcase className="w-4 h-4" />
              <span>Vagas</span>
            </Link>
            {isAuthenticated && (
              <Link to="/applications" className="flex items-center gap-2 px-4 py-2 rounded-lg text-secondary hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                <Users className="w-4 h-4" />
                <span>Candidatos</span>
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {/* Global Search */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar vagas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-default rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 text-primary w-64"
                />
              </div>
            </form>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications Bell */}
            <button className="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <Bell className="w-5 h-5 text-secondary" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
                  <UserCircle className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-primary dark:text-white">
                    {user?.full_name?.split(' ')[0]}
                  </span>
                </div>
                <button onClick={handleLogout} className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="px-4 py-2 text-primary border border-default rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                  Entrar
                </Link>
                <Link to="/register" className="px-4 py-2 btn-primary rounded-lg">
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
