import api from './api';
import io from 'socket.io-client';

class ChatService {
  constructor() {
    this.socket = null;
    this.listeners = [];
  }

  connect(token) {
    this.socket = io('http://localhost:8000', {
      path: '/socket.io/',
      transports: ['websocket'],
      extraHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    this.socket.on('connect', () => {
      console.log('✅ Conectado ao chat');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Desconectado do chat');
    });

    this.socket.on('new_message', (data) => {
      console.log('📨 Nova mensagem recebida:', data);
      this.listeners.forEach(listener => listener(data));
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinConversation(conversationId, userId) {
    if (this.socket) {
      this.socket.emit('join_room', {
        conversation_id: conversationId,
        user_id: userId
      });
    }
  }

  sendMessage(conversationId, message, senderId) {
    if (this.socket) {
      this.socket.emit('send_message', {
        conversation_id: conversationId,
        message: message,
        sender_id: senderId
      });
    }
  }

  onNewMessage(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter(l => l !== callback);
  }
}

export const chatService = new ChatService();

export const chatAPI = {
  startConversation: (jobId) => api.post(`/chat/conversations/${jobId}/start`),
  getConversations: () => api.get('/chat/conversations'),
  getMessages: (conversationId) => api.get(`/chat/conversations/${conversationId}/messages`),
  sendMessage: (conversationId, message) => api.post(`/chat/conversations/${conversationId}/messages`, { message }),
};
