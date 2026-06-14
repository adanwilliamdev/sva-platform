import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, LogOut, UserCircle } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
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
            <Link to="/jobs" className="px-4 py-2 rounded-lg text-secondary hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              Vagas
            </Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="px-4 py-2 rounded-lg text-secondary hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                Dashboard
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <ThemeToggle />
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
