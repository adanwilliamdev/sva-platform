import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI } from '../../services/jobs';
import { applicationsAPI } from '../../services/applications';
import { Briefcase, Users, TrendingUp, Eye, PlusCircle, Award, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { ApplicationsTrendChart, JobsByCategoryChart, StatusPieChart } from '../Charts';
import { SkeletonStats, SkeletonJobCard } from '../Common/SkeletonLoader';

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({});
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({ applicationsTrend: [], jobsByCategory: [], statusData: [] });

  useEffect(() => {
    fetchData();
  }, []);

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
        } catch (err) {
          appsData[job.id] = [];
        }
      }
      setApplications(appsData);
      
      // Preparar dados para gráficos
      const trendData = generateTrendData(allApplications);
      const categoryData = jobsRes.data.map(job => ({ name: job.title.substring(0, 15), count: appsData[job.id]?.length || 0 }));
      const statusData = calculateStatusDistribution(allApplications);
      
      setChartData({
        applicationsTrend: trendData,
        jobsByCategory: categoryData,
        statusData: statusData
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
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
      { name: 'Pendente', value: status.pending },
      { name: 'Em Análise', value: status.reviewed },
      { name: 'Aprovado', value: status.accepted },
      { name: 'Recusado', value: status.rejected }
    ];
  };

  const totalApplications = Object.values(applications).reduce((sum, apps) => sum + apps.length, 0);
  const activeJobs = jobs.filter(j => j.is_active === 1).length;
  const acceptedCount = Object.values(applications).flat().filter(app => app.status === 'accepted').length;
  const approvalRate = totalApplications > 0 ? ((acceptedCount / totalApplications) * 100).toFixed(1) : 0;

  const stats = [
    { title: 'Total de Vagas', value: jobs.length, icon: Briefcase, color: 'from-blue-500 to-cyan-500' },
    { title: 'Candidaturas', value: totalApplications, icon: Users, color: 'from-emerald-500 to-green-500' },
    { title: 'Vagas Ativas', value: activeJobs, icon: TrendingUp, color: 'from-blue-500 to-emerald-500' },
    { title: 'Taxa de Aprovação', value: `${approvalRate}%`, icon: Award, color: 'from-purple-500 to-pink-500' },
  ];

  const topJobs = jobs
    .map(job => ({ title: job.title, count: applications[job.id]?.length || 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-8">
        <SkeletonStats />
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => <SkeletonJobCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card p-6 group animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-xl group-hover:scale-110 transition duration-300`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Candidaturas por Período</h3>
          </div>
          <ApplicationsTrendChart data={chartData.applicationsTrend} />
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Distribuição de Status</h3>
          </div>
          <StatusPieChart data={chartData.statusData} />
        </div>
      </div>

      {/* Ranking de Vagas */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h3 className="text-xl font-semibold text-gray-900">🏆 Ranking das Vagas</h3>
          <p className="text-sm text-gray-500 mt-1">Vagas com mais candidaturas</p>
        </div>
        <div className="divide-y divide-gray-200">
          {topJobs.map((job, index) => (
            <div key={index} className="p-4 hover:bg-gray-50 transition">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-900">{job.title}</span>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {job.count} candidaturas
                </span>
              </div>
            </div>
          ))}
          {topJobs.length === 0 && (
            <div className="p-8 text-center text-gray-500">Nenhuma candidatura ainda</div>
          )}
        </div>
      </div>

      {/* Minhas Vagas */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h3 className="text-xl font-semibold text-gray-900">Minhas Vagas</h3>
        </div>
        <div className="p-6 space-y-4">
          {jobs.map((job) => {
            const jobApplications = applications[job.id] || [];
            return (
              <div key={job.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                      <h4 className="text-lg font-bold text-gray-900">{job.title}</h4>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {jobApplications.length} candidaturas
                        </span>
                        {job.is_active === 1 && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Ativa
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                      <span>📍 {job.location || 'Remoto'}</span>
                      <span>💰 {job.salary_range || 'A combinar'}</span>
                      <span>🏢 {job.company}</span>
                    </div>
                    {jobApplications.length > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-semibold text-blue-900 mb-2">Últimos candidatos:</p>
                        {jobApplications.slice(0, 2).map(app => (
                          <div key={app.id} className="flex justify-between items-center text-sm">
                            <span className="text-blue-700">{app.candidate_name}</span>
                            <span className="font-semibold text-blue-600">Score: {app.compatibility_score}%</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Link to={`/applications?jobId=${job.id}`} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition transform hover:scale-105">
                    <Eye className="w-4 h-4" />
                    Ver Candidatos
                  </Link>
                </div>
              </div>
            );
          })}
          {jobs.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Nenhuma vaga publicada ainda</p>
              <p className="text-gray-400 text-sm mb-4">Comece publicando sua primeira vaga</p>
              <Link to="/post-job" className="btn-gradient text-white px-6 py-2 rounded-lg inline-flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                Criar Primeira Vaga
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="text-center">
        <Link to="/post-job" className="inline-flex items-center gap-2 btn-gradient text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-105">
          <PlusCircle className="w-5 h-5" />
          + Nova Vaga
        </Link>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
