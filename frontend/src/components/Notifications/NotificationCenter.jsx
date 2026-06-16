import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, XCircle, Clock, Eye, MessageCircle } from 'lucide-react';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Simular notificações em tempo real
  useEffect(() => {
    // Exemplo de notificações
    const demoNotifications = [
      { id: 1, type: 'success', title: 'Nova candidatura!', message: 'João Silva se candidatou para Desenvolvedor React', time: '5 min atrás', read: false, icon: Users },
      { id: 2, type: 'info', title: 'Vaga visualizada', message: 'Sua vaga "Dev Python" teve 15 visualizações hoje', time: '1 hora atrás', read: false, icon: Eye },
      { id: 3, type: 'warning', title: 'Candidato aprovado', message: 'Maria Santos foi aprovada para sua vaga', time: '2 horas atrás', read: true, icon: CheckCircle },
    ];
    setNotifications(demoNotifications);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-xl hover:bg-slate-100 transition"
      >
        <Bell className="w-5 h-5 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">Notificações</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:text-blue-700">
                Marcar todas como lidas
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nenhuma notificação</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition ${!notif.read ? 'bg-blue-50/50' : ''}`}
                >
                  <div className="flex gap-3">
                    <div className={`p-2 rounded-xl ${
                      notif.type === 'success' ? 'bg-green-100' :
                      notif.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                    }`}>
                      <notif.icon className={`w-4 h-4 ${
                        notif.type === 'success' ? 'text-green-600' :
                        notif.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 text-sm">{notif.title}</p>
                      <p className="text-slate-500 text-xs mt-1">{notif.message}</p>
                      <p className="text-slate-400 text-xs mt-1">{notif.time}</p>
                    </div>
                    {!notif.read && <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
