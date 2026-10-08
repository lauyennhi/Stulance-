import React from 'react';
import { AuthModal } from './components/auth/AuthModal';
import { Navbar } from './components/common/Navbar';
import { ToastContainer } from './components/common/ToastContainer';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { CompanyDashboard } from './components/dashboard/CompanyDashboard';
import { SchoolDashboard } from './components/dashboard/SchoolDashboard';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { LandingPage } from './components/landing/LandingPage';
import { AppProvider, useApp } from './context/AppContext';

const MainContent: React.FC = () => {
  const { currentUser, activeRole } = useApp();

  if (!currentUser) {
    return <LandingPage />;
  }

  switch (activeRole) {
    case 'student':
      return <StudentDashboard />;
    case 'company':
      return <CompanyDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'school':
      return <SchoolDashboard />;
    default:
      return <LandingPage />;
  }
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#F5F9FF] text-[#16243D] flex flex-col selection:bg-[#A9CFFA]/50 selection:text-[#16243D]">
        <Navbar />
        <main className="flex-1">
          <MainContent />
        </main>
        <AuthModal />
        <ToastContainer />
      </div>
    </AppProvider>
  );
}
