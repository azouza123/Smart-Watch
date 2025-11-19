import React, { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { AdminLayout } from './components/layouts/AdminLayout';
import { ManagerLayout } from './components/layouts/ManagerLayout';
import { OccupantLayout } from './components/layouts/OccupantLayout';
import { TechnicianLayout } from './components/layouts/TechnicianLayout';

export type UserRole = 'admin' | 'manager' | 'occupant' | 'technician' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  locale: 'fr' | 'en';
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  switch (user.role) {
    case 'admin':
      return <AdminLayout user={user} onLogout={handleLogout} />;
    case 'manager':
      return <ManagerLayout user={user} onLogout={handleLogout} />;
    case 'occupant':
      return <OccupantLayout user={user} onLogout={handleLogout} />;
    case 'technician':
      return <TechnicianLayout user={user} onLogout={handleLogout} />;
    default:
      return <LoginPage onLogin={handleLogin} />;
  }
}
