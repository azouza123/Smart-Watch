import React, { useState } from 'react';
import { User } from '../../App';
import { Sidebar } from '../navigation/Sidebar';
import { TopBar } from '../navigation/TopBar';
import { OccupantDashboard } from '../occupant/OccupantDashboard';
import { MyGoals } from '../occupant/MyGoals';
import { MyAlerts } from '../occupant/MyAlerts';
import { TipsAndCoaching } from '../occupant/TipsAndCoaching';
import { MyComparison } from '../occupant/MyComparison';

interface OccupantLayoutProps {
  user: User;
  onLogout: () => void;
}

export function OccupantLayout({ user, onLogout }: OccupantLayoutProps) {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <OccupantDashboard />;
      case 'goals':
        return <MyGoals />;
      case 'alerts':
        return <MyAlerts />;
      case 'tips':
        return <TipsAndCoaching />;
      case 'comparison':
        return <MyComparison />;
      default:
        return <OccupantDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex">
      <Sidebar 
        role="occupant" 
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
