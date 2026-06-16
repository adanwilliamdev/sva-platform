import api from './api';

export const favoritesAPI = {
  add: (jobId) => api.post(`/favorites/${jobId}`),
  remove: (jobId) => api.delete(`/favorites/${jobId}`),
  getAll: () => api.get('/favorites/'),
};
