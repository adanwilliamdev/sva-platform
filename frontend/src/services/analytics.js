import api from './api';

export const analyticsAPI = {
  getRecruiterAnalytics: () => api.get('/analytics/recruiter'),
};
