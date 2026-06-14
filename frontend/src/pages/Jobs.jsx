import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI } from '../services/jobs';
import { applicationsAPI } from '../services/applications';
import { resumesAPI } from '../services/resumes';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Briefcase, MapPin, DollarSign, Building, Send, Search } from 'lucide-react';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const { isCandidate } = useAuth();

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
      <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold gradient-text mb-4">Vagas Disponíveis</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Encontre a oportunidade perfeita para você</p>
        </div>

        <div className="space-y-6">
          {jobs.map(job => (
            <div key={job.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{job.title}</h2>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3">
                      <Building className="w-4 h-4" />
                      <span className="font-medium">{job.company}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 mb-4">
                      {job.location && (
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                      )}
                      {job.salary_range && (
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                          <DollarSign className="w-4 h-4" />
                          <span>{job.salary_range}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">{job.description}</p>
                  </div>

                  {isCandidate && resumes.length > 0 && (
                    <div className="md:w-64">
                      <select
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white mb-3"
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

          {jobs.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center border border-gray-200 dark:border-gray-700">
              <Briefcase className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhuma vaga disponível no momento.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
