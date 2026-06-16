import React, { useState } from 'react';
import { Calendar, Clock, User, Mail, Phone, X } from 'lucide-react';
import { toast } from 'react-toastify';

const InterviewScheduler = ({ candidate, job, onClose }) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    type: 'presencial',
    location: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aqui você implementaria a API de agendamento
    toast.success('Entrevista agendada com sucesso!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-slate-900">Agendar Entrevista</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Candidato</label>
            <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
              <User className="w-4 h-4 text-slate-400" />
              <span>{candidate?.name}</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Vaga</label>
            <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
              <Briefcase className="w-4 h-4 text-slate-400" />
              <span>{job?.title}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  required
                  className="w-full pl-10 pr-3 py-2 border rounded-lg"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Horário</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="time"
                  required
                  className="w-full pl-10 pr-3 py-2 border rounded-lg"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="presencial">Presencial</option>
              <option value="online">Online (Video)</option>
              <option value="telefone">Telefone</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {formData.type === 'online' ? 'Link da Videochamada' : 'Local'}
            </label>
            <input
              type="text"
              placeholder={formData.type === 'online' ? 'https://meet.google.com/...' : 'Endereço da entrevista'}
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
            <textarea
              rows="3"
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Instruções adicionais..."
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Agendar Entrevista
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-slate-50">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewScheduler;
