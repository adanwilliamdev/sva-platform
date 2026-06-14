import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobsAPI } from '../services/jobs';
import { applicationsAPI } from '../services/applications';
import { resumesAPI } from '../services/resumes';
import { Briefcase, Users, TrendingUp, Award, Eye, PlusCircle, FileText, ClipboardList, Star, Clock, CheckCircle, XCircle, Building2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#22C55E', '#3B82F6', '#F59E0B', '#EF4444'];

// Dashboard do Recrutador
const RecruiterDashboard = ({ jobs, applications }) => {
  const totalApps = applications.length;
  const activeJobs = jobs.filter(j => j.is_active === 1).length;
  const acceptedApps = applications.filter(a => a.status === 'accepted').length;
  const approvalRate = totalApps > 0 ? ((acceptedApps / totalApps) * 100).toFixed(0) : 0;

  // Agrupar vagas únicas
  const uniqueJobs = jobs.reduce((acc, job) => {
    if (!acc.find(j => j.id === job.id)) {
      acc.push(job);
    }
    return acc;
  }, []);

  const trendData = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const count = applications.filter(a => new Date(a.applied_at).toDateString() === date.toDateString()).length;
      last7Days.push({ date: date.toLocaleDateString('pt-BR', { weekday: 'short' }), count });
    }
    return last7Days;
  };

  const maxCount = Math.max(...trendData().map(d => d.count), 1);
  const yAxisMax = maxCount + Math.ceil(maxCount * 0.2);

  const jobRanking = uniqueJobs.map(job => ({
    id: job.id,
    title: job.title,
    count: applications.filter(a => a.job_id === job.id).length,
    company: job.company
  })).sort((a, b) => b.count - a.count).slice(0, 5);

  const topCandidates = applications.filter(a => a.compatibility_score).sort((a,b) => b.compatibility_score - a.compatibility_score).slice(0, 3);

  return (
    <div>
      {/* Stats Grid - sem botão no topo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="stat-card"><div className="flex justify-between"><div><p className="text-slate-500 text-sm font-medium">Total de Vagas</p><p className="text-3xl font-bold text-slate-900 mt-1">{uniqueJobs.length}</p><p className="text-xs text-emerald-600 mt-2">{activeJobs} ativas</p></div><div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center"><Briefcase className="w-6 h-6 text-blue-600" /></div></div></div>
        <div className="stat-card"><div className="flex justify-between"><div><p className="text-slate-500 text-sm font-medium">Candidaturas</p><p className="text-3xl font-bold text-slate-900 mt-1">{totalApps}</p><p className="text-xs text-slate-500 mt-2">total recebidas</p></div><div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center"><Users className="w-6 h-6 text-emerald-600" /></div></div></div>
        <div className="stat-card"><div className="flex justify-between"><div><p className="text-slate-500 text-sm font-medium">Taxa de Aprovação</p><p className="text-3xl font-bold text-slate-900 mt-1">{approvalRate}%</p><p className="text-xs text-emerald-600 mt-2">dos candidatos</p></div><div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center"><Award className="w-6 h-6 text-purple-600" /></div></div></div>
        <div className="stat-card"><div className="flex justify-between"><div><p className="text-slate-500 text-sm font-medium">Score Médio</p><p className="text-3xl font-bold text-slate-900 mt-1">75%</p><p className="text-xs text-slate-500 mt-2">dos candidatos</p></div><div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center"><TrendingUp className="w-6 h-6 text-orange-600" /></div></div></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">📈 Candidaturas por Período</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData()} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <defs><linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/><stop offset="95%" stopColor="#2563EB" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} axisLine={false} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={12} axisLine={false} tickLine={false} domain={[0, yAxisMax]} />
              <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
              <Area type="monotone" dataKey="count" stroke="#2563EB" strokeWidth={2} fill="url(#colorCount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">🏆 Ranking das Vagas</h3>
          <div className="space-y-3">
            {jobRanking.map((job, idx) => (
              <div key={job.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}º`}</span>
                  <div>
                    <p className="font-medium text-slate-900">{job.title}</p>
                    <div className="flex items-center gap-1 mt-0.5"><Building2 className="w-3 h-3 text-slate-400" /><p className="text-xs text-slate-400">{job.company}</p></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-slate-700">{job.count} candidaturas</span>
              </div>
            ))}
            {jobRanking.length === 0 && <p className="text-center text-slate-500 py-4">Nenhuma vaga com candidaturas</p>}
          </div>
        </div>
      </div>

      <div className="card p-6 mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">⭐ Melhores Candidatos</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {topCandidates.map((app, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl text-center">
              <div className={`w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg shadow-md ${app.compatibility_score >= 80 ? 'bg-green-600' : app.compatibility_score >= 60 ? 'bg-blue-600' : 'bg-yellow-600'}`}>
                {app.compatibility_score || 0}%
              </div>
              <p className="font-medium text-slate-900">{app.candidate_name || 'Candidato'}</p>
              <p className={`text-sm mt-1 font-medium ${app.status === 'accepted' ? 'text-emerald-600' : app.status === 'rejected' ? 'text-red-600' : app.status === 'reviewed' ? 'text-blue-600' : 'text-yellow-600'}`}>
                {app.status === 'accepted' ? 'Aprovado' : app.status === 'rejected' ? 'Recusado' : app.status === 'reviewed' ? 'Em análise' : 'Pendente'}
              </p>
            </div>
          ))}
          {topCandidates.length === 0 && <p className="text-center text-slate-500 py-8 col-span-3">Nenhum candidato ainda</p>}
        </div>
      </div>

      {/* Botão Nova Vaga - apenas no rodapé */}
      <div className="text-center pt-4 border-t border-slate-200 mt-4">
        <Link to="/post-job" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg">
          <PlusCircle className="w-5 h-5" />
          + Nova Vaga
        </Link>
      </div>
    </div>
  );
};

// Dashboard do Candidato (mantido igual)
const CandidateDashboard = ({ resumes, applications }) => {
  const avgScore = applications.length > 0 ? (applications.reduce((a,b) => a + (b.compatibility_score || 0), 0) / applications.length).toFixed(0) : 0;
  const bestScore = applications.length > 0 ? Math.max(...applications.map(a => a.compatibility_score || 0)) : 0;

  const getStatusColor = (status) => {
    switch(status) {
      case 'accepted': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
      case 'reviewed': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  const getScoreOpacity = (status) => {
    return status === 'rejected' ? 'opacity-40 grayscale' : '';
  };

  const getStatusText = (status) => {
    const texts = { accepted: 'Aprovado', rejected: 'Recusado', reviewed: 'Em análise', pending: 'Pendente' };
    return texts[status] || status;
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="stat-card"><div className="flex justify-between"><div><p className="text-slate-500 text-sm font-medium">Meus Currículos</p><p className="text-3xl font-bold text-slate-900 mt-1">{resumes.length}</p><Link to="/resume" className="text-xs text-blue-600 mt-2 inline-block hover:underline">Gerenciar →</Link></div><div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center"><FileText className="w-6 h-6 text-blue-600" /></div></div></div>
        <div className="stat-card"><div className="flex justify-between"><div><p className="text-slate-500 text-sm font-medium">Candidaturas</p><p className="text-3xl font-bold text-slate-900 mt-1">{applications.length}</p><Link to="/applications" className="text-xs text-blue-600 mt-2 inline-block hover:underline">Ver todas →</Link></div><div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center"><ClipboardList className="w-6 h-6 text-emerald-600" /></div></div></div>
        <div className="stat-card"><div className="flex justify-between"><div><p className="text-slate-500 text-sm font-medium">Score Médio</p><p className="text-3xl font-bold text-slate-900 mt-1">{avgScore}%</p><p className="text-xs text-slate-500 mt-2">das candidaturas</p></div><div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center"><TrendingUp className="w-6 h-6 text-purple-600" /></div></div></div>
        <div className="stat-card"><div className="flex justify-between"><div><p className="text-slate-500 text-sm font-medium">Melhor Score</p><p className="text-3xl font-bold text-slate-900 mt-1">{bestScore}%</p><Link to="/applications" className="text-xs text-blue-600 mt-2 inline-block hover:underline">Ver detalhes →</Link></div><div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center"><Star className="w-6 h-6 text-orange-600" /></div></div></div>
      </div>

      {applications.length > 0 && (
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-900">📋 Últimas Candidaturas</h3>
            <Link to="/applications" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">Ver todas <Eye className="w-4 h-4" /></Link>
          </div>
          <div className="space-y-4">
            {applications.slice(0, 5).map(app => (
              <div key={app.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-slate-50 rounded-xl gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{app.job_title || `Vaga #${app.job_id}`}</p>
                  {app.job_company && <div className="flex items-center gap-1 mt-1"><Building2 className="w-3 h-3 text-slate-400" /><p className="text-xs text-slate-500">{app.job_company}</p></div>}
                  <p className="text-xs text-slate-400 mt-1">{new Date(app.applied_at).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-sm transition-all duration-300 ${getScoreOpacity(app.status)} ${app.compatibility_score >= 80 ? 'bg-green-600' : app.compatibility_score >= 60 ? 'bg-blue-600' : app.compatibility_score >= 40 ? 'bg-yellow-600' : 'bg-red-600'}`}>
                    {app.compatibility_score || 0}%
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>{getStatusText(app.status)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {applications.length === 0 && (
        <div className="card p-12 text-center">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 mb-4">Você ainda não tem candidaturas</p>
          <Link to="/jobs" className="btn-primary inline-flex">Buscar Vagas</Link>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <Link to="/jobs" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2">
          <Briefcase className="w-4 h-4" /> Buscar Vagas
        </Link>
        <Link to="/resume" className="px-6 py-2.5 bg-white text-blue-600 border-2 border-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2">
          <FileText className="w-4 h-4" /> {resumes.length === 0 ? 'Cadastrar Currículo' : 'Atualizar Currículo'}
        </Link>
      </div>
    </div>
  );
};

// Dashboard Principal
const Dashboard = () => {
  const { user, isRecruiter, isCandidate } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      if (isRecruiter) {
        const jobsRes = await jobsAPI.getRecruiterJobs();
        const uniqueJobs = jobsRes.data.reduce((acc, job) => {
          if (!acc.find(j => j.id === job.id)) acc.push(job);
          return acc;
        }, []);
        setJobs(uniqueJobs);
        let allApps = [];
        for (const job of uniqueJobs) {
          try {
            const appsRes = await applicationsAPI.getByJob(job.id);
            allApps = [...allApps, ...appsRes.data];
          } catch (err) {}
        }
        setApplications(allApps);
      } else if (isCandidate) {
        const [resumesRes, appsRes] = await Promise.all([resumesAPI.getAll(), applicationsAPI.getMy()]);
        setResumes(resumesRes.data);
        setApplications(appsRes.data);
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Olá, {user?.full_name?.split(' ')[0]}! 👋</h1>
        <p className="text-slate-500 mt-1">Aqui está o resumo da sua plataforma</p>
      </div>

      {isRecruiter && <RecruiterDashboard jobs={jobs} applications={applications} />}
      {isCandidate && <CandidateDashboard resumes={resumes} applications={applications} />}
    </div>
  );
};

export default Dashboard;
