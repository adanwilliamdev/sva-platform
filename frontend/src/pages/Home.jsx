import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, TrendingUp, Zap, Sparkles, ArrowRight, CheckCircle, Users, Award, Clock, Target, BarChart, Shield, Building2 } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    { 
      icon: Sparkles, 
      title: 'Match Perfeito', 
      description: 'Nossa IA analisa currículos e vagas para encontrar a compatibilidade ideal',
      iconBg: 'bg-blue-50 text-blue-600'
    },
    { 
      icon: TrendingUp, 
      title: 'Ranking Inteligente', 
      description: 'Candidatos são ranqueados automaticamente por compatibilidade com a vaga',
      iconBg: 'bg-emerald-50 text-emerald-600'
    },
    { 
      icon: Zap, 
      title: 'Processo Ágil', 
      description: 'Agilize o recrutamento com análises automatizadas de currículos',
      iconBg: 'bg-blue-50 text-blue-600'
    }
  ];

  const stats = [
    { value: '95%', label: 'de precisão nas recomendações', icon: CheckCircle },
    { value: '70%', label: 'mais rápido no processo seletivo', icon: Clock },
    { value: '10k+', label: 'candidatos conectados', icon: Users },
    { value: '98%', label: 'de satisfação dos recrutadores', icon: Shield }
  ];

  const howItWorks = [
    { step: '01', title: 'Cadastre-se', description: 'Crie sua conta como candidato ou recrutador em poucos minutos', icon: Users },
    { step: '02', title: 'Complete seu perfil', description: 'Adicione suas habilidades, experiências e currículo', icon: Award },
    { step: '03', title: 'Encontre matches', description: 'Nossa IA encontra as melhores oportunidades para você', icon: Target },
    { step: '04', title: 'Candidate-se', description: 'Candidate-se às vagas com um clique e acompanhe o progresso', icon: BarChart }
  ];

  return (
    <div>
      {/* Hero Section - com texto escuro para melhor contraste */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
        <div className="container mx-auto px-6 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 mb-6 shadow-sm border border-slate-200">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-slate-700">Plataforma com IA</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-slate-900">
              SVA - Sua <span className="text-blue-600">Vaga Aqui</span>
            </h1>
            {/* Texto agora em cinza escuro para bom contraste */}
            <p className="text-xl md:text-2xl mb-8 text-slate-600 max-w-2xl mx-auto">
              Conectamos talentos às melhores oportunidades usando inteligência artificial
            </p>
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="group inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                  Começar Agora
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </Link>
                <Link to="/login" className="group inline-flex items-center gap-2 bg-white text-slate-700 border-2 border-slate-300 px-8 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-300">
                  Já tenho conta
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-slate-50 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section - com altura igual nos cards */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Diferenciais</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">
              Por que escolher o <span className="text-blue-600">SVA?</span>
            </h2>
            <p className="text-xl text-slate-500 max-w-3xl mx-auto">
              Tecnologia de ponta para conectar talentos às melhores oportunidades
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-8 flex flex-col h-full">
                <div className={`${feature.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed flex-1">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section - fundo escuro com textos claros */}
      <div className="bg-slate-900 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-blue-400 font-semibold text-sm uppercase tracking-wide">Como Funciona</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
              Passo a Passo
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Simples, rápido e eficiente
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative inline-block">
                  <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition duration-300 shadow-lg border border-slate-700">
                    <item.icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {item.step}
                  </div>
                </div>
                {/* Título em branco */}
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                {/* Descrição em cinza claro para bom contraste */}
                <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="bg-white py-20">
          <div className="container mx-auto px-6">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-3xl p-12 text-center shadow-xl">
              <h3 className="text-3xl font-bold text-white mb-4">Pronto para começar?</h3>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Junte-se a milhares de empresas e talentos que já utilizam o SVA
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Cadastre-se Gratuitamente
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </Link>
                <Link to="/jobs" className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300">
                  Ver Vagas
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
