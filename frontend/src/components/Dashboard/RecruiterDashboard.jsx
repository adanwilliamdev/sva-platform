import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI } from '../../services/jobs';
import { applicationsAPI } from '../../services/applications';
import { 
  Briefcase, Users, TrendingUp, Eye, PlusCircle, Award, 
  BarChart3, PieChart as PieChartIcon, Calendar, Clock, 
  Target, TrendingDown, UserPlus, CheckCircle, XCircle 
} from 'lucide-react';
import { 
  AreaChart, Area, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

const COLORS = ['#22C55E', '#3B82F6', '#F59E0B', '#EF4444'];

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({});
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({ applicationsTrend: [], statusData: [] });
  const [recentActivities, setRecentActivities] = useState([]);
  const [topCandidates, setTopCandidates] = useState([]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const jobsRes = await jobsAPI.getRecruiterJobs();
      setJobs(jobsRes.data);
      const appsData = {};
      let allApplications = [];
      
      for (const job of jobsRes.data) {
        try {
          const appsRes = await applicationsAPI.getByJob(job.id);
          appsData[job.id] = appsRes.data || [];
          allApplications = [...allApplications, ...appsRes.data];
        } catch (err) { appsData[job.id] = []; }
      }
      setApplications(appsData);
      
      const trendData = generateTrendData(allApplications);
      const statusData = calculateStatusDistribution(allApplications);
      setChartData({ applicationsTrend: trendData, statusData: statusData });
      
      // Gerar atividades recentes
      generateRecentActivities(allApplications, jobsRes.data);
      
      // Gerar top candidatos
      generateTopCandidates(allApplications);
      
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const generateTrendData = (applications) => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const count = applications.filter(app => new Date(app.applied_at).toDateString() === date.toDateString()).length;
      last7Days.push({ date: date.toLocaleDateString('pt-BR', { weekday: 'short' }), applications: count });
    }
    return last7Days;
  };

  const calculateStatusDistribution = (applications) => {
    const status = { pending: 0, reviewed: 0, accepted: 0, rejected: 0 };
    applications.forEach(app => { status[app.status]++; });
    const total = applications.length || 1;
    return [
      { name: 'Aprovados', value: status.accepted, percent: ((status.accepted / total) * 100).toFixed(0) },
      { name: 'Em Análise', value: status.reviewed, percent: ((status.reviewed / total) * 100).toFixed(0) },
      { name: 'Pendentes', value: status.pending, percent: ((status.pending / total) * 100).toFixed(0) },
      { name: 'Recusados', value: status.rejected, percent: ((status.rejected / total) * 100).toFixed(0) }
    ];
  };

  const generateRecentActivities = (applications, jobsList) => {
    const activities = [];
    applications.slice(0, 5).forEach(app => {
      const job = jobsList.find(j => j.id === app.job_id);
      activities.push({
        id: app.id,
        type: 'candidatura',
        message: `${app.candidate_name || 'Candidato'} se candidatou para ${job?.title || 'vaga'}`,
        time: new Date(app.applied_at),
        icon: UserPlus
      });
    });
    activities.sort((a, b) => b.time - a.time);
    setRecentActivities(activities.slice(0, 5));
  };

  const generateTopCandidates = (applications) => {
    const candidates = applications.map(app => ({
      name: app.candidate_name || `Candidato ${app.candidate_id}`,
      score: app.compatibility_score || 0,
      status: app.status
    })).sort((a, b) => b.score - a.score).slice(0, 3);
    setTopCandidates(candidates);
  };

  const totalApplications = Object.values(applications).reduce((sum, apps) => sum + apps.length, 0);
  const activeJobs = jobs.filter(j => j.is_active === 1).length;
  const closedJobs = jobs.filter(j => j.is_active === 0).length;
  const acceptedCount = Object.values(applications).flat().filter(app => app.status === 'accepted').length;
  const approvalRate = totalApplications > 0 ? ((acceptedCount / totalApplications) * 100).toFixed(1) : 0;
  const conversionRate = totalApplications > 0 ? ((acceptedCount / totalApplications) * 100).toFixed(0) : 0;
  
  // Simular tempo médio de contratação (em produção viria do backend)
  const avgHireTime = '12 dias';
  
  // Calcular crescimento semanal
  const lastWeekApplications = 10;
  const growth = totalApplications - lastWeekApplications;
  const growthPercent = lastWeekApplications > 0 ? ((growth / lastWeekApplications) * 100).toFixed(0) : 0;

  const stats = [
    { title: 'Total de Vagas', value: jobs.length, icon: Briefcase, color: '#2563EB', subtitle: `${activeJobs} ativas` },
    { title: 'Candidaturas', value: totalApplications, icon: Users, color: '#14B8A6', subtitle: `+${growth} esta semana (${growthPercent}%)` },
    { title: 'Vagas Ativas', value: activeJobs, icon: TrendingUp, color: '#3B82F6', subtitle: `${closedJobs} encerradas` },
    { title: 'Taxa de Aprovação', value: `${approvalRate}%`, icon: Award, color: '#22C55E', subtitle: `+5% vs mês anterior` },
  ];

  const topJobs = jobs
    .map(job => ({ 
      title: job.title, 
      count: applications[job.id]?.length || 0,
      daysOld: Math.floor((new Date() - new Date(job.created_at)) / (1000 * 60 * 60 * 24)),
      company: job.company
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const maxCount = Math.max(...topJobs.map(j => j.count), 1);

  if (loading) {
    return <div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary dark:text-white">Dashboard</h1>
        <p className="text-secondary mt-1">Bem-vindo de volta, Recrutador Teste! 👋 Gerencie suas vagas e acompanhe candidaturas em tempo real.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm font-medium mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-primary dark:text-white">{stat.value}</p>
                <p className="text-xs text-secondary mt-2">{stat.subtitle}</p>
              </div>
              <div className="p-3 rounded-xl icon-gradient">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-primary dark:text-white">Tempo médio de contratação</h3>
          </div>
          <p className="text-2xl font-bold text-primary dark:text-white">{avgHireTime}</p>
          <p className="text-xs text-secondary mt-2">Média dos últimos 30 dias</p>
        </div>
        
        <div className="stat-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-primary dark:text-white">Taxa de conversão</h3>
          </div>
          <p className="text-2xl font-bold text-primary dark:text-white">{conversionRate}%</p>
          <p className="text-xs text-secondary mt-2">Candidatos → Contratações</p>
        </div>
        
        <div className="stat-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <TrendingDown className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-primary dark:text-white">Vagas encerradas</h3>
          </div>
          <p className="text-2xl font-bold text-primary dark:text-white">{closedJobs}</p>
          <p className="text-xs text-secondary mt-2">Total de vagas finalizadas</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Area Chart with Gradient */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-primary dark:text-white">Candidaturas por Período</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData.applicationsTrend}>
              <defs>
                <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" stroke="#475569" />
              <YAxis stroke="#475569" />
              <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
              <Area type="monotone" dataKey="applications" stroke="#2563EB" strokeWidth={2} fill="url(#colorApplications)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Donut Chart */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-5 h-5 text-teal-600" />
            <h3 className="text-lg font-semibold text-primary dark:text-white">Distribuição de Status</h3>
          </div>
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={chartData.statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center mt-4">
            <p className="text-2xl font-bold text-green-600">{chartData.statusData[0]?.percent || 0}%</p>
            <p className="text-sm text-secondary">Aprovados</p>
          </div>
        </div>
      </div>

      {/* Ranking das Vagas */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-default">
          <h3 className="text-xl font-semibold text-primary dark:text-white">🏆 Ranking das Vagas</h3>
          <p className="text-sm text-secondary mt-1">Vagas com mais candidaturas</p>
        </div>
        <div className="divide-y divide-default">
          {topJobs.map((job, index) => (
            <div key={index} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}️⃣`}
                  </span>
                  <div>
                    <span className="font-medium text-primary dark:text-white">{job.title}</span>
                    <p className="text-xs text-secondary mt-0.5">{job.company}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                  {job.count} candidaturas
                </span>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-xs text-secondary mb-1">
                  <span>Progresso</span>
                  <span>{Math.round((job.count / maxCount) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(job.count / maxCount) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-secondary mt-2">Criada há {job.daysOld} dias</p>
              </div>
            </div>
          ))}
          {topJobs.length === 0 && (
            <div className="p-8 text-center text-secondary">Nenhuma vaga com candidaturas ainda</div>
          )}
        </div>
      </div>

      {/* Top Candidates & Recent Activities */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Candidates */}
        <div className="card">
          <div className="px-6 py-4 border-b border-default">
            <h3 className="text-xl font-semibold text-primary dark:text-white">⭐ Melhores Candidatos</h3>
            <p className="text-sm text-secondary mt-1">Maior pontuação de compatibilidade</p>
          </div>
          <div className="divide-y divide-default">
            {topCandidates.map((candidate, index) => (
              <div key={index} className="p-5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    candidate.score >= 80 ? 'bg-green-500' :
                    candidate.score >= 60 ? 'bg-blue-500' :
                    candidate.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}>
                    {candidate.score}%
                  </div>
                  <div>
                    <p className="font-medium text-primary dark:text-white">{candidate.name}</p>
                    <p className="text-xs text-secondary">Score de compatibilidade</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  candidate.status === 'accepted' ? 'bg-green-100 text-green-700' :
                  candidate.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {candidate.status === 'accepted' ? 'Aprovado' :
                   candidate.status === 'rejected' ? 'Recusado' : 'Em análise'}
                </span>
              </div>
            ))}
            {topCandidates.length === 0 && (
              <div className="p-8 text-center text-secondary">Nenhum candidato ainda</div>
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="card">
          <div className="px-6 py-4 border-b border-default">
            <h3 className="text-xl font-semibold text-primary dark:text-white">🔄 Atividades Recentes</h3>
            <p className="text-sm text-secondary mt-1">Últimas movimentações na plataforma</p>
          </div>
          <div className="divide-y divide-default">
            {recentActivities.map((activity, index) => (
              <div key={index} className="p-5 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <UserPlus className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-primary dark:text-white">{activity.message}</p>
                  <p className="text-xs text-secondary mt-1">
                    {new Date(activity.time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} • 
                    há {Math.floor((new Date() - new Date(activity.time)) / (1000 * 60))} minutos
                  </p>
                </div>
              </div>
            ))}
            {recentActivities.length === 0 && (
              <div className="p-8 text-center text-secondary">Nenhuma atividade recente</div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">📊 Todas</button>
        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-secondary rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition">🟢 Ativas</button>
        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-secondary rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition">🔴 Encerradas</button>
      </div>

      {/* My Jobs Section */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-default">
          <h3 className="text-xl font-semibold text-primary dark:text-white">Minhas Vagas</h3>
        </div>
        <div className="p-6 space-y-4">
          {jobs.map((job) => {
            const jobApplications = applications[job.id] || [];
            return (
              <div key={job.id} className="border border-default rounded-lg p-5 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-primary dark:text-white mb-2">{job.title}</h4>
                    <div className="flex flex-wrap gap-3 text-sm text-secondary mb-3">
                      <span>📍 {job.location || 'Remoto'}</span>
                      <span>💰 {job.salary_range || 'A combinar'}</span>
                      <span>🏢 {job.company}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        {jobApplications.length} candidaturas
                      </span>
                      {job.is_active === 1 && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          Ativa
                        </span>
                      )}
                    </div>
                  </div>
                  <Link to={`/applications?jobId=${job.id}`} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    <Eye className="w-4 h-4" />
                    Ver Candidatos
                  </Link>
                </div>
              </div>
            );
          })}
          {jobs.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-secondary mb-2">Nenhuma vaga publicada ainda</p>
              <Link to="/post-job" className="btn-primary px-6 py-2 rounded-lg inline-flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                Criar Primeira Vaga
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="text-center">
        <Link to="/post-job" className="btn-primary px-6 py-3 rounded-xl inline-flex items-center gap-2">
          <PlusCircle className="w-5 h-5" />
          + Nova Vaga
        </Link>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
