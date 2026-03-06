import React, { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { AdminLayout } from './components/layouts/AdminLayout';
import { ManagerLayout } from './components/layouts/ManagerLayout';
import { OccupantLayout } from './components/layouts/OccupantLayout';
import { TechnicianLayout } from './components/layouts/TechnicianLayout';
import { authApi } from './services/api';

export type UserRole = 'admin' | 'manager' | 'occupant' | 'technician' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  locale: 'fr' | 'en';
}

// ✅ Read user from localStorage on first load
function getUserFromStorage(): User | null {
  try {
    const token = localStorage.getItem('token');
    const stored = localStorage.getItem('user');
    if (token && stored) {
      return JSON.parse(stored);
    }
  } catch {
    localStorage.removeItem('user'); // corrupted data — clean up
  }
  return null;
}

export default function App() {
  // ✅ Initialize from localStorage so reload keeps the session
  const [user, setUser] = useState<User | null>(getUserFromStorage);

  const handleLogin = (userData: User) => {
    // ✅ Persist user to localStorage on login
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    authApi.logout(); // clears token, refreshToken, role
    localStorage.removeItem('user'); // ✅ also remove user
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