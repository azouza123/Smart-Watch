import React, { useState, useEffect } from 'react';
import { Droplets, TrendingDown, Target, Award, Trophy, X } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { User } from '../../App';

const API_BASE_URL = 'http://localhost:8081/api';
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

interface OccupantDashboardProps {
  user: User;
}

const usageData = [
  { name: 'Douche', value: 45, color: '#3b82f6' },
  { name: 'Cuisine', value: 25, color: '#10b981' },
  { name: 'Toilettes', value: 20, color: '#8b5cf6' },
  { name: 'Autre', value: 10, color: '#f59e0b' },
];

const weekData = [
  { day: 'Lun', consumption: 42, goal: 45 },
  { day: 'Mar', consumption: 38, goal: 45 },
  { day: 'Mer', consumption: 41, goal: 45 },
  { day: 'Jeu', consumption: 36, goal: 45 },
  { day: 'Ven', consumption: 40, goal: 45 },
  { day: 'Sam', consumption: 48, goal: 45 },
  { day: 'Dim', consumption: 35, goal: 45 },
];

export function OccupantDashboard({ user }: OccupantDashboardProps) {
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const [myCapteurs, setMyCapteurs] = useState<any[]>([]);
  const [myAlerts, setMyAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [capteursData, alertesData] = await Promise.all([
        fetch(`${API_BASE_URL}/capteurs`, { headers: getAuthHeaders() }).then(r => r.json()),
        fetch(`${API_BASE_URL}/alertes`, { headers: getAuthHeaders() }).then(r => r.json()),
      ]);
      setMyCapteurs(capteursData);
      // filter alerts that concern occupant's unit
      const userName = user.name?.split(' ')[0]?.toLowerCase() || '';
      setMyAlerts(alertesData.filter((a: any) =>
        a.status === 'OPEN' || a.status === 'IN_PROGRESS'
      ).slice(0, 3));
    } catch {
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  // real stats from capteurs
  const totalCapteurs = myCapteurs.length;
  const activeCapteurs = myCapteurs.filter(c => c.actif).length;
  const avgDebit = myCapteurs.length > 0
    ? (myCapteurs.reduce((sum, c) => sum + (c.debitActuel || 0), 0) / myCapteurs.length).toFixed(1)
    : '0';
  const openAlerts = myAlerts.filter(a => a.status === 'OPEN').length;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between">
          {error}<button onClick={() => setError('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      <div>
        <h1 className="text-gray-900 mb-2">Ma consommation</h1>
        <p className="text-gray-600">Bienvenue, {user.name}</p>
      </div>

      {/* Hero Card */}
      <div className="bg-gradient-to-r from-blue-600 to-green-500 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Droplets className="w-12 h-12" />
              <div>
                <p className="text-blue-100 text-sm">Débit moyen actuel</p>
                <h2 className="text-white text-4xl">{avgDebit} L/min</h2>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <TrendingDown className="w-5 h-5 text-green-300" />
              <p className="text-green-100">
                {activeCapteurs}/{totalCapteurs} capteurs actifs
              </p>
            </div>
            {openAlerts > 0 && (
              <div className="mt-2 px-3 py-1 bg-red-500/30 rounded-lg inline-block">
                <p className="text-sm text-white">⚠️ {openAlerts} alerte(s) ouverte(s)</p>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="w-32 h-32 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center mb-3">
              <div className="text-center">
                <div className="text-3xl mb-1">{activeCapteurs > 0 ? '✓' : '!'}</div>
                <div className="text-xs text-blue-100">
                  {activeCapteurs > 0 ? 'Actif' : 'Inactif'}
                </div>
              </div>
            </div>
            <p className="text-sm text-blue-100">{totalCapteurs} capteur(s)</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Capteurs actifs</h3>
          <p className="text-gray-900 text-2xl">{activeCapteurs} / {totalCapteurs}</p>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full"
              style={{ width: totalCapteurs > 0 ? `${(activeCapteurs / totalCapteurs) * 100}%` : '0%' }} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Débit moyen</h3>
          <p className="text-gray-900 text-2xl">{avgDebit} L/min</p>
          <p className="text-sm text-green-600 mt-2">Tous capteurs confondus</p>
        </div>

        <div className={`rounded-xl p-6 border ${openAlerts > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <Trophy className={`w-10 h-10 ${openAlerts > 0 ? 'text-red-600' : 'text-green-600'}`} />
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Alertes actives</h3>
          <p className={`text-2xl ${openAlerts > 0 ? 'text-red-900' : 'text-green-900'}`}>{openAlerts}</p>
          <p className={`text-sm mt-2 ${openAlerts > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {openAlerts > 0 ? 'Nécessite attention' : 'Tout va bien !'}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900">Consommation journalière</h2>
            <div className="flex gap-2">
              {(['week', 'month'] as const).map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`px-3 py-1 rounded-lg text-sm ${period === p ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                  {p === 'week' ? 'Semaine' : 'Mois'}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={weekData}>
              <defs>
                <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Area type="monotone" dataKey="goal" stroke="#10b981" strokeDasharray="3 3" fill="none" name="Objectif" />
              <Area type="monotone" dataKey="consumption" stroke="#3b82f6" fillOpacity={1} fill="url(#colorConsumption)" name="Consommation" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-gray-900 mb-4">Répartition par usage</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={usageData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                {usageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {usageData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-600">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      {myAlerts.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-gray-900 mb-4">Alertes récentes</h2>
          <div className="space-y-3">
            {myAlerts.map((alert: any) => (
              <div key={alert.id} className={`p-4 rounded-lg border ${
                alert.severity === 'CRITICAL' ? 'bg-red-50 border-red-200' :
                alert.severity === 'HIGH' ? 'bg-orange-50 border-orange-200' :
                'bg-amber-50 border-amber-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      📍 {alert.batimentNom || '—'} › {alert.zone || '—'}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    alert.status === 'OPEN' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {alert.status === 'OPEN' ? 'Ouverte' : 'En cours'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Badges */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-gray-900 mb-4">Mes badges</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Première semaine', icon: '🎯', earned: true },
            { name: 'Économe', icon: '💧', earned: activeCapteurs > 0 },
            { name: 'Top 20', icon: '🏆', earned: openAlerts === 0 },
            { name: 'Champion mensuel', icon: '👑', earned: false },
          ].map((badge, idx) => (
            <div key={idx} className={`p-4 rounded-lg text-center ${
              badge.earned
                ? 'bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-200'
                : 'bg-gray-50 border border-gray-200 opacity-50'
            }`}>
              <div className="text-3xl mb-2">{badge.icon}</div>
              <p className="text-sm text-gray-900">{badge.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}