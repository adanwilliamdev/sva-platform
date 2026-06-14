import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, LogOut, User, Bell } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900">SVA</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/jobs" className="text-slate-600 hover:text-slate-900 transition">Vagas</Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="text-slate-600 hover:text-slate-900 transition">Dashboard</Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button className="p-2 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 transition relative">
                  <Bell className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50">
                  <User className="w-4 h-4 text-slate-600" />
                  <span className="text-sm text-slate-700">{user?.full_name?.split(' ')[0]}</span>
                </div>
                <button onClick={logout} className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition shadow-sm">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="px-4 py-2 text-slate-600 hover:text-slate-900">Entrar</Link>
                <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm">Cadastrar</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
