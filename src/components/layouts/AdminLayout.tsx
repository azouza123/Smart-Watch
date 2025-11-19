import React, { useState } from 'react';
import { User } from '../../App';
import { Sidebar } from '../navigation/Sidebar';
import { TopBar } from '../navigation/TopBar';
import { BuildingsManagement } from '../admin/BuildingsManagement';
import { UsersManagement } from '../admin/UsersManagement';
import { SensorsManagement } from '../admin/SensorsManagement';
import { RulesManagement } from '../admin/RulesManagement';
import { SystemHealth } from '../admin/SystemHealth';
import { AdminDashboard } from '../admin/AdminDashboard';

interface AdminLayoutProps {
  user: User;
  onLogout: () => void;
}

export function AdminLayout({ user, onLogout }: AdminLayoutProps) {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'buildings':
        return <BuildingsManagement />;
      case 'users':
        return <UsersManagement />;
      case 'sensors':
        return <SensorsManagement />;
      case 'rules':
        return <RulesManagement />;
      case 'health':
        return <SystemHealth />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex">
      <Sidebar 
        role="admin" 
        currentView={currentView} 
        onNavigate={setCurrentView}
      />
      <div className="flex-1 flex flex-col">
        <TopBar user={user} onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
