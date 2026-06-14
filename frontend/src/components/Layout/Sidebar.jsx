import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Briefcase, Users, Calendar, 
  TrendingUp, Award, Settings, FileText, 
  BarChart3, Bell, Star, Clock, Target,
  ChevronLeft, ChevronRight, Sparkles
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();
  const { darkMode } = useTheme();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Visão Geral', badge: null, color: 'text-blue-500' },
    { path: '/dashboard/vagas', icon: Briefcase, label: 'Vagas', badge: '7', color: 'text-emerald-500' },
    { path: '/dashboard/candidaturas', icon: Users, label: 'Candidaturas', badge: '14', color: 'text-purple-500' },
    { path: '/dashboard/analises', icon: TrendingUp, label: 'Análises', badge: null, color: 'text-orange-500' },
    { path: '/dashboard/ranking', icon: Award, label: 'Ranking', badge: null, color: 'text-yellow-500' },
    { path: '/dashboard/entrevistas', icon: Calendar, label: 'Entrevistas', badge: '3', color: 'text-pink-500' },
    { path: '/dashboard/relatorios', icon: BarChart3, label: 'Relatórios', badge: null, color: 'text-cyan-500' },
    { path: '/dashboard/configuracoes', icon: Settings, label: 'Configurações', badge: null, color: 'text-gray-500' },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className={`fixed left-0 top-16 h-full bg-white dark:bg-gray-800/95 backdrop-blur-sm border-r border-default transition-all duration-300 z-40 shadow-xl ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Logo Section */}
      <div className={`p-4 border-b border-default ${isCollapsed ? 'px-2' : ''}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="gradient-bg p-2 rounded-xl shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <p className="text-sm font-bold gradient-text">SVA Platform</p>
              <p className="text-xs text-secondary">Recrutamento com IA</p>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-24 w-6 h-6 rounded-full bg-white dark:bg-gray-700 border border-default shadow-md flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 transition z-50"
      >
        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Menu Items */}
      <nav className="flex-1 py-6 overflow-y-auto h-[calc(100vh-120px)]">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                    active
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-secondary hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? item.color : 'text-secondary'}`} />
                  {!isCollapsed && (
                    <span className="flex-1 text-sm font-medium">{item.label}</span>
                  )}
                  {!isCollapsed && item.badge && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-full shadow-sm">
                      {item.badge}
                    </span>
                  )}
                  {isCollapsed && item.badge && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  )}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                      {item.badge && ` (${item.badge})`}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-default bg-white dark:bg-gray-800/95">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center shadow-md">
            <span className="text-white text-xs font-bold">SVA</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1">
              <p className="text-xs font-medium text-primary dark:text-white">SVA Platform</p>
              <p className="text-xs text-secondary">v2.0.0</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
