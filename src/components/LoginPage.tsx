import React, { useState } from 'react';
import { User as UserIcon, Lock, Globe } from 'lucide-react';
import { User, UserRole } from '../App';
import SmartWaterLogo from '../assets/logo.png';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

type Mode = 'login' | 'signup' | 'forgot';

export function LoginPage({ onLogin }: LoginPageProps) {
  const [locale, setLocale] = useState<'fr' | 'en'>('fr');
  const [mode, setMode] = useState<Mode>('login');

  // login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // signup state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  // forgot password state
  const [resetEmail, setResetEmail] = useState('');

  const demoUsers = [
    { role: 'admin', name: 'Admin Système', email: 'admin@smartwater.com' },
    { role: 'manager', name: 'Gestionnaire Campus', email: 'manager@smartwater.com' },
    { role: 'occupant', name: 'Résident A1', email: 'occupant@smartwater.com' },
    { role: 'technician', name: 'Technicien Support', email: 'tech@smartwater.com' },
  ];

  const handleDemoLogin = (role: UserRole) => {
    const demoUser = demoUsers.find((u) => u.role === role);
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

  // submit login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      alert(locale === 'fr' ? 'Veuillez saisir votre adresse email' : 'Please enter your email');
      return;
    }

    const role: UserRole = trimmedEmail.includes('admin')
      ? 'admin'
      : trimmedEmail.includes('manager')
      ? 'manager'
      : trimmedEmail.includes('tech')
      ? 'technician'
      : 'occupant';

    onLogin({
      id: '1',
      name: 'Utilisateur',
      email: trimmedEmail,
      role,
      locale,
    });
  };

  // submit signup
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !signupEmail || !signupPassword) {
      alert(locale === 'fr' ? 'Veuillez remplir tous les champs' : 'Please fill in all fields');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      alert(
        locale === 'fr'
          ? 'Les mots de passe ne correspondent pas'
          : 'Passwords do not match'
      );
      return;
    }

    // démo : on connecte directement l'utilisateur après inscription
    onLogin({
      id: 'new-user',
      name: `${firstName} ${lastName}`,
      email: signupEmail,
      role: 'occupant',
      locale,
    });
  };

  // submit forgot password
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!resetEmail) {
      alert(locale === 'fr' ? 'Veuillez saisir votre adresse email' : 'Please enter your email');
      return;
    }

    // démo : juste un message
    alert(
      locale === 'fr'
        ? 'Un lien de réinitialisation a été envoyé (démo).'
        : 'A reset link has been sent (demo).'
    );

    setMode('login');
  };

  const texts = {
    fr: {
      subtitle: "Gestion écoresponsable de la consommation d'eau",
      email: 'Adresse email',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      firstName: 'Prénom',
      lastName: 'Nom',
      login: 'Se connecter',
      signup: 'Créer un compte',
      forgotPassword: 'Mot de passe oublié ?',
      quickLogin: 'Connexion rapide (démonstration)',
      resetInfo:
        'Saisissez votre adresse email et nous vous enverrons un lien de réinitialisation (démo).',
      sendReset: 'Envoyer le lien',
      noAccount: 'Pas encore de compte ?',
      haveAccount: 'Déjà un compte ?',
      backToLogin: 'Retour à la connexion',
      features: [
        'Suivi en temps réel',
        'Alertes intelligentes',
        'Prédiction IA',
        'Rapports détaillés',
      ],
    },
    en: {
      subtitle: 'Eco-responsible water consumption management',
      email: 'Email address',
      password: 'Password',
      confirmPassword: 'Confirm password',
      firstName: 'First name',
      lastName: 'Last name',
      login: 'Sign in',
      signup: 'Sign up',
      forgotPassword: 'Forgot password?',
      quickLogin: 'Quick login (demo)',
      resetInfo:
        'Enter your email address and we will send you a reset link (demo).',
      sendReset: 'Send reset link',
      noAccount: "Don't have an account yet?",
      haveAccount: 'Already have an account?',
      backToLogin: 'Back to login',
      features: [
        'Real-time monitoring',
        'Smart alerts',
        'AI predictions',
        'Detailed reports',
      ],
    },
  };

  const t = texts[locale];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-green-500 flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center text-white p-12">
        <div className="max-w-md">
          <div className="w-29 h-24 backdrop-blur-lg rounded-2xl flex items-center justify-center mt-12">
            <img
              src={SmartWaterLogo}
              alt="SmartWater logo"
              className="w-35 h-30 object-contain"
            />
          </div>

          <p className="text-xl text-blue-100 mb-15">{t.subtitle}</p>

          {/* Features */}
          <div className="space-y-3">
            {t.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
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

      {/* Right Panel - Login / Signup / Forgot */}
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
            {/* Mobile logo / subtitle */}
            <div className="flex items-center gap-3 mb-8 lg:hidden">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
                <img
                  src={SmartWaterLogo}
                  alt="SmartWater logo"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t.subtitle}</p>
              </div>
            </div>

            {/* LOGIN FORM */}
            {mode === 'login' && (
              <>
                <form onSubmit={handleLoginSubmit} className="space-y-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      {t.email}
                    </label>
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
                    <label className="block text-sm text-gray-700 mb-2">
                      {t.password}
                    </label>
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

                  <div className="flex justify-end text-xs mb-1">
                    <button
                      type="button"
                      className="text-blue-600 hover:underline"
                      onClick={() => setMode('forgot')}
                    >
                      {t.forgotPassword}
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-3 rounded-lg hover:from-blue-700 hover:to-green-600 transition-all"
                  >
                    {t.login}
                  </button>
                </form>

                <div className="text-xs text-gray-500 mb-6 text-center">
                  {t.noAccount}{' '}
                  <button
                    type="button"
                    className="text-blue-600 hover:underline font-medium"
                    onClick={() => setMode('signup')}
                  >
                    {t.signup}
                  </button>
                </div>

                {/* Demo Login */}
                <div className="border-t border-gray-200 pt-6">
                  <p className="text-xs text-gray-500 mb-3">
                    {t.quickLogin}
                  </p>
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
              </>
            )}

            {/* SIGNUP FORM */}
            {mode === 'signup' && (
              <>
                <form onSubmit={handleSignupSubmit} className="space-y-4 mb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        {t.firstName}
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        {t.lastName}
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      {t.email}
                    </label>
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        {t.password}
                      </label>
                      <input
                        type="password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        {t.confirmPassword}
                      </label>
                      <input
                        type="password"
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-3 rounded-lg hover:from-blue-700 hover:to-green-600 transition-all text-sm font-medium"
                  >
                    {t.signup}
                  </button>
                </form>

                <div className="text-xs text-gray-500 text-center">
                  {t.haveAccount}{' '}
                  <button
                    type="button"
                    className="text-blue-600 hover:underline font-medium"
                    onClick={() => setMode('login')}
                  >
                    {t.login}
                  </button>
                </div>
              </>
            )}

            {/* FORGOT PASSWORD FORM */}
            {mode === 'forgot' && (
              <>
                <form onSubmit={handleForgotSubmit} className="space-y-4 mb-4">
                  <p className="text-xs text-gray-500 mb-1">{t.resetInfo}</p>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      {t.email}
                    </label>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-3 rounded-lg hover:from-blue-700 hover:to-green-600 transition-all text-sm font-medium"
                  >
                    {t.sendReset}
                  </button>
                </form>

                <div className="text-xs text-gray-500 text-center">
                  <button
                    type="button"
                    className="text-blue-600 hover:underline font-medium"
                    onClick={() => setMode('login')}
                  >
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
