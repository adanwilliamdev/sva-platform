import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, TrendingUp, Zap, Sparkles, ArrowRight, CheckCircle, Users, Award, Clock, Target, BarChart, Shield } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const stats = [
    { value: '95%', label: 'precisão', icon: CheckCircle, color: 'text-blue-600' },
    { value: '70%', label: 'mais rápido', icon: Clock, color: 'text-emerald-600' },
    { value: '10k+', label: 'candidatos', icon: Users, color: 'text-purple-600' },
    { value: '98%', label: 'satisfação', icon: Shield, color: 'text-orange-600' },
  ];

  const features = [
    { icon: Sparkles, title: 'Match Perfeito', desc: 'IA analisa currículos e vagas', color: 'bg-blue-50 text-blue-600' },
    { icon: TrendingUp, title: 'Ranking Inteligente', desc: 'Candidatos ranqueados por compatibilidade', color: 'bg-emerald-50 text-emerald-600' },
    { icon: Zap, title: 'Processo Ágil', desc: 'Análises automatizadas de currículos', color: 'bg-orange-50 text-orange-600' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 gradient-bg rounded-2xl flex items-center justify-center shadow-lg">
            <Briefcase className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          SVA - <span className="gradient-text">Sua Vaga Aqui</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
          Conectamos talentos às melhores oportunidades usando inteligência artificial
        </p>
        {!isAuthenticated && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary justify-center">
              Começar Agora <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="btn-outline justify-center">Já tenho conta</Link>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card text-center">
            <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Por que escolher o SVA?</h2>
        <p className="text-sm text-slate-500">Tecnologia de ponta para conectar talentos</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {features.map((feature, i) => (
          <div key={i} className="card text-center hover:shadow-lg">
            <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
              <feature.icon className="w-7 h-7" />
            </div>
            <h3 className="font-semibold text-slate-900">{feature.title}</h3>
            <p className="text-sm text-slate-500 mt-1">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
