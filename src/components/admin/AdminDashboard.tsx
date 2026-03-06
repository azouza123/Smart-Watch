import React, { useEffect, useState } from 'react';
import { Users, Building2, Radio, AlertTriangle, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { utilisateurApi, batimentApi } from '../../services/api';

export function AdminDashboard() {
  const [stats, setStats] = useState({ totalUtilisateurs: 0, nbAdministrateurs: 0, nbGestionnaires: 0, nbOccupants: 0, nbTechniciens: 0 });
  const [buildingCount, setBuildingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userStats, buildings] = await Promise.all([
          utilisateurApi.getStats(),
          batimentApi.getAll(),
        ]);
        setStats(userStats);
        setBuildingCount(buildings.length);
      } catch (err) {
        console.error('Erreur dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Bâtiments actifs', value: buildingCount.toString(), change: '', icon: Building2, color: 'blue' },
    { label: 'Utilisateurs', value: stats.totalUtilisateurs.toString(), change: '', icon: Users, color: 'purple' },
    { label: 'Techniciens', value: stats.nbTechniciens.toString(), change: '', icon: Radio, color: 'green' },
    { label: 'Gestionnaires', value: stats.nbGestionnaires.toString(), change: '', icon: AlertTriangle, color: 'amber' },
  ];

  const ingestionData = [
    { hour: '00h', points: 2400 }, { hour: '04h', points: 2200 },
    { hour: '08h', points: 3800 }, { hour: '12h', points: 4200 },
    { hour: '16h', points: 3900 }, { hour: '20h', points: 3200 },
  ];

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Vue d'ensemble système</h1>
        <p className="text-gray-600">Suivi global de la plateforme SmartWater</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => {
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
              </div>
              <h3 className="text-gray-600 text-sm mb-1">{stat.label}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="mb-4">
            <h2 className="text-gray-900 font-semibold">Ingestion des données</h2>
            <p className="text-sm text-gray-500">Points reçus par heure</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={ingestionData}>
              <defs>
                <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="hour" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Area type="monotone" dataKey="points" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPoints)" name="Points reçus" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Users breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="mb-4">
            <h2 className="text-gray-900 font-semibold">Répartition des utilisateurs</h2>
            <p className="text-sm text-gray-500">Par rôle</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[
              { role: 'Admins', count: stats.nbAdministrateurs },
              { role: 'Gestionnaires', count: stats.nbGestionnaires },
              { role: 'Techniciens', count: stats.nbTechniciens },
              { role: 'Occupants', count: stats.nbOccupants },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="role" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Utilisateurs" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-gray-900 font-semibold">État des services</h2>
            <p className="text-sm text-gray-500">Dernière vérification il y a 2 minutes</p>
          </div>
          <Activity className="w-6 h-6 text-green-600" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { service: 'API Backend', status: 'operational', uptime: '99.98%' },
            { service: 'Base de données', status: 'operational', uptime: '99.95%' },
            { service: 'Service Auth (JWT)', status: 'operational', uptime: '99.92%' },
            { service: 'Service Alertes', status: 'operational', uptime: '99.88%' },
            { service: 'Exports/Rapports', status: 'operational', uptime: '99.91%' },
            { service: 'Notifications Email', status: 'degraded', uptime: '98.50%' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-900">{item.service}</span>
                <span className={`w-2 h-2 rounded-full ${item.status === 'operational' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
              </div>
              <p className="text-xs text-gray-500">Uptime: {item.uptime}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}