import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { resumesAPI } from '../../services/resumes';
import { applicationsAPI } from '../../services/applications';
import { FileText, ClipboardList, Search, PlusCircle, TrendingUp, Award, Briefcase, Star } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CandidateDashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ avgScore: 0, bestMatch: 0 });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [resumesRes, appsRes] = await Promise.all([resumesAPI.getAll(), applicationsAPI.getMy()]);
      setResumes(resumesRes.data);
      setApplications(appsRes.data);
      const scores = appsRes.data.map(app => app.compatibility_score || 0);
      const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      const bestMatch = scores.length > 0 ? Math.max(...scores) : 0;
      setStats({ avgScore: Math.round(avgScore), bestMatch: bestMatch });
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const statsCards = [
    { title: 'Meus Currículos', value: resumes.length, icon: FileText, color: '#2563EB', link: '/resume', linkText: 'Gerenciar Currículos' },
    { title: 'Candidaturas', value: applications.length, icon: ClipboardList, color: '#14B8A6', link: '/applications', linkText: 'Ver Minhas Candidaturas' },
    { title: 'Score Médio', value: `${stats.avgScore}%`, icon: Award, color: '#F59E0B', link: '/applications', linkText: 'Ver Detalhes' },
    { title: 'Melhor Match', value: `${stats.bestMatch}%`, icon: Star, color: '#22C55E', link: '/applications', linkText: 'Ver Melhor' },
  ];

  const scoreHistory = applications.map(app => ({ date: new Date(app.applied_at).toLocaleDateString('pt-BR'), score: app.compatibility_score || 0 })).reverse();

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: `${stat.color}20` }}><stat.icon className="w-6 h-6" style={{ color: stat.color }} /></div>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{stat.title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</p>
            <Link to={stat.link} className="text-blue-600 text-sm font-medium hover:text-blue-700 inline-flex items-center gap-1">{stat.linkText} →</Link>
          </div>
        ))}
      </div>

      {scoreHistory.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📈 Evolução do Score</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={scoreHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" stroke="#475569" />
              <YAxis domain={[0, 100]} stroke="#475569" />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {applications.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">📋 Últimas Candidaturas</h3>
          </div>
          <div className="p-6 space-y-4">
            {applications.slice(0, 5).map((app) => (
              <div key={app.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Vaga #{app.job_id}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${app.status === 'accepted' ? 'bg-green-100 text-green-700' : app.status === 'rejected' ? 'bg-red-100 text-red-700' : app.status === 'reviewed' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {app.status === 'accepted' ? 'Aprovado' : app.status === 'rejected' ? 'Recusado' : app.status === 'reviewed' ? 'Em Análise' : 'Pendente'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${app.compatibility_score >= 80 ? 'bg-green-500' : app.compatibility_score >= 60 ? 'bg-blue-500' : app.compatibility_score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}>{app.compatibility_score || 0}%</div>
                  <div><div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-teal-500" style={{ width: `${app.compatibility_score || 0}%` }}></div></div></div>
                </div>
                <p className="text-xs text-gray-400 mt-2">📅 {new Date(app.applied_at).toLocaleDateString('pt-BR')}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/jobs" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"><Search className="w-5 h-5" /> Buscar Vagas</Link>
        <Link to="/resume" className="inline-flex items-center gap-2 bg-white text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-xl hover:bg-blue-50 transition"><PlusCircle className="w-5 h-5" /> {resumes.length === 0 ? 'Cadastrar Currículo' : 'Atualizar Currículo'}</Link>
      </div>

      {applications.length === 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-12 text-center">
          <Briefcase className="w-20 h-20 text-blue-600 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">🚀 Comece sua jornada!</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{resumes.length === 0 ? 'Cadastre seu primeiro currículo para começar a buscar oportunidades' : 'Explore as vagas disponíveis e encontre a oportunidade perfeita para você'}</p>
          <Link to={resumes.length === 0 ? "/resume" : "/jobs"} className="btn-primary px-6 py-3 rounded-xl inline-flex items-center gap-2">{resumes.length === 0 ? <FileText className="w-5 h-5" /> : <Search className="w-5 h-5" />}{resumes.length === 0 ? 'Cadastrar Currículo' : 'Buscar Vagas'}</Link>
        </div>
      )}
    </div>
  );
};

export default CandidateDashboard;
