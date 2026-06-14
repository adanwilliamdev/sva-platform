import api from './api';

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    return api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getMe: () => api.get('/auth/me'),
};
