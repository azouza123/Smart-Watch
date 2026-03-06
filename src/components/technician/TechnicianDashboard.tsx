import React, { useState, useEffect } from 'react';
import { Radio, CheckCircle, AlertCircle, Battery, Wrench, Clock, X } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const API_BASE_URL = 'http://localhost:8081/api';
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export function TechnicianDashboard() {
  const [capteurStats, setCapteurStats] = useState({ totalCapteurs: 0, nbEnLigne: 0, nbHorsLigne: 0, nbBatterieFaible: 0 });
  const [alertes, setAlertes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [stats, alertesData] = await Promise.all([
        fetch(`${API_BASE_URL}/capteurs/stats`, { headers: getAuthHeaders() }).then(r => r.json()),
        fetch(`${API_BASE_URL}/alertes`, { headers: getAuthHeaders() }).then(r => r.json()),
      ]);
      setCapteurStats(stats);
      setAlertes(alertesData);
    } catch (err) {
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleStartAlert = async (id: number) => {
    try {
      await fetch(`${API_BASE_URL}/alertes/${id}/statut?statut=IN_PROGRESS`, {
        method: 'PUT', headers: getAuthHeaders()
      });
      await fetchAll();
    } catch {
      setError('Erreur lors de la mise à jour');
    }
  };

  const urgentAlerts = alertes
    .filter(a => a.status === 'OPEN' || a.status === 'IN_PROGRESS')
    .slice(0, 5);

  const statusData = [
    { name: 'En ligne', value: capteurStats.nbEnLigne, color: '#10b981' },
    { name: 'Hors ligne', value: capteurStats.nbHorsLigne, color: '#ef4444' },
    { name: 'Batterie faible', value: capteurStats.nbBatterieFaible, color: '#f59e0b' },
  ];

  const needsAttention = capteurStats.nbHorsLigne + capteurStats.nbBatterieFaible;

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
        <h1 className="text-gray-900 mb-2">Tableau de bord technicien</h1>
        <p className="text-gray-600">Monitoring et maintenance des capteurs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Radio className="w-8 h-8 text-gray-400" />
            <span className="text-2xl text-gray-900">{capteurStats.totalCapteurs}</span>
          </div>
          <p className="text-sm text-gray-600">Total capteurs</p>
        </div>
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-2xl text-green-900">{capteurStats.nbEnLigne}</span>
          </div>
          <p className="text-sm text-green-700">
            En ligne ({capteurStats.totalCapteurs > 0
              ? Math.round((capteurStats.nbEnLigne / capteurStats.totalCapteurs) * 100)
              : 0}%)
          </p>
        </div>
        <div className="bg-red-50 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <span className="text-2xl text-red-900">{needsAttention}</span>
          </div>
          <p className="text-sm text-red-700">Nécessitent attention</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Wrench className="w-8 h-8 text-blue-600" />
            <span className="text-2xl text-blue-900">
              {alertes.filter(a => a.status === 'IN_PROGRESS').length}
            </span>
          </div>
          <p className="text-sm text-blue-700">Interventions en cours</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-gray-900 mb-4">État des capteurs</h2>
          {capteurStats.totalCapteurs === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400">
              <p>Aucun capteur trouvé</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                  paddingAngle={2} dataKey="value"
                  label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-gray-900 mb-4">Alertes par statut</h2>
          {alertes.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400">
              <p>Aucune alerte</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[
                { statut: 'Ouvertes', count: alertes.filter(a => a.status === 'OPEN').length, fill: '#ef4444' },
                { statut: 'En cours', count: alertes.filter(a => a.status === 'IN_PROGRESS').length, fill: '#f59e0b' },
                { statut: 'Résolues', count: alertes.filter(a => a.status === 'RESOLVED').length, fill: '#10b981' },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="statut" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} name="Alertes"
                  fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Urgent tasks from real alerts */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-900">Tâches urgentes</h2>
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
            {urgentAlerts.length} prioritaires
          </span>
        </div>
        {urgentAlerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-2" />
            <p>Aucune tâche urgente — tout est sous contrôle!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {urgentAlerts.map((alert) => {
              const priorityColors: Record<string, string> = {
                CRITICAL: 'border-red-500 bg-red-50',
                HIGH: 'border-orange-500 bg-orange-50',
                MEDIUM: 'border-amber-500 bg-amber-50',
                LOW: 'border-gray-300 bg-gray-50',
              };
              const priorityLabels: Record<string, string> = {
                CRITICAL: 'Critique', HIGH: 'Urgent', MEDIUM: 'Moyen', LOW: 'Faible'
              };
              const priorityBadge: Record<string, string> = {
                CRITICAL: 'bg-red-600 text-white',
                HIGH: 'bg-orange-600 text-white',
                MEDIUM: 'bg-amber-600 text-white',
                LOW: 'bg-gray-600 text-white',
              };
              return (
                <div key={alert.id}
                  className={`p-4 rounded-lg border-l-4 ${priorityColors[alert.severity] || 'border-gray-300 bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <Wrench className="w-5 h-5 text-gray-600" />
                        <h3 className="text-gray-900 text-sm font-medium">{alert.title}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs ${priorityBadge[alert.severity] || 'bg-gray-600 text-white'}`}>
                          {priorityLabels[alert.severity] || alert.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        📍 {alert.batimentNom || '—'} › {alert.zone || '—'} › {alert.unit || '—'}
                      </p>
                      {alert.assignee && (
                        <p className="text-xs text-gray-500 mt-1">👤 {alert.assignee}</p>
                      )}
                    </div>
                    {alert.status === 'OPEN' && (
                      <button onClick={() => handleStartAlert(alert.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        Commencer
                      </button>
                    )}
                    {alert.status === 'IN_PROGRESS' && (
                      <span className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg text-sm">
                        En cours...
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}