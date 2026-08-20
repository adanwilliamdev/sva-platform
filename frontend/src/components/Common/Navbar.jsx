import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-[#0B0A0E]/90 backdrop-blur border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 gradient-bg rounded-full flex items-center justify-center">
              <Briefcase className="w-3.5 h-3.5 text-[#0B0A0E]" />
            </div>
            <span className="font-display text-lg text-slate-900 tracking-wide">SVA</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/jobs" className="text-sm text-slate-600 hover:text-slate-900 transition">Vagas</Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="text-sm text-slate-600 hover:text-slate-900 transition">Dashboard</Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-2 py-1 rounded-sm bg-slate-100 border border-slate-200">
                  <User className="w-4 h-4 text-slate-600" />
                  <span className="text-sm text-slate-700">{user?.full_name?.split(' ')[0]}</span>
                </div>
                <button onClick={logout} className="p-1.5 rounded-sm border border-slate-200 text-slate-500 hover:text-[#F87171] hover:border-[#F87171]/40 transition">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900">Entrar</Link>
                <Link to="/register" className="px-3 py-1.5 text-sm bg-blue-600 text-[#0B0A0E] font-semibold rounded-sm hover:bg-blue-500 transition">Cadastrar</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
