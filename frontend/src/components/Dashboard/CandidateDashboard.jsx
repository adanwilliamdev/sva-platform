import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { resumesAPI } from '../../services/resumes';
import { applicationsAPI } from '../../services/applications';
import { jobsAPI } from '../../services/jobs';
import { FileText, ClipboardList, Search, PlusCircle, TrendingUp, Award, Briefcase, Star, Sparkles } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SkeletonStats, SkeletonApplicationCard } from '../Common/SkeletonLoader';

const CandidateDashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scoreHistory, setScoreHistory] = useState([]);
  const [stats, setStats] = useState({
    avgScore: 0,
    bestMatch: 0,
    totalJobs: 0,
    scoreEvolution: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resumesRes, appsRes, jobsRes] = await Promise.all([
        resumesAPI.getAll(),
        applicationsAPI.getMy(),
        jobsAPI.getAll()
      ]);
      
      setResumes(resumesRes.data);
      setApplications(appsRes.data);
      
      const scores = appsRes.data.map(app => app.compatibility_score || 0);
      const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      const bestMatch = scores.length > 0 ? Math.max(...scores) : 0;
      
      const history = appsRes.data.map(app => ({
        date: new Date(app.applied_at).toLocaleDateString('pt-BR'),
        score: app.compatibility_score || 0,
        jobId: app.job_id
      })).reverse();
      
      setScoreHistory(history);
      
      setStats({
        avgScore: Math.round(avgScore),
        bestMatch: bestMatch,
        totalJobs: appsRes.data.length,
        scoreEvolution: history
      });
      
      if (resumesRes.data.length > 0 && jobsRes.data.length > 0) {
        const recommendations = await recommendJobs(resumesRes.data[0], jobsRes.data);
        setRecommendedJobs(recommendations.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const recommendJobs = async (resume, allJobs) => {
    try {
      const resumeSkills = resume.skills ? JSON.parse(resume.skills) : [];
      const scoredJobs = allJobs.map(job => {
        let jobSkills = [];
        try {
          jobSkills = job.skills_required ? JSON.parse(job.skills_required) : [];
        } catch { }
        
        const matchCount = resumeSkills.filter(skill => 
          jobSkills.some(js => js.toLowerCase().includes(skill.toLowerCase()) || 
                               skill.toLowerCase().includes(js.toLowerCase()))
        ).length;
        
        const score = jobSkills.length > 0 ? (matchCount / jobSkills.length) * 100 : 50;
        return { ...job, recommendedScore: Math.round(score) };
      });
      
      return scoredJobs.sort((a, b) => b.recommendedScore - a.recommendedScore);
    } catch {
      return allJobs.slice(0, 3);
    }
  };

  const statsCards = [
    { title: 'Meus Currículos', value: resumes.length, icon: FileText, color: 'from-blue-500 to-cyan-500', link: '/resume', linkText: 'Gerenciar Currículos' },
    { title: 'Candidaturas', value: applications.length, icon: ClipboardList, color: 'from-emerald-500 to-green-500', link: '/applications', linkText: 'Ver Minhas Candidaturas' },
    { title: 'Score Médio', value: `${stats.avgScore}%`, icon: Award, color: 'from-blue-500 to-emerald-500', link: '/applications', linkText: 'Ver Detalhes' },
    { title: 'Melhor Match', value: `${stats.bestMatch}%`, icon: Star, color: 'from-yellow-500 to-orange-500', link: '/applications', linkText: 'Ver Melhor' },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <SkeletonStats />
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => <SkeletonApplicationCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div key={index} className="stat-card p-6 group animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex items-center justify-between mb-4">
              <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-xl group-hover:scale-110 transition duration-300`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition" />
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">{stat.title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
            <Link to={stat.link} className="text-blue-600 text-sm font-medium hover:text-blue-700 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              {stat.linkText} →
            </Link>
          </div>
        ))}
      </div>

      {/* Evolução do Score */}
      {scoreHistory.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">📈 Evolução do Score</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={scoreHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} name="Compatibilidade" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Vagas Recomendadas pela IA */}
      {recommendedJobs.length > 0 && resumes.length > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">🤖 Vagas Recomendadas para Você</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {recommendedJobs.map((job, index) => (
              <div key={index} className="bg-white rounded-xl p-4 hover:shadow-lg transition">
                <h4 className="font-semibold text-gray-900 mb-1">{job.title}</h4>
                <p className="text-sm text-gray-500 mb-2">{job.company}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">{job.location || 'Remoto'}</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    {job.recommendedScore}% match
                  </span>
                </div>
                <Link to="/jobs" className="mt-3 text-blue-600 text-sm hover:text-blue-700 inline-flex items-center gap-1">
                  Candidatar-se →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Últimas Candidaturas */}
      {applications.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <h3 className="text-xl font-semibold text-gray-900">📋 Histórico de Candidaturas</h3>
            <p className="text-sm text-gray-500 mt-1">Acompanhe o status das suas candidaturas</p>
          </div>
          <div className="p-6 space-y-4">
            {applications.slice(0, 5).map((app) => (
              <div key={app.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-300">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <h4 className="text-lg font-semibold text-gray-900">Vaga #{app.job_id}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        app.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {app.status === 'accepted' ? '✅ Aprovado' :
                         app.status === 'rejected' ? '❌ Recusado' :
                         app.status === 'reviewed' ? '📝 Em Análise' : '⏳ Pendente'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        {/* Círculo maior para mostrar o percentual completo */}
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-md">
                          <span className="text-white font-bold text-base">{app.compatibility_score || 0}%</span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Score de Compatibilidade</p>
                          <div className="w-40 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                            <div 
                              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
                              style={{ width: `${app.compatibility_score || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      📅 Candidatado em: {new Date(app.applied_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty States */}
      {applications.length === 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl p-12 text-center">
          <Briefcase className="w-20 h-20 text-blue-600 mx-auto mb-4 animate-bounce" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">🚀 Comece sua jornada!</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {resumes.length === 0 
              ? 'Cadastre seu primeiro currículo para começar a buscar oportunidades'
              : 'Explore as vagas disponíveis e encontre a oportunidade perfeita para você'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {resumes.length === 0 ? (
              <Link to="/resume" className="btn-gradient text-white px-6 py-3 rounded-xl inline-flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Cadastrar Currículo
              </Link>
            ) : (
              <Link to="/jobs" className="btn-gradient text-white px-6 py-3 rounded-xl inline-flex items-center gap-2">
                <Search className="w-5 h-5" />
                Buscar Vagas
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Botões de Ação */}
      {applications.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link to="/jobs" className="inline-flex items-center gap-2 btn-gradient text-white px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <Search className="w-5 h-5" />
            Buscar Mais Vagas
          </Link>
          <Link to="/resume" className="inline-flex items-center gap-2 bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105">
            <PlusCircle className="w-5 h-5" />
            Atualizar Currículo
          </Link>
        </div>
      )}
    </div>
  );
};

export default CandidateDashboard;
