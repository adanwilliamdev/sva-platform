import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, TrendingUp, Zap, Sparkles, ArrowRight, CheckCircle, Users, Award, Clock, Target, BarChart, Shield } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const stats = [
    { value: '95%', label: 'precisão', icon: CheckCircle, color: 'text-[#D9B84A]' },
    { value: '70%', label: 'mais rápido', icon: Clock, color: 'text-[#8FA98C]' },
    { value: '10k+', label: 'candidatos', icon: Users, color: 'text-[#B5533C]' },
    { value: '98%', label: 'satisfação', icon: Shield, color: 'text-[#7C93AD]' },
  ];

  const features = [
    { icon: Sparkles, title: 'Match Perfeito', desc: 'IA analisa currículos e vagas', color: 'bg-[#241D10] text-[#D9B84A]' },
    { icon: TrendingUp, title: 'Ranking Inteligente', desc: 'Candidatos ranqueados por compatibilidade', color: 'bg-[#1C2620] text-[#8FA98C]' },
    { icon: Zap, title: 'Processo Ágil', desc: 'Análises automatizadas de currículos', color: 'bg-[#261915] text-[#B5533C]' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center shadow-lg">
            <Briefcase className="w-7 h-7 text-[#0B0A0E]" />
          </div>
        </div>
        <p className="text-xs uppercase tracking-[0.25em] text-[#8E8879] mb-4">Recrutamento orientado por inteligência artificial</p>
        <h1 className="font-display text-5xl md:text-6xl font-normal text-slate-900 mb-5 leading-[1.05]">
          Sua Vaga Aqui, <span className="gradient-text italic">com precisão</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-xl mx-auto mb-10">
          Conectamos talentos às melhores oportunidades usando inteligência artificial.
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card text-center">
            <stat.icon className={`w-7 h-7 ${stat.color} mx-auto mb-3`} />
            <p className="font-display text-3xl text-slate-900">{stat.value}</p>
            <p className="text-xs uppercase tracking-wide text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="text-center mb-10">
        <h2 className="font-display text-3xl text-slate-900">Por que escolher o SVA?</h2>
        <p className="text-sm text-slate-500 mt-2">Tecnologia de ponta para conectar talentos</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {features.map((feature, i) => (
          <div key={i} className="card text-center">
            <div className={`w-14 h-14 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <feature.icon className="w-6 h-6" />
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
