import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { applicationsAPI } from '../services/applications';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { ArrowLeft, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';

const Applications = () => {
  const [searchParams] = useSearchParams();
  const { isRecruiter } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState('');

  const jobId = searchParams.get('jobId');

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      if (isRecruiter && jobId) {
        const response = await applicationsAPI.getByJob(jobId);
        setApplications(response.data);
        setJobTitle(`Vaga #${jobId}`);
      } else {
        // Para candidato, buscar todas as candidaturas
        console.log('Buscando candidaturas do candidato...');
        const response = await applicationsAPI.getMy();
        console.log('Candidaturas encontradas:', response.data);
        setApplications(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar candidaturas:', error);
      toast.error('Erro ao carregar candidaturas');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { text: 'Pendente', icon: Clock, color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      reviewed: { text: 'Em Análise', icon: Eye, color: 'bg-blue-100 text-blue-700 border-blue-200' },
      accepted: { text: 'Aprovado', icon: CheckCircle, color: 'bg-green-100 text-green-700 border-green-200' },
      rejected: { text: 'Recusado', icon: XCircle, color: 'bg-red-100 text-red-700 border-red-200' }
    };
    return statusMap[status] || statusMap.pending;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-slate-500">Carregando candidaturas...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition">
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {isRecruiter ? `Candidaturas - ${jobTitle}` : 'Minhas Candidaturas'}
            </h1>
            <p className="text-slate-500 mt-1">
              {applications.length} candidatura(s) encontrada(s)
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Candidaturas */}
      {applications.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200">
          <div className="flex flex-col items-center">
            <Clock className="w-20 h-20 text-slate-300 mb-4" />
            <p className="text-slate-500 text-lg mb-2">Nenhuma candidatura encontrada</p>
            <p className="text-slate-400 mb-6">
              {isRecruiter 
                ? 'Esta vaga ainda não recebeu candidaturas.'
                : 'Você ainda não se candidatou a nenhuma vaga.'}
            </p>
            {!isRecruiter && (
              <Link to="/jobs" className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
                Buscar Vagas
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const statusInfo = getStatusInfo(app.status);
            const StatusIcon = statusInfo.icon;
            // Para candidato, não temos título da vaga no objeto, então mostramos o ID
            const displayTitle = isRecruiter 
              ? (app.candidate_name || `Candidato #${app.candidate_id}`)
              : `Vaga #${app.job_id}`;
            
            return (
              <div key={app.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {displayTitle}
                      </h3>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color} border`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusInfo.text}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-full ${getScoreColor(app.compatibility_score)} flex items-center justify-center shadow-md`}>
                        <span className="text-white font-bold text-lg">{app.compatibility_score || 0}%</span>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Score de Compatibilidade</p>
                        <div className="w-48 h-2 bg-slate-200 rounded-full mt-1 overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-teal-500 transition-all"
                            style={{ width: `${app.compatibility_score || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-slate-400 mt-3">
                      📅 Candidatado em: {new Date(app.applied_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>

                  {/* Botões de ação para recrutador */}
                  {isRecruiter && (
                    <div className="flex gap-2">
                      {app.status === 'pending' && (
                        <>
                          <button
                            onClick={async () => {
                              try {
                                await applicationsAPI.updateStatus(app.id, 'reviewed');
                                toast.success('Status atualizado para Em Análise');
                                fetchApplications();
                              } catch (error) {
                                toast.error('Erro ao atualizar status');
                              }
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                          >
                            Iniciar Análise
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                await applicationsAPI.updateStatus(app.id, 'rejected');
                                toast.success('Candidatura recusada');
                                fetchApplications();
                              } catch (error) {
                                toast.error('Erro ao atualizar status');
                              }
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                          >
                            Recusar
                          </button>
                        </>
                      )}
                      {app.status === 'reviewed' && (
                        <>
                          <button
                            onClick={async () => {
                              try {
                                await applicationsAPI.updateStatus(app.id, 'accepted');
                                toast.success('Candidatura aprovada!');
                                fetchApplications();
                              } catch (error) {
                                toast.error('Erro ao atualizar status');
                              }
                            }}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                          >
                            Aprovar
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                await applicationsAPI.updateStatus(app.id, 'rejected');
                                toast.success('Candidatura recusada');
                                fetchApplications();
                              } catch (error) {
                                toast.error('Erro ao atualizar status');
                              }
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                          >
                            Recusar
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Applications;
