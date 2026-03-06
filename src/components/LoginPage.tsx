import React, { useState } from 'react';
import { User as UserIcon, Lock, Globe } from 'lucide-react';
import { User, UserRole } from '../App';
import SmartWaterLogo from '../assets/logo.png';
import { authApi } from '../services/api';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [locale, setLocale] = useState<'fr' | 'en'>('fr');

  // login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  // shared state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authApi.login(email, password);

      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('role', response.role);

      const role: UserRole =
        response.role === 'ADMINISTRATEUR' ? 'admin'
        : response.role === 'GESTIONNAIRE' ? 'manager'
        : response.role === 'TECHNICIEN' ? 'technician'
        : 'occupant';

      onLogin({
        id: response.id || '1',
        name: `${response.prenom} ${response.nom}`,
        email: response.email,
        role,
        locale,
      });
    } catch (err: any) {
      setError(locale === 'fr' ? 'Email ou mot de passe incorrect' : 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      setError(locale === 'fr' ? 'Veuillez saisir votre adresse email' : 'Please enter your email');
      return;
    }
    alert(locale === 'fr' ? 'Un lien de réinitialisation a été envoyé (démo).' : 'A reset link has been sent (demo).');
    setShowForgot(false);
    setResetEmail('');
  };

  const texts = {
    fr: {
      subtitle: "Gestion écoresponsable de la consommation d'eau",
      email: 'Adresse email',
      password: 'Mot de passe',
      login: 'Se connecter',
      forgotPassword: 'Mot de passe oublié ?',
      resetInfo: 'Saisissez votre email pour recevoir un lien de réinitialisation (démo).',
      sendReset: 'Envoyer le lien',
      backToLogin: 'Retour à la connexion',
      features: ['Suivi en temps réel', 'Alertes intelligentes', 'Prédiction IA', 'Rapports détaillés'],
    },
    en: {
      subtitle: 'Eco-responsible water consumption management',
      email: 'Email address',
      password: 'Password',
      login: 'Sign in',
      forgotPassword: 'Forgot password?',
      resetInfo: 'Enter your email address to receive a reset link (demo).',
      sendReset: 'Send reset link',
      backToLogin: 'Back to login',
      features: ['Real-time monitoring', 'Smart alerts', 'AI predictions', 'Detailed reports'],
    },
  };

  const t = texts[locale];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-green-500 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center text-white p-12">
        <div className="max-w-md">
          <div className="w-29 h-24 backdrop-blur-lg rounded-2xl flex items-center justify-center mt-12">
            <img src={SmartWaterLogo} alt="SmartWater logo" className="w-35 h-30 object-contain" />
          </div>
          <p className="text-xl text-blue-100 mb-15">{t.subtitle}</p>
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
          <p className="mt-8 text-sm text-blue-100">
            Optimisez la consommation d&apos;eau, réduisez les coûts et protégez les ressources.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Language Selector */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => { setLocale(locale === 'fr' ? 'en' : 'fr'); setError(''); }}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg text-white rounded-lg hover:bg-white/20 transition-colors">
              <Globe className="w-4 h-4" />
              {locale.toUpperCase()}
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {/* Mobile logo */}
            <div className="flex items-center gap-3 mb-8 lg:hidden">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
                <img src={SmartWaterLogo} alt="SmartWater logo" className="w-10 h-10 object-contain" />
              </div>
              <p className="text-sm text-gray-600">{t.subtitle}</p>
            </div>

            {!showForgot ? (
              // ✅ LOGIN FORM ONLY
              <>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    {locale === 'fr' ? 'Connexion' : 'Sign in'}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {locale === 'fr'
                      ? 'Accédez à votre espace SmartWatch'
                      : 'Access your SmartWatch space'}
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">{t.email}</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="vous@exemple.com"
                        required
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
                        onChange={e => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="•••••••••••••••"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end text-xs">
                    <button type="button" onClick={() => { setShowForgot(true); setError(''); }}
                      className="text-blue-600 hover:underline">
                      {t.forgotPassword}
                    </button>
                  </div>

                  {error && (
                    <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
                      {error}
                    </div>
                  )}

                  <button type="submit" disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-3 rounded-lg hover:from-blue-700 hover:to-green-600 transition-all disabled:opacity-60 font-medium">
                    {loading
                      ? (locale === 'fr' ? 'Connexion...' : 'Signing in...')
                      : t.login}
                  </button>
                </form>

                {/* ✅ Removed signup link — accounts created by admin only */}
                <p className="mt-4 text-xs text-center text-gray-400">
                  {locale === 'fr'
                    ? 'Votre compte est créé par votre administrateur.'
                    : 'Your account is created by your administrator.'}
                </p>
              </>
            ) : (
              // FORGOT PASSWORD FORM
              <>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    {locale === 'fr' ? 'Mot de passe oublié' : 'Forgot password'}
                  </h1>
                  <p className="text-sm text-gray-500">{t.resetInfo}</p>
                </div>

                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">{t.email}</label>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={e => setResetEmail(e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="vous@exemple.com"
                    />
                  </div>

                  {error && (
                    <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
                      {error}
                    </div>
                  )}

                  <button type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-3 rounded-lg hover:from-blue-700 hover:to-green-600 transition-all font-medium">
                    {t.sendReset}
                  </button>
                </form>

                <div className="mt-4 text-center">
                  <button type="button" onClick={() => { setShowForgot(false); setError(''); }}
                    className="text-blue-600 hover:underline text-sm">
                    {t.backToLogin}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}