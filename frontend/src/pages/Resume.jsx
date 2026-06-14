import React, { useState, useEffect } from 'react';
import { resumesAPI } from '../services/resumes';
import { toast } from 'react-toastify';
import { FileText, Plus, Trash2, Clock, Save, X } from 'lucide-react';

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
      <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="gradient-bg px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-white" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Meus Currículos</h1>
                  <p className="text-white/80 text-sm">Gerencie seus currículos cadastrados</p>
                </div>
              </div>
              {!showForm && (
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-white transition">
                  <Plus className="w-4 h-4" />
                  Novo Currículo
                </button>
              )}
            </div>
          </div>

          <div className="p-8">
            {showForm && (
              <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Novo Currículo</h2>
                  <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Título *</label><input type="text" name="title" required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" value={formData.title} onChange={handleChange} placeholder="Ex: Desenvolvedor Full Stack - 2024" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Habilidades (separadas por vírgula)</label><input type="text" name="skills" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" value={formData.skills} onChange={handleChange} placeholder="Python, React, SQL, Git" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Experiência (uma por linha)</label><textarea name="experience" rows="4" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" value={formData.experience} onChange={handleChange} /></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Formação (uma por linha)</label><textarea name="education" rows="3" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" value={formData.education} onChange={handleChange} /></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Texto Completo (opcional)</label><textarea name="raw_text" rows="4" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" value={formData.raw_text} onChange={handleChange} placeholder="Cole aqui o texto completo do seu currículo para análise mais precisa" /></div>
                  <button type="submit" className="w-full btn-primary py-2 rounded-xl font-semibold flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Salvar Currículo</button>
                </form>
              </div>
            )}

            <div className="space-y-4">
              {resumes.map(resume => (
                <div key={resume.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-lg transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{resume.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-400"><Clock className="w-3 h-3" /> Criado em: {new Date(resume.created_at).toLocaleDateString('pt-BR')}</div>
                    </div>
                    <button className="text-red-500 hover:text-red-600 transition"><Trash2 className="w-5 h-5" /></button>
                  </div>
                </div>
              ))}
              {resumes.length === 0 && !showForm && (
                <div className="text-center py-12"><FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" /><p className="text-gray-500 dark:text-gray-400">Nenhum currículo cadastrado ainda.</p><button onClick={() => setShowForm(true)} className="mt-4 text-blue-600 hover:text-blue-700 font-medium">Cadastrar meu primeiro currículo →</button></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;
