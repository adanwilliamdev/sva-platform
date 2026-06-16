import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900">SVA</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/jobs" className="text-sm text-slate-600 hover:text-slate-900 transition">Vagas</Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="text-sm text-slate-600 hover:text-slate-900 transition">Dashboard</Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-slate-100">
                  <User className="w-4 h-4 text-slate-600" />
                  <span className="text-sm text-slate-700">{user?.full_name?.split(' ')[0]}</span>
                </div>
                <button onClick={logout} className="p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900">Entrar</Link>
                <Link to="/register" className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Cadastrar</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
