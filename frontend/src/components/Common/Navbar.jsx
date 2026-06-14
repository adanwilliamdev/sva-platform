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
    <nav className="glass-effect sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <Briefcase className="w-8 h-8 text-blue-600 group-hover:scale-110 transition duration-300" />
            <span className="text-xl font-bold gradient-text">SVA Platform</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Link to="/jobs" className="nav-link flex items-center space-x-1 px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 transition">
              <Briefcase className="w-4 h-4" />
              <span>Vagas</span>
            </Link>
            
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="nav-link flex items-center space-x-1 px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 transition">
                  <Home className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                
                {isRecruiter && (
                  <Link to="/post-job" className="nav-link flex items-center space-x-1 px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 transition">
                    <PlusCircle className="w-4 h-4" />
                    <span>Nova Vaga</span>
                  </Link>
                )}
                
                {isCandidate && (
                  <>
                    <Link to="/resume" className="nav-link flex items-center space-x-1 px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 transition">
                      <FileText className="w-4 h-4" />
                      <span>Meu Currículo</span>
                    </Link>
                    <Link to="/applications" className="nav-link flex items-center space-x-1 px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 transition">
                      <ClipboardList className="w-4 h-4" />
                      <span>Minhas Candidaturas</span>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-emerald-50 px-4 py-2 rounded-full group-hover:scale-105 transition">
                  <UserCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">{user?.full_name?.split(' ')[0]}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-5 py-2 text-blue-600 border-2 border-blue-600 rounded-lg btn-outline font-medium"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 btn-gradient text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
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
