import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, LogOut, UserCircle, Home, PlusCircle, ClipboardList, FileText } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated, isRecruiter, isCandidate } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold gradient-text">SVA Platform</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Link to="/jobs" className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              Vagas
            </Link>
            
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                  Dashboard
                </Link>
                
                {isRecruiter && (
                  <Link to="/post-job" className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    Nova Vaga
                  </Link>
                )}
                
                {isCandidate && (
                  <>
                    <Link to="/resume" className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                      Meu Currículo
                    </Link>
                    <Link to="/applications" className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                      Minhas Candidaturas
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-blue-50 dark:bg-gray-700 px-4 py-2 rounded-full">
                  <UserCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.full_name?.split(' ')[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="px-5 py-2 text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition">
                  Entrar
                </Link>
                <Link to="/register" className="px-5 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg shadow-md hover:shadow-lg transition">
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
