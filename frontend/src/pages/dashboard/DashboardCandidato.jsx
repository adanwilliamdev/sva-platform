import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { applicationsAPI } from '../../services/applications';
import { resumesAPI } from '../../services/resumes';
import { useAuth } from '../../context/AuthContext';
import { FileText, ClipboardList, TrendingUp, Star, Eye, Calendar } from 'lucide-react';

const DashboardCandidato = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('📡 Buscando dados do candidato...');
      const [resumesRes, appsRes] = await Promise.all([
        resumesAPI.getAll(),
        applicationsAPI.getMy()
      ]);
      console.log('📥 Currículos:', resumesRes.data);
      console.log('📥 Candidaturas:', appsRes.data);
      setResumes(resumesRes.data);
      setApplications(appsRes.data);
    } catch (error) {
      console.error('❌ Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const avgScore = applications.length > 0 
    ? (applications.reduce((a, b) => a + (b.compatibility_score || 0), 0) / applications.length).toFixed(0) 
    : 0;
  const bestScore = applications.length > 0 
    ? Math.max(...applications.map(a => a.compatibility_score || 0)) 
    : 0;

  const getStatusText = (status) => {
    const map = { 
      accepted: 'Aprovado', 
      rejected: 'Recusado', 
      reviewed: 'Em análise', 
      pending: 'Pendente' 
    };
    return map[status] || status;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'accepted': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'reviewed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-slate-500">Carregando...</p>
      </div>
    );
  }

  const stats = [
    { title: 'Currículos', value: resumes.length, icon: FileText, color: 'bg-blue-50 text-blue-600', link: '/resume', linkText: 'Gerenciar' },
    { title: 'Candidaturas', value: applications.length, icon: ClipboardList, color: 'bg-emerald-50 text-emerald-600', link: '/applications', linkText: 'Ver todas' },
    { title: 'Score Médio', value: `${avgScore}%`, icon: TrendingUp, color: 'bg-purple-50 text-purple-600' },
    { title: 'Melhor Score', value: `${bestScore}%`, icon: Star, color: 'bg-orange-50 text-orange-600' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Olá, {user?.full_name?.split(' ')[0] || 'Candidato'}! 👋</h1>
          <p className="text-slate-500 text-sm">Acompanhe suas candidaturas</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('pt-BR')}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            {stat.link && (
              <Link to={stat.link} className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                {stat.linkText} →
              </Link>
            )}
          </div>
        ))}
      </div>

      {applications.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold text-slate-900">📋 Últimas Candidaturas</h3>
              <p className="text-xs text-slate-500">Suas candidaturas mais recentes</p>
            </div>
            <Link to="/applications" className="text-sm text-blue-600 hover:underline font-medium">
              Ver todas →
            </Link>
          </div>
          {applications.slice(0, 5).map(app => (
            <div key={app.id} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 -mx-4 px-4 rounded-lg transition">
              <div>
                <p className="font-medium text-slate-900">Vaga #{app.job_id}</p>
                <p className="text-xs text-slate-500">{new Date(app.applied_at).toLocaleDateString('pt-BR')}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-blue-600">{app.compatibility_score || 0}%</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                  {getStatusText(app.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {applications.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <ClipboardList className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">Nenhuma candidatura ainda</p>
          <p className="text-slate-400 text-sm">Comece a buscar vagas agora!</p>
          <Link to="/jobs" className="mt-4 inline-block btn-primary">🔍 Buscar Vagas</Link>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Link to="/jobs" className="btn-primary justify-center">🔍 Buscar Vagas</Link>
        <Link to="/resume" className="btn-outline justify-center">📄 Atualizar Currículo</Link>
      </div>
    </div>
  );
};

export default DashboardCandidato;
