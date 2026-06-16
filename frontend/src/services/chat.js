import api from './api';

export const chatAPI = {
  startConversation: (jobId) => api.post(`/chat/conversations/${jobId}/start`),
  getConversations: () => api.get('/chat/conversations'),
  getMessages: (conversationId) => api.get(`/chat/conversations/${conversationId}/messages`),
  sendMessage: (conversationId, message) => api.post(`/chat/conversations/${conversationId}/messages`, { message }),
};
