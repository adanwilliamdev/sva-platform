import React, { useState, useEffect } from 'react';
import { resumesAPI } from '../services/resumes';
import { toast } from 'react-toastify';
import { FileText, Plus, Trash2, Clock, Award, Save, X } from 'lucide-react';

const Resume = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    skills: '',
    experience: '',
    education: '',
    raw_text: ''
  });

  useEffect(() => { fetchResumes(); }, []);

  const fetchResumes = async () => {
    try {
      const response = await resumesAPI.getAll();
      setResumes(response.data);
    } catch (error) {
      toast.error('Erro ao carregar currículos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resumeData = {
      ...formData,
      skills: JSON.stringify(formData.skills.split(',').map(s => s.trim())),
      experience: JSON.stringify(formData.experience.split('\n').filter(exp => exp.trim())),
      education: JSON.stringify(formData.education.split('\n').filter(edu => edu.trim()))
    };
    try {
      await resumesAPI.create(resumeData);
      toast.success('Currículo cadastrado com sucesso!');
      setShowForm(false);
      setFormData({ title: '', skills: '', experience: '', education: '', raw_text: '' });
      fetchResumes();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao cadastrar currículo');
    }
  };

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-emerald-600 px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-white" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Meus Currículos</h1>
                  <p className="text-white/80 text-sm">Gerencie seus currículos cadastrados</p>
                </div>
              </div>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-white transition"
                >
                  <Plus className="w-4 h-4" />
                  Novo Currículo
                </button>
              )}
            </div>
          </div>

          <div className="p-8">
            {showForm && (
              <div className="mb-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Novo Currículo</h2>
                  <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
                    <input type="text" name="title" required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" value={formData.title} onChange={handleChange} placeholder="Ex: Desenvolvedor Full Stack - 2024" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Habilidades (separadas por vírgula)</label>
                    <input type="text" name="skills" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" value={formData.skills} onChange={handleChange} placeholder="Python, React, SQL, Git" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experiência (uma por linha)</label>
                    <textarea name="experience" rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" value={formData.experience} onChange={handleChange} placeholder="Empresa XPTO - Desenvolvedor (2022-2024)&#10;Startup ABC - Estagiário (2021-2022)" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Formação (uma por linha)</label>
                    <textarea name="education" rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" value={formData.education} onChange={handleChange} placeholder="Universidade XYZ - Bacharelado (2024)&#10;Curso Técnico (2020)" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Texto Completo (opcional)</label>
                    <textarea name="raw_text" rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" value={formData.raw_text} onChange={handleChange} placeholder="Cole aqui o texto completo do seu currículo para análise mais precisa" />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="flex-1 btn-gradient text-white py-2 rounded-xl font-semibold flex items-center justify-center gap-2">
                      <Save className="w-4 h-4" />
                      Salvar Currículo
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-4">
              {resumes.map(resume => (
                <div key={resume.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{resume.title}</h3>
                      {resume.skills && (() => {
                        try {
                          const skills = JSON.parse(resume.skills);
                          return (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {skills.slice(0, 5).map((skill, idx) => (
                                <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs">{skill}</span>
                              ))}
                            </div>
                          );
                        } catch { return null; }
                      })()}
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        Criado em: {new Date(resume.created_at).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <button className="text-red-500 hover:text-red-600 transition">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}

              {resumes.length === 0 && !showForm && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum currículo cadastrado ainda.</p>
                  <button onClick={() => setShowForm(true)} className="mt-4 text-blue-600 hover:text-blue-700 font-medium">
                    Cadastrar meu primeiro currículo →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Resume;
