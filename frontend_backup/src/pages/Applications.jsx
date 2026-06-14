import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { applicationsAPI } from '../services/applications';
import { jobsAPI } from '../services/jobs';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Applications = () => {
  const [searchParams] = useSearchParams();
  const { isRecruiter, user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [recruiterJobs, setRecruiterJobs] = useState([]);
  const [jobs, setJobs] = useState({});

  useEffect(() => {
    const jobId = searchParams.get('jobId');
    if (jobId) {
      setSelectedJob(parseInt(jobId));
    }
    fetchData();
  }, [searchParams]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (isRecruiter) {
        // Para recrutador: buscar vagas e candidaturas
        const jobsRes = await jobsAPI.getRecruiterJobs();
        setRecruiterJobs(jobsRes.data);
        
        if (selectedJob) {
          const appsRes = await applicationsAPI.getByJob(selectedJob);
          setApplications(appsRes.data);
        } else if (jobsRes.data.length > 0) {
          // Se não tem vaga selecionada, mostra a primeira
          setSelectedJob(jobsRes.data[0].id);
          const appsRes = await applicationsAPI.getByJob(jobsRes.data[0].id);
          setApplications(appsRes.data);
        }
      } else {
        // Para candidato: buscar todas as candidaturas do usuário
        console.log('Buscando candidaturas do candidato...');
        const appsRes = await applicationsAPI.getMy();
        console.log('Candidaturas encontradas:', appsRes.data);
        setApplications(appsRes.data);
        
        // Buscar detalhes das vagas para mostrar o título
        const jobsMap = {};
        for (const app of appsRes.data) {
          if (!jobsMap[app.job_id]) {
            try {
              const jobRes = await jobsAPI.getById(app.job_id);
              jobsMap[app.job_id] = jobRes.data;
            } catch (err) {
              console.error(`Erro ao buscar vaga ${app.job_id}:`, err);
            }
          }
        }
        setJobs(jobsMap);
      }
    } catch (error) {
      console.error('Erro ao carregar candidaturas:', error);
      toast.error('Erro ao carregar candidaturas');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await applicationsAPI.updateStatus(applicationId, newStatus);
      toast.success(`Status atualizado para ${newStatus}`);
      fetchData();
    } catch (error) {
      toast.error('Erro ao atualizar status');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: 'Pendente',
      reviewed: 'Em Análise',
      rejected: 'Recusado',
      accepted: 'Aprovado'
    };
    return statusMap[status] || status;
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewed: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800',
      accepted: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleJobChange = async (jobId) => {
    setSelectedJob(parseInt(jobId));
    setLoading(true);
    try {
      const appsRes = await applicationsAPI.getByJob(jobId);
      setApplications(appsRes.data);
    } catch (error) {
      console.error('Erro ao buscar candidaturas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Carregando candidaturas...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {isRecruiter ? 'Candidaturas Recebidas' : 'Minhas Candidaturas'}
      </h1>

      {isRecruiter && recruiterJobs.length > 0 && (
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecione uma vaga
          </label>
          <select
            className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={selectedJob || ''}
            onChange={(e) => handleJobChange(e.target.value)}
          >
            <option value="">Selecione uma vaga</option>
            {recruiterJobs.map(job => (
              <option key={job.id} value={job.id}>
                {job.title} - {job.company}
              </option>
            ))}
          </select>
        </div>
      )}

      {applications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">
            {isRecruiter 
              ? 'Nenhuma candidatura recebida para esta vaga ainda.'
              : 'Você ainda não se candidatou a nenhuma vaga.'}
          </p>
          {!isRecruiter && (
            <button
              onClick={() => window.location.href = '/jobs'}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Buscar Vagas
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => (
            <div key={app.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-xl font-semibold">
                      {isRecruiter 
                        ? app.candidate_name || `Candidato #${app.candidate_id}`
                        : jobs[app.job_id]?.title || `Vaga #${app.job_id}`
                      }
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(app.status)}`}>
                      {getStatusText(app.status)}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">Score de Compatibilidade:</span>
                      <span className={`text-2xl font-bold ${getScoreColor(app.compatibility_score)}`}>
                        {app.compatibility_score || 0}%
                      </span>
                    </div>
                    {app.ai_feedback && (
                      <div className="mt-2 p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-700">{app.ai_feedback}</p>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-gray-400">
                    Candidatado em: {new Date(app.applied_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                {isRecruiter && app.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(app.id, 'reviewed')}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm transition"
                    >
                      Iniciar Análise
                    </button>
                    <button
                      onClick={() => handleStatusChange(app.id, 'rejected')}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm transition"
                    >
                      Recusar
                    </button>
                  </div>
                )}

                {isRecruiter && app.status === 'reviewed' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(app.id, 'accepted')}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm transition"
                    >
                      Aprovar
                    </button>
                    <button
                      onClick={() => handleStatusChange(app.id, 'rejected')}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm transition"
                    >
                      Recusar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications;
