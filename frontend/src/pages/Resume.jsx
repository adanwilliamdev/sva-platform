import React, { useState, useEffect } from 'react';
import { resumesAPI } from '../services/resumes';
import { toast } from 'react-toastify';
import { FileText, Plus, Trash2, Clock, Save, X, Upload, CheckCircle } from 'lucide-react';
import api from '../services/api';

const Resume = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    skills: '',
    experience: '',
    education: '',
    file: null
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

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este currículo?')) {
      try {
        await api.delete(`/resumes/${id}`);
        toast.success('Currículo excluído com sucesso!');
        fetchResumes();
      } catch (error) {
        toast.error('Erro ao excluir currículo');
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Apenas arquivos PDF e DOCX são permitidos');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Arquivo muito grande. Máximo 5MB');
        return;
      }
      setFormData({ ...formData, file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    if (formData.skills) formDataToSend.append('skills', JSON.stringify(formData.skills.split(',').map(s => s.trim())));
    if (formData.experience) formDataToSend.append('experience', JSON.stringify(formData.experience.split('\n').filter(exp => exp.trim())));
    if (formData.education) formDataToSend.append('education', JSON.stringify(formData.education.split('\n').filter(edu => edu.trim())));
    if (formData.file) formDataToSend.append('file', formData.file);
    
    try {
      await api.post('/resumes/', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Currículo cadastrado com sucesso! 🎉');
      setShowForm(false);
      setFormData({ title: '', skills: '', experience: '', education: '', file: null });
      fetchResumes();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao cadastrar currículo');
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Meus Currículos</h1>
            <p className="text-slate-500 text-sm">Gerencie seus currículos cadastrados</p>
          </div>
          {!showForm && (
            <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              <Plus className="w-4 h-4" /> Novo
            </button>
          )}
        </div>

        {showForm && (
          <div className="mb-6 bg-slate-50 rounded-xl p-6 border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Novo Currículo</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Título *</label>
                <input type="text" name="title" required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500" value={formData.title} onChange={handleChange} placeholder="Ex: Desenvolvedor Full Stack - 2024" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Upload do Currículo (PDF/DOCX)</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
                  <input type="file" accept=".pdf,.docx" onChange={handleFileChange} className="hidden" id="file-upload" />
                  <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                    <Upload className="w-10 h-10 text-slate-400 mb-2" />
                    <p className="text-slate-600">Clique para fazer upload</p>
                    <p className="text-xs text-slate-400 mt-1">PDF ou DOCX (max. 5MB)</p>
                  </label>
                </div>
                {formData.file && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="w-4 h-4" /> {formData.file.name}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Habilidades (separadas por vírgula)</label>
                <input type="text" name="skills" className="w-full px-4 py-2 border border-slate-200 rounded-lg" value={formData.skills} onChange={handleChange} placeholder="Python, React, SQL, Git" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Experiência (uma por linha)</label>
                <textarea name="experience" rows="4" className="w-full px-4 py-2 border border-slate-200 rounded-lg" value={formData.experience} onChange={handleChange} />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Formação (uma por linha)</label>
                <textarea name="education" rows="3" className="w-full px-4 py-2 border border-slate-200 rounded-lg" value={formData.education} onChange={handleChange} />
              </div>
              
              <button type="submit" disabled={uploading} className="w-full btn-primary justify-center">
                {uploading ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> Enviando...</> : <><Save className="w-4 h-4" /> Salvar Currículo</>}
              </button>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {resumes.map(resume => (
            <div key={resume.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-200 hover:shadow-sm transition">
              <div>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-slate-900">{resume.title}</h3>
                </div>
                {resume.file_name && (
                  <p className="text-xs text-slate-500 mt-1">📎 {resume.file_name}</p>
                )}
                <p className="text-xs text-slate-400 mt-1">📅 {new Date(resume.created_at).toLocaleDateString('pt-BR')}</p>
              </div>
              <button onClick={() => handleDelete(resume.id)} className="text-red-500 hover:text-red-600 transition p-2 hover:bg-red-50 rounded-lg">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          {resumes.length === 0 && !showForm && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Nenhum currículo cadastrado ainda.</p>
              <button onClick={() => setShowForm(true)} className="mt-4 text-blue-600 hover:text-blue-700 font-medium">
                Cadastrar meu primeiro currículo →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Resume;
