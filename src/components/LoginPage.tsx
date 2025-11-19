import React, { useState } from 'react';
import { User as UserIcon, Lock, Globe } from 'lucide-react';
import { User, UserRole } from '../App';
import SmartWaterLogo from '../assets/logo.png';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [locale, setLocale] = useState<'fr' | 'en'>('fr');

  const demoUsers = [
    { role: 'admin', name: 'Admin Système', email: 'admin@smartwater.com' },
    { role: 'manager', name: 'Gestionnaire Campus', email: 'manager@smartwater.com' },
    { role: 'occupant', name: 'Résident A1', email: 'occupant@smartwater.com' },
    { role: 'technician', name: 'Technicien Support', email: 'tech@smartwater.com' },
  ];

  const handleDemoLogin = (role: UserRole) => {
    const demoUser = demoUsers.find(u => u.role === role);
    if (demoUser) {
      onLogin({
        id: `${role}-1`,
        name: demoUser.name,
        email: demoUser.email,
        role,
        locale,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Démo: utilise l'email pour déterminer le rôle
    const role = email.includes('admin') ? 'admin'
      : email.includes('manager') ? 'manager'
      : email.includes('tech') ? 'technician'
      : 'occupant';

    onLogin({
      id: '1',
      name: 'Utilisateur',
      email,
      role,
      locale,
    });
  };

  const texts = {
    fr: {
      
      subtitle: 'Gestion écoresponsable de la consommation d\'eau',
      email: 'Adresse email',
      password: 'Mot de passe',
      login: 'Se connecter',
      features: [
        'Suivi en temps réel',
        'Alertes intelligentes',
        'Prédiction IA',
        'Rapports détaillés'
      ]
    },
    en: {
     
      subtitle: 'Eco-responsible water consumption management',
      email: 'Email address',
      password: 'Password',
      login: 'Sign in',
      features: [
        'Real-time monitoring',
        'Smart alerts',
        'AI predictions',
        'Detailed reports'
      ]
    }
  };

  const t = texts[locale];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-green-500 flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center text-white p-12">
        <div className="max-w-md">
          <div className="w-29 h-24 backdrop-blur-lg rounded-2xl flex items-center justify-center mt-6">
            <img
              src={SmartWaterLogo}
              alt="SmartWater logo"
              className="w-35 h-30 object-contain"
            />
          </div>
          
          <p className="text-xl text-blue-100 mb-8">{t.subtitle}</p>

        

          {/* Features */}
          <div className="space-y-3">
            {t.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-blue-50">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Language Selector */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              <Globe className="w-4 h-4" />
              {locale.toUpperCase()}
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-8 lg:hidden">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
               
              </div>
              <div>
               
                <p className="text-sm text-gray-600">{t.subtitle}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
              <div>
                <label className="block text-sm text-gray-700 mb-2">{t.email}</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="vous@exemple.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">{t.password}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="•••••••••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-3 rounded-lg hover:from-blue-700 hover:to-green-600 transition-all"
              >
                {t.login}
              </button>
            </form>

            {/* Demo Login */}
            <div className="border-t border-gray-200 pt-6">
  
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleDemoLogin('admin')}
                  className="px-4 py-2 border-2 border-purple-500 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors text-sm"
                >
                  Administrateur
                </button>
                <button
                  onClick={() => handleDemoLogin('manager')}
                  className="px-4 py-2 border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                >
                  Gestionnaire
                </button>
                <button
                  onClick={() => handleDemoLogin('occupant')}
                  className="px-4 py-2 border-2 border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-colors text-sm"
                >
                  Occupant
                </button>
                <button
                  onClick={() => handleDemoLogin('technician')}
                  className="px-4 py-2 border-2 border-amber-500 text-amber-600 rounded-lg hover:bg-amber-50 transition-colors text-sm"
                >
                  Technicien
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
