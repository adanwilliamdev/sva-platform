import React, { useEffect, useState } from 'react';
import { jobsAPI } from '../services/jobs';
import { applicationsAPI } from '../services/applications';
import { resumesAPI } from '../services/resumes';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Briefcase, MapPin, DollarSign, Building, Send, Search, AlertCircle } from 'lucide-react';
import EmptyState from '../components/Common/EmptyState';
import { SkeletonJobCard } from '../components/Common/SkeletonLoader';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const { isCandidate, user } = useAuth();

  useEffect(() => {
    fetchJobs();
    if (isCandidate) {
      fetchResumes();
    }
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
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
      <div className="min-h-screen py-12 px-4 relative overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse mx-auto mb-2"></div>
            <div className="h-5 w-64 bg-gray-200 rounded animate-pulse mx-auto"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => <SkeletonJobCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold gradient-text mb-4">Vagas Disponíveis</h1>
          <p className="text-gray-600 text-lg">Encontre a oportunidade perfeita para você</p>
        </div>

        {jobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="Nenhuma vaga disponível"
            description="No momento não há vagas publicadas. Volte em breve para novas oportunidades!"
            actionText="Voltar ao Início"
            actionLink="/"
            actionIcon={Search}
          />
        ) : (
          <div className="space-y-6">
            {jobs.map(job => (
              <div key={job.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h2>
                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <Building className="w-4 h-4" />
                        <span className="font-medium">{job.company}</span>
                      </div>
                      <div className="flex flex-wrap gap-4 mb-4">
                        {job.location && (
                          <div className="flex items-center gap-1 text-gray-500 text-sm">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                        )}
                        {job.salary_range && (
                          <div className="flex items-center gap-1 text-gray-500 text-sm">
                            <DollarSign className="w-4 h-4" />
                            <span>{job.salary_range}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>
                    </div>

                    {isCandidate && resumes.length > 0 && (
                      <div className="md:w-64">
                        <select
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                          onChange={(e) => handleApply(job.id, parseInt(e.target.value))}
                          disabled={applying === job.id}
                          defaultValue=""
                        >
                          <option value="" disabled>Candidatar-se com:</option>
                          {resumes.map(resume => (
                            <option key={resume.id} value={resume.id}>
                              {resume.title}
                            </option>
                          ))}
                        </select>
                        {applying === job.id && (
                          <div className="text-center text-blue-600 text-sm">Processando...</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isCandidate && resumes.length === 0 && (
          <div className="mt-8">
            <EmptyState
              icon={AlertCircle}
              title="Nenhum currículo cadastrado"
              description="Para se candidatar às vagas, você precisa cadastrar um currículo primeiro"
              actionText="Cadastrar Currículo"
              actionLink="/resume"
              actionIcon={Briefcase}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
