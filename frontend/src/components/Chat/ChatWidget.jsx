import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react';
import { chatAPI } from '../../services/chat';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const ChatWidget = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [lastMessageId, setLastMessageId] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user) {
      setIsRecruiter(user.user_type === 'recruiter');
    }
  }, [user]);

  useEffect(() => {
    if (isOpen && user) {
      loadConversations();
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      // Iniciar polling para esta conversa
      const interval = setInterval(() => {
        checkNewMessages(selectedConversation.id);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const loadConversations = async () => {
    try {
      const response = await chatAPI.getConversations();
      console.log('📥 Conversas carregadas:', response.data);
      setConversations(response.data || []);
      if (response.data && response.data.length > 0 && !selectedConversation) {
        setSelectedConversation(response.data[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
      setConversations([]);
    }
  };

  const loadMessages = async (conversationId) => {
    setLoading(true);
    try {
      const response = await chatAPI.getMessages(conversationId);
      console.log('📥 Mensagens carregadas:', response.data);
      const msgs = response.data || [];
      setMessages(msgs);
      if (msgs.length > 0) {
        setLastMessageId(msgs[msgs.length - 1].id);
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const checkNewMessages = async (conversationId) => {
    try {
      const response = await chatAPI.getMessages(conversationId);
      const msgs = response.data || [];
      
      if (msgs.length > messages.length) {
        // Tem mensagens novas
        const newMsgs = msgs.slice(messages.length);
        console.log('📨 Novas mensagens detectadas:', newMsgs);
        
        // Verificar se a última mensagem não foi enviada por mim
        const lastMsg = newMsgs[newMsgs.length - 1];
        if (lastMsg && lastMsg.sender_id !== user?.id) {
          toast.info('💬 Nova mensagem recebida!');
        }
        
        setMessages(msgs);
        if (msgs.length > 0) {
          setLastMessageId(msgs[msgs.length - 1].id);
        }
        scrollToBottom();
        loadConversations(); // Atualizar lista de conversas
      }
    } catch (error) {
      console.error('Erro ao verificar novas mensagens:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    const messageText = newMessage;
    const tempId = Date.now();
    
    // Adicionar mensagem localmente (otimista)
    const tempMessage = {
      id: tempId,
      conversation_id: selectedConversation.id,
      sender_id: user?.id,
      sender_name: user?.full_name,
      message: messageText,
      created_at: new Date().toISOString(),
      is_read: false
    };
    
    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');
    scrollToBottom();
    
    try {
      console.log('📤 Enviando mensagem:', {
        conversation_id: selectedConversation.id,
        message: messageText,
        sender_id: user?.id,
        sender_name: user?.full_name
      });
      
      await chatAPI.sendMessage(selectedConversation.id, messageText);
      
      // Recarregar mensagens para pegar o ID real
      setTimeout(async () => {
        await loadMessages(selectedConversation.id);
        loadConversations();
      }, 500);
      
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error);
      toast.error('Erro ao enviar mensagem');
      // Remover mensagem temporária
      setMessages(prev => prev.filter(m => m.id !== tempId));
      setNewMessage(messageText);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getUnreadCount = () => {
    return conversations.reduce((acc, c) => acc + (c.unread_count || 0), 0);
  };

  if (!user) return null;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 group hover:scale-110"
      >
        <MessageCircle className="w-6 h-6 group-hover:scale-110 transition" />
        {getUnreadCount() > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            {getUnreadCount()}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[400px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-white" />
          <span className="text-white font-semibold">Mensagens</span>
          {conversations.length > 0 && (
            <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
              {conversations.reduce((acc, c) => acc + c.unread_count, 0)}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsMinimized(!isMinimized)} className="text-white/80 hover:text-white">
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Lista de Conversas */}
          <div className="border-b border-slate-200 max-h-48 overflow-y-auto">
            {conversations.length > 0 ? (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`p-3 cursor-pointer hover:bg-slate-50 transition ${selectedConversation?.id === conv.id ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-slate-900 text-sm">
                        {isRecruiter ? conv.candidate_name : conv.job_title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        {conv.last_message || 'Nenhuma mensagem'}
                      </p>
                    </div>
                    {conv.unread_count > 0 && (
                      <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center">
                <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">Nenhuma conversa ainda</p>
                <p className="text-slate-400 text-xs mt-1">
                  {isRecruiter 
                    ? 'Clique em "Chat" na página de candidaturas para iniciar uma conversa'
                    : 'Aguardando contato do recrutador'}
                </p>
              </div>
            )}
          </div>

          {/* Mensagens */}
          {selectedConversation && (
            <>
              <div className="h-80 overflow-y-auto p-4 bg-slate-50">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg) => {
                      const isMine = msg.sender_id === user?.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
                              isMine
                                ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white'
                                : 'bg-white border border-slate-200 text-slate-900'
                            }`}
                          >
                            <p className="text-sm break-words">{msg.message}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(msg.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-3 border-t border-slate-200 flex gap-2 bg-white">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                  rows={1}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ChatWidget;
