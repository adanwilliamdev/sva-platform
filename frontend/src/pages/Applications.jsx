import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { applicationsAPI } from '../services/applications';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { ArrowLeft, Eye, CheckCircle, XCircle, Clock, Briefcase } from 'lucide-react';

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
        const response = await applicationsAPI.getMy();
        setApplications(response.data);
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao carregar candidaturas');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const map = {
      pending: { text: 'Pendente', icon: Clock, color: 'badge-warning' },
      reviewed: { text: 'Em Análise', icon: Eye, color: 'badge-info' },
      accepted: { text: 'Aprovado', icon: CheckCircle, color: 'badge-success' },
      rejected: { text: 'Recusado', icon: XCircle, color: 'badge-danger' }
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
      <div className="flex items-center gap-4 mb-6">
        <Link to="/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isRecruiter ? `Candidaturas - ${jobTitle}` : 'Minhas Candidaturas'}
          </h1>
          <p className="text-slate-500 text-sm">{applications.length} candidatura(s)</p>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="card text-center py-12">
          <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">Nenhuma candidatura encontrada</p>
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
              <div key={app.id} className="card hover:shadow-lg transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-semibold text-slate-900">{displayTitle}</h3>
                      <span className={`badge ${status.color} flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" /> {status.text}
                      </span>
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

                  {isRecruiter && app.status === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={async () => { try { await applicationsAPI.updateStatus(app.id, 'reviewed'); toast.success('Em análise'); fetchApplications(); } catch (e) { toast.error('Erro'); } }} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Analisar</button>
                      <button onClick={async () => { try { await applicationsAPI.updateStatus(app.id, 'rejected'); toast.success('Recusado'); fetchApplications(); } catch (e) { toast.error('Erro'); } }} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">Recusar</button>
                    </div>
                  )}

                  {isRecruiter && app.status === 'reviewed' && (
                    <div className="flex gap-2">
                      <button onClick={async () => { try { await applicationsAPI.updateStatus(app.id, 'accepted'); toast.success('Aprovado!'); fetchApplications(); } catch (e) { toast.error('Erro'); } }} className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">Aprovar</button>
                      <button onClick={async () => { try { await applicationsAPI.updateStatus(app.id, 'rejected'); toast.success('Recusado'); fetchApplications(); } catch (e) { toast.error('Erro'); } }} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">Recusar</button>
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
