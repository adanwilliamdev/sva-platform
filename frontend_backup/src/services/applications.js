import api from './api';

export const applicationsAPI = {
  apply: (applicationData) => api.post('/applications/', applicationData),
  getMy: () => api.get('/applications/my'),
  getByJob: (jobId) => {
    console.log('Chamando API para buscar candidaturas da vaga:', jobId);
    return api.get(`/applications/job/${jobId}`);
  },
  updateStatus: (applicationId, status) => {
    console.log('Atualizando status:', applicationId, status);
    return api.put(`/applications/${applicationId}/status?status=${status}`);
  },
};
