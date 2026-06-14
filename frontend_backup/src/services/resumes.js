import api from './api';

export const resumesAPI = {
  create: (resumeData) => api.post('/resumes/', resumeData),
  getAll: () => api.get('/resumes/'),
  getById: (id) => api.get(`/resumes/${id}`),
};
