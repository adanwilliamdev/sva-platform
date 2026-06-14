import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI } from '../../services/jobs';
import { applicationsAPI } from '../../services/applications';
import { Briefcase, Eye, PlusCircle, Trash2, Edit, MapPin, DollarSign, Building, Calendar } from 'lucide-react';

const Vagas = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const jobsRes = await jobsAPI.getRecruiterJobs();
      setJobs(jobsRes.data);
      const appsData = {};
      for (const job of jobsRes.data) {
        try {
          const appsRes = await applicationsAPI.getByJob(job.id);
          appsData[job.id] = appsRes.data || [];
        } catch (err) { appsData[job.id] = []; }
      }
      setApplications(appsData);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Vagas</h1>
          <p className="text-secondary mt-1">Gerencie todas as suas vagas publicadas</p>
        </div>
        <Link to="/post-job" className="btn-primary px-5 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-md hover:shadow-lg transition">
          <PlusCircle className="w-5 h-5" />
          Nova Vaga
        </Link>
      </div>

      <div className="grid gap-5">
        {jobs.map((job, index) => {
          const jobApplications = applications[job.id] || [];
          return (
            <div key={job.id} className="group bg-white dark:bg-gray-800 rounded-xl border border-default hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-md">
                        <Briefcase className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-primary dark:text-white">{job.title}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        job.is_active === 1 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}>
                        {job.is_active === 1 ? 'Ativa' : 'Encerrada'}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-secondary mb-4">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {job.location || 'Remoto'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4" />
                        {job.salary_range || 'A combinar'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Building className="w-4 h-4" />
                        {job.company}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        Criada em {new Date(job.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-sm">
                        {jobApplications.length} candidaturas
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link to={`/applications?jobId=${job.id}`} className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-md hover:shadow-lg" title="Ver candidatos">
                      <Eye className="w-5 h-5" />
                    </Link>
                    <button className="p-2.5 bg-gray-100 dark:bg-gray-700 text-secondary rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition" title="Editar">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button className="p-2.5 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl hover:bg-red-200 dark:hover:bg-red-800/30 transition" title="Excluir">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {jobs.length === 0 && (
          <div className="card p-12 text-center">
            <Briefcase className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-secondary text-lg mb-2">Nenhuma vaga publicada ainda</p>
            <p className="text-secondary text-sm mb-6">Comece criando sua primeira vaga para atrair talentos</p>
            <Link to="/post-job" className="btn-primary px-6 py-3 rounded-xl inline-flex items-center gap-2 mx-auto shadow-md hover:shadow-lg transition">
              <PlusCircle className="w-5 h-5" />
              Criar Primeira Vaga
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vagas;
