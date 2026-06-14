import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Briefcase, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.username, formData.password);
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao fazer login');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div><div className="flex justify-center"><div className="gradient-bg p-3 rounded-2xl"><Briefcase className="w-12 h-12 text-white" /></div></div><h2 className="mt-6 text-center text-3xl font-extrabold text-primary dark:text-white">Bem-vindo de volta</h2><p className="mt-2 text-center text-sm text-secondary">Faça login para continuar</p></div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-primary dark:text-white mb-2">Usuário</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div><input name="username" type="text" required className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-default placeholder-gray-500 text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 transition" placeholder="Digite seu usuário" value={formData.username} onChange={handleChange} /></div></div>
            <div><label className="block text-sm font-medium text-primary dark:text-white mb-2">Senha</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div><input name="password" type={showPassword ? 'text' : 'password'} required className="appearance-none relative block w-full pl-10 pr-12 py-3 border border-default placeholder-gray-500 text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 transition" placeholder="Digite sua senha" value={formData.password} onChange={handleChange} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">{showPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}</button></div></div>
          </div>
          <div><button type="submit" disabled={loading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg">{loading ? <div className="flex items-center gap-2"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>Entrando...</div> : <div className="flex items-center gap-2">Entrar<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" /></div>}</button></div>
        </form>
        <div className="text-center"><Link to="/register" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium transition">Não tem uma conta? Cadastre-se gratuitamente →</Link></div>
      </div>
    </div>
  );
};

export default Login;
