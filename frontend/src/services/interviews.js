import api from './api';

export const interviewsAPI = {
  schedule: (payload) => api.post('/interviews/', payload),
  getMy: () => api.get('/interviews/my'),
  update: (id, payload) => api.put(`/interviews/${id}`, payload),
  cancel: (id) => api.delete(`/interviews/${id}`),
};
