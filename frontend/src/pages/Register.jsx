import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Briefcase, Mail, Lock, User, UserPlus, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ email: '', username: '', full_name: '', password: '', user_type: 'candidate' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      toast.success('Cadastro realizado com sucesso! Faça login para continuar.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao cadastrar');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div><div className="flex justify-center"><div className="gradient-bg p-3 rounded-2xl"><UserPlus className="w-12 h-12 text-white" /></div></div><h2 className="mt-6 text-center text-3xl font-extrabold text-primary dark:text-white">Criar conta</h2><p className="mt-2 text-center text-sm text-secondary">Comece sua jornada profissional</p></div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-primary dark:text-white mb-2">Nome Completo</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-5 w-5 text-gray-400" /></div><input name="full_name" type="text" required className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-default placeholder-gray-500 text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 transition" placeholder="Digite seu nome completo" value={formData.full_name} onChange={handleChange} /></div></div>
            <div><label className="block text-sm font-medium text-primary dark:text-white mb-2">Email</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div><input name="email" type="email" required className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-default placeholder-gray-500 text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 transition" placeholder="seu@email.com" value={formData.email} onChange={handleChange} /></div></div>
            <div><label className="block text-sm font-medium text-primary dark:text-white mb-2">Usuário</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-5 w-5 text-gray-400" /></div><input name="username" type="text" required className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-default placeholder-gray-500 text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 transition" placeholder="Escolha um usuário" value={formData.username} onChange={handleChange} /></div></div>
            <div><label className="block text-sm font-medium text-primary dark:text-white mb-2">Senha</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div><input name="password" type={showPassword ? 'text' : 'password'} required className="appearance-none relative block w-full pl-10 pr-12 py-3 border border-default placeholder-gray-500 text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 transition" placeholder="Crie uma senha" value={formData.password} onChange={handleChange} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">{showPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}</button></div></div>
            <div><label className="block text-sm font-medium text-primary dark:text-white mb-2">Tipo de Conta</label><select name="user_type" className="appearance-none relative block w-full px-4 py-3 border border-default placeholder-gray-500 text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 transition" value={formData.user_type} onChange={handleChange}><option value="candidate">👨‍💼 Candidato - Buscando oportunidades</option><option value="recruiter">🏢 Recrutador - Contratando talentos</option></select></div>
          </div>
          <div><button type="submit" disabled={loading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">{loading ? <div className="flex items-center gap-2"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>Cadastrando...</div> : <div className="flex items-center gap-2">Cadastrar<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" /></div>}</button></div>
        </form>
        <div className="text-center"><Link to="/login" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium transition">Já tem uma conta? Faça login →</Link></div>
      </div>
    </div>
  );
};

export default Register;
