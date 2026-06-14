import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI } from '../../services/jobs';
import { applicationsAPI } from '../../services/applications';
import { 
  Briefcase, Users, TrendingUp, Award, PlusCircle, Eye,
  BarChart3, PieChart as PieChartIcon, Clock, Target, TrendingDown,
  UserPlus, CheckCircle, XCircle
} from 'lucide-react';
import { 
  AreaChart, Area, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

const COLORS = ['#22C55E', '#3B82F6', '#F59E0B', '#EF4444'];

const VisaoGeral = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({});
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({ applicationsTrend: [], statusData: [] });

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

  const totalApplications = Object.values(applications).reduce((sum, apps) => sum + apps.length, 0);
  const activeJobs = jobs.filter(j => j.is_active === 1).length;
  const closedJobs = jobs.filter(j => j.is_active === 0).length;
  const acceptedCount = Object.values(applications).flat().filter(app => app.status === 'accepted').length;
  const approvalRate = totalApplications > 0 ? ((acceptedCount / totalApplications) * 100).toFixed(1) : 0;
  const conversionRate = totalApplications > 0 ? ((acceptedCount / totalApplications) * 100).toFixed(0) : 0;
  const avgHireTime = '12 dias';

  const stats = [
    { title: 'Total de Vagas', value: jobs.length, icon: Briefcase, color: '#2563EB', subtitle: `${activeJobs} ativas` },
    { title: 'Candidaturas', value: totalApplications, icon: Users, color: '#14B8A6', subtitle: `+5 esta semana` },
    { title: 'Vagas Ativas', value: activeJobs, icon: TrendingUp, color: '#3B82F6', subtitle: `${closedJobs} encerradas` },
    { title: 'Taxa de Aprovação', value: `${approvalRate}%`, icon: Award, color: '#22C55E', subtitle: `+5% vs mês anterior` },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary dark:text-white">Visão Geral</h1>
        <p className="text-secondary mt-1">Acompanhe as principais métricas da sua plataforma</p>
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
        </div>
        
        <div className="stat-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-primary dark:text-white">Taxa de conversão</h3>
          </div>
          <p className="text-2xl font-bold text-primary dark:text-white">{conversionRate}%</p>
        </div>
        
        <div className="stat-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <TrendingDown className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-primary dark:text-white">Vagas encerradas</h3>
          </div>
          <p className="text-2xl font-bold text-primary dark:text-white">{closedJobs}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-primary dark:text-white mb-4">Candidaturas por Período</h3>
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
              <Tooltip />
              <Area type="monotone" dataKey="applications" stroke="#2563EB" strokeWidth={2} fill="url(#colorApplications)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-primary dark:text-white mb-4">Distribuição de Status</h3>
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={chartData.statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {chartData.statusData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
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
    </div>
  );
};

export default VisaoGeral;
