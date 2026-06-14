import api from './api';

export const jobsAPI = {
  getAll: () => api.get('/jobs/'),
  getById: (id) => {
    console.log(`Buscando vaga ${id}...`);
    return api.get(`/jobs/${id}`);
  },
  create: (jobData) => api.post('/jobs/', jobData),
  updateStatus: (id, isActive) => api.put(`/jobs/${id}?is_active=${isActive}`),
  getRecruiterJobs: () => api.get('/jobs/recruiter'),
};
