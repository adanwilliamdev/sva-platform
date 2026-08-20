import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { analyticsAPI } from '../../services/analytics';
import { 
  Briefcase, Users, TrendingUp, Award, Eye, PlusCircle, 
  Calendar, BarChart3, PieChart as PieChartIcon, UserCheck
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#4ADE80', '#D9B84A', '#D9846C', '#F87171'];

const DashboardRecrutador = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  // Uma única chamada ao backend, que já calcula tudo agregado (stats,
  // tendência dos últimos 7 dias, ranking de vagas e melhores candidatos).
  // Antes disso, o dashboard buscava todas as vagas e depois fazia uma
  // requisição extra por vaga (N+1) só para montar esses números no
  // frontend, e o "Score Médio" era um valor fixo de 75% independente dos
  // dados reais.
  const fetchData = async () => {
    try {
      const res = await analyticsAPI.getRecruiterAnalytics();
      setAnalytics(res.data);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = analytics ? {
    totalJobs: analytics.total_jobs,
    activeJobs: analytics.active_jobs,
    totalApplications: analytics.total_applications,
    approvalRate: analytics.approval_rate,
    avgScore: analytics.avg_compatibility_score,
    pendingCount: analytics.status_breakdown.pending,
    reviewedCount: analytics.status_breakdown.reviewed,
    acceptedCount: analytics.status_breakdown.accepted,
    rejectedCount: analytics.status_breakdown.rejected,
  } : {
    totalJobs: 0, activeJobs: 0, totalApplications: 0, approvalRate: 0,
    avgScore: 0, pendingCount: 0, reviewedCount: 0, acceptedCount: 0, rejectedCount: 0,
  };

  const trendData = () => {
    if (!analytics) return [];
    return analytics.applications_trend_7d.map(d => ({
      date: new Date(d.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'short' }),
      applications: d.count,
    }));
  };

  // Filtrar status com valor > 0
  const statusData = [
    { name: 'Aprovados', value: stats.acceptedCount },
    { name: 'Em Análise', value: stats.reviewedCount },
    { name: 'Pendentes', value: stats.pendingCount },
    { name: 'Recusados', value: stats.rejectedCount }
  ].filter(item => item.value > 0);

  const jobRanking = (analytics?.top_jobs || []).slice(0, 3).map(j => ({
    name: j.title,
    value: j.applications,
    company: j.company,
  }));

  const topCandidates = analytics?.top_candidates || [];

  const maxValue = Math.max(...jobRanking.map(j => j.value), 1);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-normal text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm">Visão geral da sua plataforma</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('pt-BR')}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#16141B] rounded p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Vagas</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.activeJobs}</p>
              <p className="text-xs text-emerald-600 mt-1">{stats.activeJobs} ativas</p>
            </div>
            <div className="w-12 h-12 rounded bg-blue-100 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-[#16141B] rounded p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Candidaturas</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalApplications}</p>
              <p className="text-xs text-slate-500 mt-1">total recebidas</p>
            </div>
            <div className="w-12 h-12 rounded bg-emerald-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-[#16141B] rounded p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Aprovação</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.approvalRate}%</p>
              <p className="text-xs text-slate-500 mt-1">dos candidatos</p>
            </div>
            <div className="w-12 h-12 rounded bg-purple-100 flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-[#16141B] rounded p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Score Médio</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.avgScore}%</p>
              <p className="text-xs text-slate-500 mt-1">dos candidatos</p>
            </div>
            <div className="w-12 h-12 rounded bg-orange-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Área Chart */}
        <div className="bg-[#16141B] rounded p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-slate-900">📈 Candidaturas por Período</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trendData()}>
              <defs>
                <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A227" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#C9A227" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#26232C" />
              <XAxis dataKey="date" stroke="#6B655A" fontSize={12} />
              <YAxis stroke="#6B655A" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#16141B', borderRadius: '2px', border: '1px solid #2A2732', color: '#F4EFE6' }} />
              <Area type="monotone" dataKey="applications" stroke="#D9B84A" strokeWidth={2} fill="url(#colorApps)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Distribuição de Status (SEM LEGEND) */}
        <div className="bg-[#16141B] rounded p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-5 h-5 text-teal-600" />
            <h3 className="font-semibold text-slate-900">🎯 Distribuição de Status</h3>
          </div>
          {statusData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              {/* Legenda manual abaixo do gráfico */}
              <div className="flex justify-center gap-6 mt-4 flex-wrap">
                {statusData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-sm text-slate-700">{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[280px] text-slate-500">
              Nenhuma candidatura com status definido
            </div>
          )}
        </div>
      </div>

      {/* Ranking TOP 3 */}
      <div className="bg-[#16141B] rounded p-6 border border-slate-200 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold text-slate-900">🏆 Top 3 Vagas</h3>
        </div>
        <div className="space-y-3">
          {jobRanking.map((job, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded hover:bg-slate-100 transition">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}º`}</span>
                <div>
                  <p className="font-medium text-slate-900">{job.name}</p>
                  <p className="text-xs text-slate-500">{job.company}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-teal-500 rounded-full" style={{ width: `${(job.value / maxValue) * 100}%` }} />
                </div>
                <span className="text-sm font-medium text-slate-700">{job.value} candidaturas</span>
              </div>
            </div>
          ))}
          {jobRanking.length === 0 && (
            <p className="text-center text-slate-500 py-4">Nenhuma vaga com candidaturas</p>
          )}
        </div>
      </div>

      {/* Melhores Candidatos */}
      <div className="bg-[#16141B] rounded p-6 border border-slate-200 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <UserCheck className="w-5 h-5 text-green-500" />
          <h3 className="font-semibold text-slate-900">⭐ Melhores Candidatos</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topCandidates.slice(0, 3).map((app, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded text-center hover:bg-slate-100 transition">
                <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg ${
                  app.compatibility_score >= 80 ? 'bg-green-500' : 
                  app.compatibility_score >= 60 ? 'bg-blue-500' : 
                  'bg-yellow-500'
                }`}>
                  {app.compatibility_score || 0}%
                </div>
                <p className="font-medium text-slate-900">{app.candidate_name || 'Candidato'}</p>
                <p className={`text-sm mt-1 font-medium ${
                  app.status === 'accepted' ? 'text-emerald-600' :
                  app.status === 'rejected' ? 'text-red-600' :
                  app.status === 'reviewed' ? 'text-blue-600' : 'text-yellow-600'
                }`}>
                  {app.status === 'accepted' ? '✅ Aprovado' :
                   app.status === 'rejected' ? '❌ Recusado' :
                   app.status === 'reviewed' ? '📝 Em análise' : '⏳ Pendente'}
                </p>
              </div>
            ))}
          {topCandidates.length === 0 && (
            <p className="text-center text-slate-500 py-4 col-span-3">Nenhum candidato ainda</p>
          )}
        </div>
      </div>

      {/* Vagas Ativas */}
      <div className="bg-[#16141B] rounded p-6 border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-semibold text-slate-900">💼 Vagas Ativas</h3>
            <p className="text-xs text-slate-500">Vagas que estão recebendo candidaturas</p>
          </div>
          <Link to="/post-job" className="flex items-center gap-1 text-sm bg-blue-600 text-white px-4 py-2 rounded-sm hover:bg-blue-700 transition shadow-sm">
            <PlusCircle className="w-4 h-4" /> Nova Vaga
          </Link>
        </div>
        {(analytics?.jobs || []).filter(j => j.is_active === 1).map(job => (
            <div key={job.job_id} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 -mx-4 px-4 rounded-sm transition">
              <div>
                <p className="font-medium text-slate-900">{job.title}</p>
                <p className="text-xs text-slate-500">{job.company}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {job.applications} candidaturas
                </span>
                <Link to={`/applications?jobId=${job.job_id}`} className="flex items-center gap-1 text-sm bg-blue-600 text-white px-3 py-1.5 rounded-sm hover:bg-blue-700 transition">
                  <Eye className="w-4 h-4" /> Ver
                </Link>
              </div>
            </div>
          ))}
        {(analytics?.jobs || []).filter(j => j.is_active === 1).length === 0 && (
          <div className="text-center py-8">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500">Nenhuma vaga ativa</p>
            <Link to="/post-job" className="text-blue-600 text-sm hover:underline">Criar primeira vaga →</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardRecrutador;
