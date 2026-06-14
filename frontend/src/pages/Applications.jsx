import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { applicationsAPI } from '../services/applications';
import { jobsAPI } from '../services/jobs';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Applications = () => {
  const [searchParams] = useSearchParams();
  const { isRecruiter } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [recruiterJobs, setRecruiterJobs] = useState([]);

  useEffect(() => {
    const jobId = searchParams.get('jobId');
    if (jobId) setSelectedJob(parseInt(jobId));
    fetchData();
  }, [searchParams]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (isRecruiter) {
        const jobsRes = await jobsAPI.getRecruiterJobs();
        setRecruiterJobs(jobsRes.data);
        if (selectedJob) {
          const appsRes = await applicationsAPI.getByJob(selectedJob);
          setApplications(appsRes.data);
        } else if (jobsRes.data.length > 0) {
          setSelectedJob(jobsRes.data[0].id);
          const appsRes = await applicationsAPI.getByJob(jobsRes.data[0].id);
          setApplications(appsRes.data);
        }
      } else {
        const appsRes = await applicationsAPI.getMy();
        setApplications(appsRes.data);
      }
    } catch (error) {
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

  const getScoreClass = (score) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
    if (score >= 60) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
    if (score >= 40) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
    return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
  };

  const getScoreCircleClass = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{isRecruiter ? 'Candidaturas Recebidas' : 'Minhas Candidaturas'}</h1>

        {isRecruiter && recruiterJobs.length > 0 && (
          <div className="mb-8">
            <select className="w-full max-w-md px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white" value={selectedJob || ''} onChange={(e) => setSelectedJob(parseInt(e.target.value))}>
              <option value="">Selecione uma vaga</option>
              {recruiterJobs.map(job => <option key={job.id} value={job.id}>{job.title}</option>)}
            </select>
          </div>
        )}

        {applications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">Nenhuma candidatura encontrada.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{isRecruiter ? app.candidate_name : `Vaga #${app.job_id}`}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${app.status === 'accepted' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : app.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' : app.status === 'reviewed' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'}`}>
                          {app.status === 'accepted' ? '✅ Aprovado' : app.status === 'rejected' ? '❌ Recusado' : app.status === 'reviewed' ? '📝 Em Análise' : '⏳ Pendente'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <div className={`w-16 h-16 rounded-full ${getScoreCircleClass(app.compatibility_score)} flex items-center justify-center shadow-md`}>
                          <span className="text-white font-bold text-lg">{app.compatibility_score || 0}%</span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Score de Compatibilidade</p>
                          <div className="w-40 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                            <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 transition-all duration-500" style={{ width: `${app.compatibility_score || 0}%` }}></div>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-400">📅 Candidatado em: {new Date(app.applied_at).toLocaleDateString('pt-BR')}</p>
                    </div>

                    {isRecruiter && app.status === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => handleStatusChange(app.id, 'reviewed')} className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Iniciar Análise</button>
                        <button onClick={() => handleStatusChange(app.id, 'rejected')} className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">Recusar</button>
                      </div>
                    )}
                    {isRecruiter && app.status === 'reviewed' && (
                      <div className="flex gap-2">
                        <button onClick={() => handleStatusChange(app.id, 'accepted')} className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">Aprovar</button>
                        <button onClick={() => handleStatusChange(app.id, 'rejected')} className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">Recusar</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
