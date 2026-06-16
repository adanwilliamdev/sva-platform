import api from './api';

export const jobsAPI = {
  getAll: () => api.get('/jobs/'),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (jobData) => api.post('/jobs/', jobData),
  updateStatus: (id, isActive) => api.put(`/jobs/${id}?is_active=${isActive}`),
  getRecruiterJobs: async () => {
    const response = await api.get('/jobs/recruiter');
    // Garantir que retorna um array
    if (!Array.isArray(response.data)) {
      console.warn('Resposta não é array, convertendo...');
      return { ...response, data: [] };
    }
    return response;
  },
};
