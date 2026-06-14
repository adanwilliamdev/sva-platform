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
    try {
      await applicationsAPI.apply({ job_id: jobId, resume_id: resumeId });
      toast.success('✅ Candidatura realizada com sucesso!');
      fetchJobs();
    } catch (error) { 
      toast.error(error.response?.data?.detail || 'Erro ao candidatar-se'); 
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Vagas Disponíveis</h1>
        <p className="text-gray-500 mt-1">Encontre a oportunidade perfeita para você</p>
      </div>

      <div className="space-y-4">
        {jobs.map(job => (
          <div key={job.id} className="card p-6 hover:shadow-md transition">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h2>
                <div className="flex items-center gap-2 text-gray-500 mb-3">
                  <Building className="w-4 h-4" />
                  <span>{job.company}</span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                  {job.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>}
                  {job.salary_range && <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />{job.salary_range}</span>}
                </div>
                <p className="text-gray-600 line-clamp-2">{job.description}</p>
              </div>

              {isCandidate && resumes.length > 0 && (
                <div className="md:w-48">
                  <select
                    onChange={(e) => handleApply(job.id, parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 mb-2"
                    defaultValue=""
                  >
                    <option value="" disabled>Candidatar-se</option>
                    {resumes.map(resume => <option key={resume.id} value={resume.id}>{resume.title}</option>)}
                  </select>
                </div>
              )}
            </div>
          </div>
        ))}
        {jobs.length === 0 && (
          <div className="card p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma vaga disponível no momento.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
