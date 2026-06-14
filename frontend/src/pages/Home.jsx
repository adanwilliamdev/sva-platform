import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, TrendingUp, Zap, Sparkles, ArrowRight, CheckCircle, Users, Award, Clock, Target, BarChart, Shield } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Sparkles,
      title: 'Match Perfeito',
      description: 'Nossa IA analisa currículos e vagas para encontrar a compatibilidade ideal',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: TrendingUp,
      title: 'Ranking Inteligente',
      description: 'Candidatos são ranqueados automaticamente por compatibilidade com a vaga',
      color: 'from-emerald-500 to-green-500'
    },
    {
      icon: Zap,
      title: 'Processo Ágil',
      description: 'Agilize o recrutamento com análises automatizadas de currículos',
      color: 'from-blue-500 to-emerald-500'
    }
  ];

  const howItWorks = [
    { step: '01', title: 'Cadastre-se', description: 'Crie sua conta como candidato ou recrutador em poucos minutos', icon: Users },
    { step: '02', title: 'Complete seu perfil', description: 'Adicione suas habilidades, experiências e currículo', icon: Award },
    { step: '03', title: 'Encontre matches', description: 'Nossa IA encontra as melhores oportunidades para você', icon: Target },
    { step: '04', title: 'Candidate-se', description: 'Candidate-se às vagas com um clique e acompanhe o progresso', icon: BarChart }
  ];

  const stats = [
    { value: '95%', label: 'de precisão nas recomendações', icon: CheckCircle },
    { value: '70%', label: 'mais rápido no processo seletivo', icon: Clock },
    { value: '10k+', label: 'candidatos conectados', icon: Users },
    { value: '98%', label: 'de satisfação dos recrutadores', icon: Shield }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-600 to-emerald-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-lg rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Plataforma com IA</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              SVA - Sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-white">Vaga Aqui</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
              Conectamos talentos às melhores oportunidades usando inteligência artificial
            </p>
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Começar Agora
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </Link>
                <Link
                  to="/login"
                  className="group inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300"
                >
                  Já tenho conta
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50"></div>
      </div>

      {/* Estatísticas */}
      <div className="container mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-2xl p-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <stat.icon className="w-8 h-8 text-blue-500 mx-auto mb-3 group-hover:scale-110 transition" />
              <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Diferenciais</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Por que escolher o <span className="gradient-text">SVA?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tecnologia de ponta para conectar talentos às melhores oportunidades
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group bg-white rounded-2xl p-8 shadow-lg card-hover">
              <div className={`bg-gradient-to-br ${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Como Funciona */}
      <div className="bg-gradient-to-br from-blue-50 to-emerald-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Passo a Passo</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              Como funciona o <span className="gradient-text">SVA?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simples, rápido e eficiente
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition duration-300 shadow-lg">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold shadow-md">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      {!isAuthenticated && (
        <div className="container mx-auto px-6 py-20">
          <div className="bg-gradient-to-br from-blue-600 to-emerald-600 rounded-3xl p-12 text-center transform hover:scale-105 transition duration-500 shadow-2xl">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Pronto para começar?</h3>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de empresas e talentos que já transformaram seus processos de recrutamento
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Cadastre-se Gratuitamente
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </Link>
              <Link
                to="/jobs"
                className="group inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300"
              >
                Ver Vagas
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
