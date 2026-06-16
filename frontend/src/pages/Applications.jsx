import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { applicationsAPI } from '../services/applications';
import { jobsAPI } from '../services/jobs';
import { chatAPI } from '../services/chat';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  ArrowLeft, Eye, CheckCircle, XCircle, Clock, Briefcase, 
  FileText, MessageCircle, X, Users, Calendar
} from 'lucide-react';
import api from '../services/api';

const Applications = () => {
  const [searchParams] = useSearchParams();
  const { isRecruiter, user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState('');
  const [jobId, setJobId] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [resumeContent, setResumeContent] = useState('');
  const [loadingResume, setLoadingResume] = useState(false);

  useEffect(() => {
    const id = searchParams.get('jobId');
    console.log('🔍 Job ID da URL:', id);
    if (id) {
      setJobId(parseInt(id));
    }
  }, [searchParams]);

  useEffect(() => {
    if (jobId) {
      fetchApplications();
    }
  }, [jobId]);

  const fetchApplications = async () => {
    if (!jobId) {
      console.log('⚠️ Nenhum jobId encontrado');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    console.log('📡 Buscando candidaturas para vaga:', jobId);
    
    try {
      if (isRecruiter) {
        const response = await applicationsAPI.getByJob(jobId);
        console.log('📥 Candidaturas recebidas:', response.data);
        setApplications(response.data || []);
        
        const jobsRes = await jobsAPI.getRecruiterJobs();
        const job = jobsRes.data.find(j => j.id === jobId);
        setJobTitle(job?.title || `Vaga #${jobId}`);
      } else {
        const response = await applicationsAPI.getMy();
        setApplications(response.data || []);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar candidaturas:', error);
      toast.error('Erro ao carregar candidaturas');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await applicationsAPI.updateStatus(applicationId, newStatus);
      toast.success(`Status atualizado para ${newStatus}`);
      fetchApplications();
    } catch (error) {
      toast.error('Erro ao atualizar status');
    }
  };

  const handleViewResume = async (resumeId, candidateName) => {
    setShowResumeModal(true);
    setLoadingResume(true);
    try {
      const response = await api.get(`/resumes/${resumeId}`);
      setSelectedResume({ ...response.data, candidate_name: candidateName });
      
      let content = '';
      if (response.data.skills) {
        try {
          const skills = JSON.parse(response.data.skills);
          content += `📌 Habilidades: ${skills.join(', ')}\n\n`;
        } catch { content += `📌 Habilidades: ${response.data.skills}\n\n`; }
      }
      if (response.data.experience) {
        try {
          const experience = JSON.parse(response.data.experience);
          content += `💼 Experiência:\n${experience.map(e => `  • ${e}`).join('\n')}\n\n`;
        } catch { content += `💼 Experiência: ${response.data.experience}\n\n`; }
      }
      if (response.data.education) {
        try {
          const education = JSON.parse(response.data.education);
          content += `🎓 Formação:\n${education.map(e => `  • ${e}`).join('\n')}\n\n`;
        } catch { content += `🎓 Formação: ${response.data.education}\n\n`; }
      }
      if (response.data.raw_text) {
        content += `📄 Texto completo:\n${response.data.raw_text.substring(0, 1000)}${response.data.raw_text.length > 1000 ? '...' : ''}`;
      }
      setResumeContent(content);
    } catch (error) {
      toast.error('Erro ao carregar currículo');
    } finally {
      setLoadingResume(false);
    }
  };

  const handleStartChat = async (candidateId) => {
    try {
      await chatAPI.startConversation(jobId);
      toast.success('Chat iniciado!');
    } catch (error) {
      toast.error('Erro ao iniciar chat');
    }
  };

  const handleCloseJob = async () => {
    if (!jobId) {
      toast.error('ID da vaga não encontrado');
      return;
    }
    
    if (window.confirm('⚠️ Tem certeza que deseja encerrar esta vaga?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8000/jobs/${jobId}?is_active=0`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          toast.success('✅ Vaga encerrada com sucesso!');
          setTimeout(() => window.location.href = '/dashboard', 1500);
        } else {
          const error = await response.json();
          toast.error('Erro ao encerrar vaga: ' + (error.message || 'Erro desconhecido'));
        }
      } catch (error) {
        console.error('Erro:', error);
        toast.error('Erro ao conectar com o servidor');
      }
    }
  };

  const getStatusInfo = (status) => {
    const map = {
      pending: { text: 'Pendente', icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
      reviewed: { text: 'Em Análise', icon: Eye, color: 'bg-blue-100 text-blue-700' },
      accepted: { text: 'Aprovado', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
      rejected: { text: 'Recusado', icon: XCircle, color: 'bg-red-100 text-red-700' }
    };
    return map[status] || map.pending;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {isRecruiter ? `Candidaturas - ${jobTitle}` : 'Minhas Candidaturas'}
            </h1>
            <p className="text-slate-500 text-sm">{applications.length} candidatura(s) encontrada(s)</p>
          </div>
        </div>
        {isRecruiter && jobId && (
          <button
            onClick={handleCloseJob}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition shadow-sm"
          >
            <X className="w-4 h-4" /> Encerrar Vaga
          </button>
        )}
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">Nenhuma candidatura encontrada</p>
          <p className="text-slate-400 text-sm">Esta vaga ainda não recebeu candidaturas.</p>
          <Link to="/dashboard" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
            Voltar para o Dashboard
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const status = getStatusInfo(app.status);
            const StatusIcon = status.icon;
            const displayTitle = isRecruiter 
              ? (app.candidate_name || `Candidato #${app.candidate_id}`)
              : `Vaga #${app.job_id}`;
            
            return (
              <div key={app.id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <h3 className="font-semibold text-slate-900">{displayTitle}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color} flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" /> {status.text}
                      </span>
                      {isRecruiter && app.status === 'pending' && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Novo</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-full ${getScoreColor(app.compatibility_score)} flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
                        {app.compatibility_score || 0}%
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Score de Compatibilidade</p>
                        <div className="w-48 h-2 bg-slate-200 rounded-full mt-1 overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-teal-500" style={{ width: `${app.compatibility_score || 0}%` }} />
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-slate-400 mt-3">📅 {new Date(app.applied_at).toLocaleDateString('pt-BR')}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 items-center">
                    {isRecruiter && (
                      <button
                        onClick={() => handleViewResume(app.resume_id, app.candidate_name)}
                        className="flex items-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition"
                      >
                        <FileText className="w-4 h-4" /> Currículo
                      </button>
                    )}
                    
                    {isRecruiter && (
                      <button
                        onClick={() => handleStartChat(app.candidate_id)}
                        className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
                      >
                        <MessageCircle className="w-4 h-4" /> Chat
                      </button>
                    )}

                    {isRecruiter && app.status === 'pending' && (
                      <>
                        <button onClick={() => handleStatusChange(app.id, 'reviewed')} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Analisar</button>
                        <button onClick={() => handleStatusChange(app.id, 'rejected')} className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">Recusar</button>
                      </>
                    )}

                    {isRecruiter && app.status === 'reviewed' && (
                      <>
                        <button onClick={() => handleStatusChange(app.id, 'accepted')} className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">Aprovar</button>
                        <button onClick={() => handleStatusChange(app.id, 'rejected')} className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">Recusar</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showResumeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">📄 Currículo - {selectedResume?.candidate_name}</h2>
              <button onClick={() => setShowResumeModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {loadingResume ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div>
                  <div className="mb-4">
                    <p className="text-sm text-slate-500">Título</p>
                    <p className="font-medium text-slate-900">{selectedResume?.title}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-slate-500">Arquivo</p>
                    <p className="text-sm text-slate-600">{selectedResume?.file_name || 'Não informado'}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-slate-500">Conteúdo</p>
                    <div className="mt-2 p-4 bg-slate-50 rounded-lg whitespace-pre-wrap text-sm text-slate-700 max-h-96 overflow-y-auto border border-slate-200">
                      {resumeContent || 'Nenhum conteúdo disponível'}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-slate-200 flex justify-end">
              <button onClick={() => setShowResumeModal(false)} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
