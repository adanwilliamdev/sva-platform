import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI } from '../services/jobs';
import { toast } from 'react-toastify';
import { Briefcase, MapPin, DollarSign, FileText, List, Hash, X, Send, Building2, Tag } from 'lucide-react';

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary_range: '',
    description: '',
    requirements: '',
    skills_required: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const skillsArray = formData.skills_required.split(',').map(s => s.trim()).filter(s => s);
    const jobData = {
      ...formData,
      skills_required: JSON.stringify(skillsArray),
      requirements: JSON.stringify(formData.requirements.split('\n').filter(req => req.trim()))
    };
    try {
      await jobsAPI.create(jobData);
      toast.success('Vaga publicada com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao publicar vaga');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Publicar Nova Vaga</h1>
          <p className="text-slate-500 mt-1">Preencha os dados abaixo para criar uma nova oportunidade</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Título */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Título da Vaga <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="title"
                    required
                    className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-slate-900"
                    placeholder="Ex: Desenvolvedor Full Stack"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Empresa */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Empresa <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="company"
                    required
                    className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-slate-900"
                    placeholder="Nome da empresa"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Localização */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Localização
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-slate-900"
                    placeholder="São Paulo, SP ou Remoto"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Faixa Salarial */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Faixa Salarial
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="salary_range"
                    className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-slate-900"
                    placeholder="R$ 5.000 - R$ 8.000"
                    value={formData.salary_range}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Descrição */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Descrição da Vaga <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <FileText className="h-5 w-5 text-slate-400" />
                  </div>
                  <textarea
                    name="description"
                    required
                    rows="6"
                    className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-slate-900"
                    placeholder="Descreva as responsabilidades, atividades do dia a dia, benefícios..."
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-400">Descreva detalhadamente as atividades e benefícios da vaga</p>
              </div>

              {/* Requisitos */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Requisitos (um por linha)
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <List className="h-5 w-5 text-slate-400" />
                  </div>
                  <textarea
                    name="requirements"
                    rows="4"
                    className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-slate-900"
                    placeholder="Experiência com Python&#10;Conhecimento em React&#10;Inglês avançado"
                    value={formData.requirements}
                    onChange={handleChange}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-400">Adicione um requisito por linha</p>
              </div>

              {/* Habilidades */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Habilidades Requeridas (separadas por vírgula)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="skills_required"
                    className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-slate-900"
                    placeholder="Python, React, SQL, Docker"
                    value={formData.skills_required}
                    onChange={handleChange}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-400">Exemplo: Python, React, SQL, Git, Docker</p>
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition"
              >
                <X className="w-5 h-5" />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 shadow-sm hover:shadow-md"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Publicando...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Publicar Vaga
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
