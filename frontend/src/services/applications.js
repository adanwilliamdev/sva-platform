import api from './api';

export const applicationsAPI = {
  apply: (applicationData) => api.post('/applications/', applicationData),
  getMy: async () => {
    const response = await api.get('/applications/my');
    // Buscar detalhes das vagas para cada candidatura
    const applications = response.data;
    const enrichedApplications = await Promise.all(
      applications.map(async (app) => {
        try {
          const jobResponse = await api.get(`/jobs/${app.job_id}`);
          return {
            ...app,
            job_title: jobResponse.data.title,
            job_company: jobResponse.data.company,
            job_location: jobResponse.data.location
          };
        } catch {
          return { ...app, job_title: `Vaga #${app.job_id}`, job_company: '' };
        }
      })
    );
    return { ...response, data: enrichedApplications };
  },
  getByJob: (jobId) => api.get(`/applications/job/${jobId}`),
  updateStatus: (applicationId, status) => api.put(`/applications/${applicationId}/status?status=${status}`),
};
