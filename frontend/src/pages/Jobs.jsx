import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI } from '../services/jobs';
import { applicationsAPI } from '../services/applications';
import { resumesAPI } from '../services/resumes';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Briefcase, MapPin, DollarSign, Building, Send, Search, Sparkles, Clock } from 'lucide-react';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const { isCandidate } = useAuth();

  useEffect(() => {
    fetchJobs();
    if (isCandidate) fetchResumes();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await jobsAPI.getAll();
      setJobs(response.data);
    } catch (error) {
      toast.error('Erro ao carregar vagas');
    } finally {
      setLoading(false);
    }
  };

  const fetchResumes = async () => {
    try {
      const response = await resumesAPI.getAll();
      setResumes(response.data);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    }
  };

  const handleApply = async (jobId, resumeId) => {
    setApplying(jobId);
    try {
      await applicationsAPI.apply({ job_id: jobId, resume_id: resumeId });
      toast.success('🎉 Candidatura realizada com sucesso!');
      fetchJobs();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao candidatar-se');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Vagas Disponíveis</h1>
        <p className="text-slate-500 text-sm">Encontre a oportunidade perfeita para você</p>
      </div>

      <div className="space-y-4">
        {jobs.map(job => (
          <div key={job.id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition">
            <div className="flex flex-col lg:flex-row justify-between gap-4">
              {/* Lado esquerdo - informações da vaga */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-xl font-bold text-slate-900">{job.title}</h2>
                  {job.is_active === 1 && (
                    <span className="badge badge-success text-xs whitespace-nowrap ml-2">Ativa</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-slate-500 mb-3">
                  <Building className="w-4 h-4" />
                  <span className="text-sm font-medium">{job.company}</span>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
                  {job.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {job.location}
                    </span>
                  )}
                  {job.salary_range && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" /> {job.salary_range}
                    </span>
                  )}
                  {job.created_at && (
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-4 h-4" /> {new Date(job.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </div>
                
                <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                  {job.description}
                </p>
              </div>

              {/* Lado direito - botão de candidatura */}
              {isCandidate && (
                <div className="lg:w-48 flex flex-col gap-2 justify-center">
                  {resumes.length > 0 ? (
                    <>
                      <select
                        onChange={(e) => handleApply(job.id, parseInt(e.target.value))}
                        disabled={applying === job.id}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-700"
                        defaultValue=""
                      >
                        <option value="" disabled>Candidatar-se</option>
                        {resumes.map(resume => (
                          <option key={resume.id} value={resume.id}>
                            📄 {resume.title}
                          </option>
                        ))}
                      </select>
                      {applying === job.id && (
                        <div className="text-center text-blue-600 text-sm animate-pulse">Processando...</div>
                      )}
                    </>
                  ) : (
                    <Link 
                      to="/resume" 
                      className="w-full text-center px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm hover:bg-slate-200 transition"
                    >
                      📄 Cadastrar Currículo
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {jobs.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">Nenhuma vaga disponível</p>
            <p className="text-slate-400 text-sm">Volte em breve para novas oportunidades!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
