import React, { useState } from 'react';
import { User } from '../../App';
import { Sidebar } from '../navigation/Sidebar';
import { TopBar } from '../navigation/TopBar';
import { TechnicianDashboard } from '../technician/TechnicianDashboard';
import { SensorsStatus } from '../technician/SensorsStatus';
import { Interventions } from '../technician/Interventions';
import { DataQuality } from '../technician/DataQuality';

interface TechnicianLayoutProps {
  user: User;
  onLogout: () => void;
}

export function TechnicianLayout({ user, onLogout }: TechnicianLayoutProps) {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <TechnicianDashboard />;
      case 'sensors':
        return <SensorsStatus />;
      case 'interventions':
        return <Interventions />;
      case 'quality':
        return <DataQuality />;
      default:
        return <TechnicianDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex">
      <Sidebar 
        role="technician" 
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
