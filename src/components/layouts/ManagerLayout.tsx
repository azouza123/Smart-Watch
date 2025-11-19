import React, { useState } from 'react';
import { User } from '../../App';
import { Sidebar } from '../navigation/Sidebar';
import { TopBar } from '../navigation/TopBar';
import { ManagerDashboard } from '../manager/ManagerDashboard';
import { AlertsManagement } from '../manager/AlertsManagement';
import { ActionsManagement } from '../manager/ActionsManagement';
import { ReportsView } from '../manager/ReportsView';
import { BuildingDetailsView } from '../manager/BuildingDetailsView';

interface ManagerLayoutProps {
  user: User;
  onLogout: () => void;
}

export function ManagerLayout({ user, onLogout }: ManagerLayoutProps) {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <ManagerDashboard />;
      case 'alerts':
        return <AlertsManagement />;
      case 'actions':
        return <ActionsManagement />;
      case 'buildings':
        return <BuildingDetailsView />;
      case 'reports':
        return <ReportsView />;
      default:
        return <ManagerDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex">
      <Sidebar 
        role="manager" 
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
