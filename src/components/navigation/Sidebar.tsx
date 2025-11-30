import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Radio, 
  Shield, 
  Activity,
  Bell,
  ClipboardList,
  FileText,
  Target,
  Lightbulb,
  TrendingUp,
  Wrench,
  Database,
} from 'lucide-react';
import { UserRole } from '../../App';
import logo2 from '../../assets/logo2.png';

interface SidebarProps {
  role: UserRole;
  currentView: string;
  onNavigate: (view: string) => void;
}

const navigationByRole = {
  admin: [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'buildings', label: 'Bâtiments & Zones', icon: Building2 },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'sensors', label: 'Capteurs', icon: Radio },
    { id: 'rules', label: 'Règles & Seuils', icon: Shield },
    { id: 'health', label: 'État du système', icon: Activity },
  ],
  manager: [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'alerts', label: 'Alertes', icon: Bell },
    { id: 'actions', label: 'Actions correctives', icon: ClipboardList },
    { id: 'buildings', label: 'Détails bâtiments', icon: Building2 },
    { id: 'reports', label: 'Rapports', icon: FileText },
  ],
  occupant: [
    { id: 'dashboard', label: 'Ma consommation', icon: LayoutDashboard },
    { id: 'goals', label: 'Mes objectifs', icon: Target },
    { id: 'alerts', label: 'Mes alertes', icon: Bell },
    { id: 'tips', label: 'Conseils', icon: Lightbulb },
    { id: 'comparison', label: 'Comparaisons', icon: TrendingUp },
  ],
  technician: [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'sensors', label: 'État capteurs', icon: Radio },
    { id: 'interventions', label: 'Interventions', icon: Wrench },
    { id: 'quality', label: 'Qualité données', icon: Database },
  ],
};

export function Sidebar({ role, currentView, onNavigate }: SidebarProps) {
  if (!role) return null;
  
  const navigation = navigationByRole[role] || [];

  const getRoleColor = () => {
    switch (role) {
      case 'admin':
        return 'from-purple-600 to-purple-500';
      case 'manager':
        return 'from-blue-600 to-blue-500';
      case 'occupant':
        return 'from-green-600 to-green-500';
      case 'technician':
        return 'from-amber-600 to-amber-500';
      default:
        return 'from-blue-600 to-green-500';
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo card */}
      <div className="p-4">
        <div
          className={`bg-gradient-to-r ${getRoleColor()} rounded-xl px-4 py-1 flex items-center `}
        >
            <img
              src={logo2}
              alt="SmartWater logo"
              className="w-full h-full "
            />
          
          
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive ? 'text-blue-600' : 'text-gray-500'
                }`}
              />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Version 1.0.0
          <br />
          © 2025 SmartWater
        </div>
      </div>
    </aside>
  );
}
