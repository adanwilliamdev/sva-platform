import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI } from '../../services/jobs';
import { applicationsAPI } from '../../services/applications';
import { Briefcase, Users, TrendingUp, Eye, PlusCircle, Award, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#22C55E', '#3B82F6', '#F59E0B', '#EF4444'];

const RecruiterDashboard = () => {
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
      last7Days.push({ date: date.toLocaleDateString('pt-BR'), applications: count });
    }
    return last7Days;
  };

  const calculateStatusDistribution = (applications) => {
    const status = { pending: 0, reviewed: 0, accepted: 0, rejected: 0 };
    applications.forEach(app => { status[app.status]++; });
    return [
      { name: 'Aprovado', value: status.accepted },
      { name: 'Em Análise', value: status.reviewed },
      { name: 'Pendente', value: status.pending },
      { name: 'Recusado', value: status.rejected }
    ];
  };

  const totalApplications = Object.values(applications).reduce((sum, apps) => sum + apps.length, 0);
  const activeJobs = jobs.filter(j => j.is_active === 1).length;
  const acceptedCount = Object.values(applications).flat().filter(app => app.status === 'accepted').length;
  const approvalRate = totalApplications > 0 ? ((acceptedCount / totalApplications) * 100).toFixed(1) : 0;

  const stats = [
    { title: 'Total de Vagas', value: jobs.length, icon: Briefcase, color: '#2563EB' },
    { title: 'Candidaturas', value: totalApplications, icon: Users, color: '#14B8A6' },
    { title: 'Vagas Ativas', value: activeJobs, icon: TrendingUp, color: '#3B82F6' },
    { title: 'Taxa de Aprovação', value: `${approvalRate}%`, icon: Award, color: '#22C55E' },
  ];

  const topJobs = jobs.map(job => ({ title: job.title, count: applications[job.id]?.length || 0 })).sort((a, b) => b.count - a.count).slice(0, 5);

  if (loading) {
    return <div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-default">
            <div className="flex items-center justify-between">
              <div><p className="text-secondary text-sm font-medium mb-1">{stat.title}</p><p className="text-3xl font-bold text-primary dark:text-white">{stat.value}</p></div>
              <div className="p-3 rounded-xl" style={{ backgroundColor: `${stat.color}20` }}><stat.icon className="w-6 h-6" style={{ color: stat.color }} /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-default">
          <div className="flex items-center gap-2 mb-4"><BarChart3 className="w-5 h-5 text-blue-600" /><h3 className="text-lg font-semibold text-primary dark:text-white">Candidaturas por Período</h3></div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.applicationsTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" stroke="#475569" />
              <YAxis stroke="#475569" />
              <Tooltip />
              <Line type="monotone" dataKey="applications" stroke="#2563EB" strokeWidth={2} name="Candidaturas" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-default">
          <div className="flex items-center gap-2 mb-4"><PieChartIcon className="w-5 h-5 text-teal-600" /><h3 className="text-lg font-semibold text-primary dark:text-white">Distribuição de Status</h3></div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart><Pie data={chartData.statusData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} dataKey="value">{chartData.statusData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip /><Legend /></PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-default">
        <div className="px-6 py-4 border-b border-default"><h3 className="text-xl font-semibold text-primary dark:text-white">🏆 Ranking das Vagas</h3><p className="text-sm text-secondary mt-1">Vagas com mais candidaturas</p></div>
        <div className="divide-y divide-default">
          {topJobs.map((job, index) => (
            <div key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3"><span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${index === 0 ? 'bg-green-500' : index === 1 ? 'bg-blue-500' : index === 2 ? 'bg-yellow-500' : 'bg-gray-400'}`}>{index + 1}</span><span className="font-medium text-primary dark:text-white">{job.title}</span></div>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">{job.count} candidaturas</span>
              </div>
            </div>
          ))}
          {topJobs.length === 0 && <div className="p-8 text-center text-secondary">Nenhuma candidatura ainda</div>}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-default">
        <div className="px-6 py-4 border-b border-default"><h3 className="text-xl font-semibold text-primary dark:text-white">Minhas Vagas</h3></div>
        <div className="p-6 space-y-4">
          {jobs.map((job) => {
            const jobApplications = applications[job.id] || [];
            return (<div key={job.id} className="border border-default rounded-lg p-5 hover:shadow-md transition"><div className="flex justify-between items-start"><div className="flex-1"><h4 className="text-lg font-bold text-primary dark:text-white mb-2">{job.title}</h4><div className="flex flex-wrap gap-3 text-sm text-secondary mb-3"><span>📍 {job.location || 'Remoto'}</span><span>💰 {job.salary_range || 'A combinar'}</span><span>🏢 {job.company}</span></div><div className="flex items-center gap-3"><span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">{jobApplications.length} candidaturas</span>{job.is_active === 1 && <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">Ativa</span>}</div></div><Link to={`/applications?jobId=${job.id}`} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"><Eye className="w-4 h-4" /> Ver Candidatos</Link></div></div>);
          })}
          {jobs.length === 0 && (<div className="text-center py-12"><Briefcase className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" /><p className="text-secondary mb-2">Nenhuma vaga publicada ainda</p><Link to="/post-job" className="btn-primary px-6 py-2 rounded-lg inline-flex items-center gap-2"><PlusCircle className="w-4 h-4" /> Criar Primeira Vaga</Link></div>)}
        </div>
      </div>

      <div className="text-center"><Link to="/post-job" className="btn-primary px-6 py-3 rounded-xl inline-flex items-center gap-2"><PlusCircle className="w-5 h-5" /> + Nova Vaga</Link></div>
    </div>
  );
};

export default RecruiterDashboard;
