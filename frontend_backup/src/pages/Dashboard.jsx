import React from 'react';
import { useAuth } from '../context/AuthContext';
import RecruiterDashboard from '../components/Dashboard/RecruiterDashboard';
import CandidateDashboard from '../components/Dashboard/CandidateDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Bem-vindo, {user.full_name}!
      </h1>
      
      {user.user_type === 'recruiter' ? (
        <RecruiterDashboard />
      ) : (
        <CandidateDashboard />
      )}
    </div>
  );
};

export default Dashboard;
