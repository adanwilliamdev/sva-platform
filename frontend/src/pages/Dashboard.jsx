import React from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardRecrutador from './dashboard/DashboardRecrutador';
import DashboardCandidato from './dashboard/DashboardCandidato';

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user?.user_type === 'recruiter') {
    return <DashboardRecrutador />;
  }

  if (user?.user_type === 'candidate') {
    return <DashboardCandidato />;
  }

  return <div className="text-center py-8 text-slate-500">Perfil não identificado. Faça login novamente.</div>;
};

export default Dashboard;
