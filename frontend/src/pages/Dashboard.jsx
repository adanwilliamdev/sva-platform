import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobsAPI } from '../services/jobs';
import { applicationsAPI } from '../services/applications';
import { resumesAPI } from '../services/resumes';
import { 
  Briefcase, FileText, ClipboardList, TrendingUp, Star, Eye, 
  PlusCircle, Users, Award, CheckCircle, XCircle, Clock 
} from 'lucide-react';

// Dashboard do Candidato
const CandidateDashboard = ({ user }) => {
  const [resumes, setResumes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    console.log('Carregando dados do candidato...');
    setLoading(true);
    setError(null);
    
    try {
      console.log('Buscando currículos...');
      const resumesRes = await resumesAPI.getAll();
      console.log('Currículos recebidos:', resumesRes.data);
      setResumes(resumesRes.data);
      
      console.log('Buscando candidaturas...');
      const appsRes = await applicationsAPI.getMy();
      console.log('Candidaturas recebidas:', appsRes.data);
      setApplications(appsRes.data);
      
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const avgScore = applications.length > 0 
    ? (applications.reduce((a,b) => a + (b.compatibility_score || 0), 0) / applications.length).toFixed(0) 
    : 0;
  const bestScore = applications.length > 0 
    ? Math.max(...applications.map(a => a.compatibility_score || 0)) 
    : 0;

  const getStatusColor = (status) => {
    switch(status) {
      case 'accepted': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'reviewed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getStatusText = (status) => {
    const texts = { accepted: 'Aprovado', rejected: 'Recusado', reviewed: 'Em análise', pending: 'Pendente' };
    return texts[status] || status;
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-slate-500">Carregando seus dados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Erro ao carregar dados: {error}</p>
        <button onClick={loadData} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Olá, {user?.full_name?.split(' ')[0] || 'Candidato'}! 👋</h1>
        <p className="text-slate-500 mt-1">Acompanhe suas candidaturas e scores</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Meus Currículos</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{resumes.length}</p>
              <Link to="/resume" className="text-sm text-blue-600 mt-2 inline-block hover:underline">Gerenciar →</Link>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Candidaturas</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{applications.length}</p>
              <Link to="/applications" className="text-sm text-blue-600 mt-2 inline-block hover:underline">Ver todas →</Link>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Score Médio</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{avgScore}%</p>
              <p className="text-xs text-slate-500 mt-2">das candidaturas</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Melhor Score</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{bestScore}%</p>
              <Link to="/applications" className="text-sm text-blue-600 mt-2 inline-block hover:underline">Ver detalhes →</Link>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
              <Star className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {applications.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-slate-900">📋 Últimas Candidaturas</h3>
            <Link to="/applications" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              Ver todas <Eye className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {applications.slice(0, 5).map(app => (
              <div key={app.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-medium text-slate-900">Vaga #{app.job_id}</p>
                  <p className="text-sm text-slate-500 mt-1">{new Date(app.applied_at).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    app.compatibility_score >= 80 ? 'bg-green-500' : 
                    app.compatibility_score >= 60 ? 'bg-blue-500' : 
                    app.compatibility_score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}>
                    {app.compatibility_score || 0}%
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                    {getStatusText(app.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {applications.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200">
          <FileText className="w-20 h-20 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg mb-2">Você ainda não tem candidaturas</p>
          <p className="text-slate-400 mb-6">Comece a buscar vagas e candidate-se!</p>
          <Link to="/jobs" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition">
            Buscar Vagas
          </Link>
        </div>
      )}

      <div className="flex gap-4 justify-center mt-8">
        <Link to="/jobs" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition shadow-md hover:shadow-lg">
          🔍 Buscar Vagas
        </Link>
        <Link to="/resume" className="px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-xl font-medium hover:bg-blue-50 transition">
          📄 {resumes.length === 0 ? 'Cadastrar Currículo' : 'Atualizar Currículo'}
        </Link>
      </div>
    </div>
  );
};

// Dashboard do Recrutador
const RecruiterDashboard = ({ jobs, applications, user }) => {
  const activeJobs = jobs.filter(j => j.is_active === 1);
  const totalApps = applications.length;
  const acceptedApps = applications.filter(a => a.status === 'accepted').length;
  const approvalRate = totalApps > 0 ? ((acceptedApps / totalApps) * 100).toFixed(0) : 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Olá, {user?.full_name?.split(' ')[0] || 'Recrutador'}! 👋</h1>
        <p className="text-slate-500 mt-1">Gerencie suas vagas e candidatos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Total de Vagas</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{activeJobs.length}</p>
              <p className="text-xs text-green-600 mt-2">ativas</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Candidaturas</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{totalApps}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Taxa de Aprovação</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{approvalRate}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Score Médio</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">75%</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-slate-900">Minhas Vagas Ativas</h3>
          <Link to="/post-job" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700">
            <PlusCircle className="w-4 h-4" /> Nova Vaga
          </Link>
        </div>
        {activeJobs.map(job => (
          <div key={job.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl mb-3">
            <div><p className="font-medium">{job.title}</p><p className="text-sm text-slate-500">{job.company}</p></div>
            <Link to={`/applications?jobId=${job.id}`} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Ver Candidatos</Link>
          </div>
        ))}
        {activeJobs.length === 0 && (
          <div className="text-center py-8 text-slate-500">Nenhuma vaga ativa. <Link to="/post-job" className="text-blue-600">Crie uma nova vaga</Link></div>
        )}
      </div>
    </div>
  );
};

// Dashboard Principal
const Dashboard = () => {
  const { user, loading } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    if (user) {
      console.log('Dashboard - Usuário:', user);
      setUserType(user.user_type);
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      if (userType === 'recruiter') {
        try {
          const jobsRes = await jobsAPI.getRecruiterJobs();
          setJobs(jobsRes.data);
          let allApps = [];
          for (const job of jobsRes.data) {
            try {
              const appsRes = await applicationsAPI.getByJob(job.id);
              allApps = [...allApps, ...appsRes.data];
            } catch (err) {}
          }
          setApplications(allApps);
        } catch (error) {
          console.error(error);
        }
      }
      setDataLoading(false);
    };
    if (userType) {
      fetchData();
    } else {
      setDataLoading(false);
    }
  }, [userType]);

  if (loading || dataLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (userType === 'candidate') {
    return <CandidateDashboard user={user} />;
  }
  
  if (userType === 'recruiter') {
    return <RecruiterDashboard jobs={jobs} applications={applications} user={user} />;
  }

  return <div className="text-center py-8 text-slate-500">Carregando...</div>;
};

export default Dashboard;
