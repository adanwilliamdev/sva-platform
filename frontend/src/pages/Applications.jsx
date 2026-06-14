import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { applicationsAPI } from '../services/applications';
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

const Applications = () => {
  const { isRecruiter } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = isRecruiter ? await applicationsAPI.getByJob(1) : await applicationsAPI.getMy();
      setApplications(res.data || []);
    } catch (error) {} finally { setLoading(false); }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'accepted': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'reviewed': return <Eye className="w-5 h-5 text-blue-500" />;
      default: return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status) => {
    const texts = { accepted: 'Aprovado', rejected: 'Recusado', reviewed: 'Em análise', pending: 'Pendente' };
    return texts[status] || status;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{isRecruiter ? 'Candidaturas' : 'Minhas Candidaturas'}</h1>
      
      <div className="space-y-4">
        {applications.map(app => (
          <div key={app.id} className="card p-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {getStatusIcon(app.status)}
                  <h3 className="font-semibold text-gray-900 dark:text-white">{isRecruiter ? app.candidate_name : `Vaga #${app.job_id}`}</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{getStatusText(app.status)}</span>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${app.compatibility_score >= 80 ? 'bg-green-500' : app.compatibility_score >= 60 ? 'bg-blue-500' : app.compatibility_score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                    {app.compatibility_score || 0}%
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Score de compatibilidade</p>
                    <div className="w-40 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                      <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-teal-500" style={{ width: `${app.compatibility_score || 0}%` }}></div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-3">Candidatado em {new Date(app.applied_at).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          </div>
        ))}
        {applications.length === 0 && (
          <div className="card p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">Nenhuma candidatura encontrada.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
