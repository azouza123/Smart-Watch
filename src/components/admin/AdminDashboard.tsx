import React from 'react';
import { Users, Building2, Radio, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export function AdminDashboard() {
  const stats = [
    { label: 'Bâtiments actifs', value: '12', change: '+2', icon: Building2, color: 'blue' },
    { label: 'Capteurs installés', value: '245', change: '+18', icon: Radio, color: 'green' },
    { label: 'Utilisateurs', value: '1,247', change: '+43', icon: Users, color: 'purple' },
    { label: 'Alertes ouvertes', value: '8', change: '-3', icon: AlertTriangle, color: 'amber' },
  ];

  const ingestionData = [
    { hour: '00h', points: 2400, errors: 12 },
    { hour: '04h', points: 2200, errors: 8 },
    { hour: '08h', points: 3800, errors: 15 },
    { hour: '12h', points: 4200, errors: 10 },
    { hour: '16h', points: 3900, errors: 6 },
    { hour: '20h', points: 3200, errors: 9 },
  ];

  const buildingUsage = [
    { building: 'Campus A', consumption: 12500, users: 450 },
    { building: 'Campus B', consumption: 9800, users: 320 },
    { building: 'Résidence C', consumption: 8200, users: 280 },
    { building: 'Bureaux D', consumption: 6500, users: 150 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Vue d'ensemble système</h1>
        <p className="text-gray-600">Suivi global de la plateforme SmartWater</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            purple: 'bg-purple-100 text-purple-600',
            amber: 'bg-amber-100 text-amber-600',
          };

          return (
            <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${colorClasses[stat.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-sm text-green-600">{stat.change}</span>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">{stat.label}</h3>
              <p className="text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ingestion Monitor */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="mb-4">
            <h2 className="text-gray-900">Ingestion des données</h2>
            <p className="text-sm text-gray-500">Points reçus et erreurs par heure</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={ingestionData}>
              <defs>
                <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="hour" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="points" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorPoints)"
                name="Points reçus"
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-600">Taux de réussite</p>
              <p className="text-blue-600">99.7%</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-gray-600">Latence moy.</p>
              <p className="text-green-600">145ms</p>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <p className="text-xs text-gray-600">Capteurs muets</p>
              <p className="text-amber-600">3</p>
            </div>
          </div>
        </div>

        {/* Building Usage */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="mb-4">
            <h2 className="text-gray-900">Consommation par bâtiment</h2>
            <p className="text-sm text-gray-500">Top 4 consommateurs</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={buildingUsage}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="building" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="consumption" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Consommation (L)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-gray-900">État des services</h2>
            <p className="text-sm text-gray-500">Dernière vérification il y a 2 minutes</p>
          </div>
          <Activity className="w-6 h-6 text-green-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { service: 'API Ingestion', status: 'operational', uptime: '99.98%' },
            { service: 'Base de données', status: 'operational', uptime: '99.95%' },
            { service: 'Service Alertes', status: 'operational', uptime: '99.92%' },
            { service: 'Service Prédiction', status: 'degraded', uptime: '98.50%' },
            { service: 'Exports/Rapports', status: 'operational', uptime: '99.88%' },
            { service: 'Notifications Email', status: 'operational', uptime: '99.91%' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-900">{item.service}</span>
                <span className={`w-2 h-2 rounded-full ${
                  item.status === 'operational' ? 'bg-green-500' : 'bg-amber-500'
                }`}></span>
              </div>
              <p className="text-xs text-gray-500">Uptime: {item.uptime}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-gray-900 mb-4">Activités récentes</h2>
        <div className="space-y-3">
          {[
            { action: 'Nouveau bâtiment créé', detail: 'Campus E - 50 logements', time: 'Il y a 15 min', user: 'Admin Principal' },
            { action: '18 capteurs installés', detail: 'Résidence C - Étages 3-5', time: 'Il y a 1 heure', user: 'Tech. Martin' },
            { action: 'Règle d\'alerte modifiée', detail: 'Seuil fuite nocturne: 2L/h → 1.5L/h', time: 'Il y a 2 heures', user: 'Admin Principal' },
            { action: '43 nouveaux utilisateurs', detail: 'Import groupe Campus B', time: 'Il y a 3 heures', user: 'Admin RH' },
          ].map((activity, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
                <p className="text-xs text-gray-600 mb-1">{activity.detail}</p>
                <p className="text-xs text-gray-500">Par {activity.user}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
