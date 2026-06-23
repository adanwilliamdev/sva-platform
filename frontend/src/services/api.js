import axios from 'axios';

// URL da API - com fallback para desenvolvimento
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Remove trailing slash se existir
const baseURL = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Aumentado para 30s (upload de currículos)
});

// Interceptor de Request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log apenas em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Response
api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.url} - Status: ${response.status}`);
    }
    return response;
  },
  (error) => {
    // Log de erro apenas em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ API Error: ${error.config?.url} - Status: ${error.response?.status}`);
      console.error('Detalhes:', error.response?.data || error.message);
    }
    
    // Tratamento de erro 401 (token expirado)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirecionar apenas se não estiver na página de login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Tratamento de erro 403 (permissão negada)
    if (error.response?.status === 403) {
      // Exibir mensagem amigável
      alert('Você não tem permissão para realizar esta ação.');
    }
    
    // Tratamento de erro 500 (erro no servidor)
    if (error.response?.status === 500) {
      console.error('Erro no servidor:', error.response?.data);
      // Mostrar mensagem genérica para o usuário
      alert('Ocorreu um erro no servidor. Tente novamente mais tarde.');
    }
    
    // Tratamento de timeout
    if (error.code === 'ECONNABORTED') {
      alert('A requisição demorou muito tempo. Tente novamente.');
    }
    
    // Tratamento de erro de rede (CORS, servidor offline, etc)
    if (!error.response) {
      console.error('Erro de rede:', error.message);
      alert('Erro de conexão com o servidor. Verifique sua internet.');
    }
    
    return Promise.reject(error);
  }
);

export default api;