import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, TrendingUp, X } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8081/api';
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export function MyAlerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [alertStats, setAlertStats] = useState({ total: 0, nbOpen: 0, nbInProgress: 0, nbResolved: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [alertsData, statsData] = await Promise.all([
        fetch(`${API_BASE_URL}/alertes`, { headers: getAuthHeaders() }).then(r => r.json()),
        fetch(`${API_BASE_URL}/alertes/stats`, { headers: getAuthHeaders() }).then(r => r.json()),
      ]);
      setAlerts(alertsData);
      setAlertStats(statsData);
    } catch {
      setError('Erreur lors du chargement des alertes');
    } finally {
      setLoading(false);
    }
  };

  const getAlertStyle = (severity: string, status: string) => {
    if (status === 'RESOLVED') return {
      icon: CheckCircle, bgColor: 'bg-green-50', borderColor: 'border-green-200', iconColor: 'text-green-600'
    };
    switch (severity) {
      case 'CRITICAL':
      case 'HIGH': return { icon: AlertCircle, bgColor: 'bg-red-50', borderColor: 'border-red-200', iconColor: 'text-red-600' };
      case 'MEDIUM': return { icon: AlertCircle, bgColor: 'bg-amber-50', borderColor: 'border-amber-200', iconColor: 'text-amber-600' };
      default: return { icon: Info, bgColor: 'bg-blue-50', borderColor: 'border-blue-200', iconColor: 'text-blue-600' };
    }
  };

  const formatTime = (triggeredAt: string) => {
    if (!triggeredAt) return '—';
    const date = new Date(triggeredAt);
    const now = new Date();
    const diffHrs = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffHrs < 1) return "Il y a moins d'une heure";
    if (diffHrs < 24) return `Il y a ${diffHrs} heure(s)`;
    return `Il y a ${Math.floor(diffHrs / 24)} jour(s)`;
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'OPEN': return 'Ouverte';
      case 'IN_PROGRESS': return 'En cours';
      case 'RESOLVED': return 'Résolue';
      default: return status;
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Mes alertes</h1>
        <p className="text-gray-600">Notifications et anomalies détectées</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between">
          {error}<button onClick={() => setError('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <span className="text-2xl text-red-900">{alertStats.nbOpen}</span>
          </div>
          <p className="text-sm text-red-700">Ouvertes</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <Info className="w-8 h-8 text-amber-600" />
            <span className="text-2xl text-amber-900">{alertStats.nbInProgress}</span>
          </div>
          <p className="text-sm text-amber-700">En cours</p>
        </div>
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <span className="text-2xl text-green-900">{alertStats.nbResolved}</span>
          </div>
          <p className="text-sm text-green-700">Résolues</p>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <p className="font-medium">Aucune alerte — tout va bien!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => {
            const style = getAlertStyle(alert.severity, alert.status);
            const Icon = style.icon;
            const isResolved = alert.status === 'RESOLVED';
            return (
              <div key={alert.id}
                className={`p-6 rounded-xl border ${style.bgColor} ${style.borderColor} ${isResolved ? 'opacity-75' : 'shadow-md'}`}>
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-white">
                    <Icon className={`w-6 h-6 ${style.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-gray-900 font-medium">{alert.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        alert.status === 'OPEN' ? 'bg-red-100 text-red-700' :
                        alert.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {getStatusLabel(alert.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      📍 {alert.batimentNom || '—'} › {alert.zone || '—'} › {alert.unit || '—'}
                    </p>
                    {alert.threshold && alert.actual && (
                      <p className="text-sm text-gray-600 mb-2">
                        Seuil: {alert.threshold} L/h → Détecté: <span className="text-red-600 font-medium">{alert.actual} L/h</span>
                      </p>
                    )}
                    <p className="text-xs text-gray-500">{formatTime(alert.triggeredAt)}</p>
                    {alert.assignee && (
                      <p className="text-xs text-gray-500 mt-1">👤 Assigné à: {alert.assignee}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Notification preferences — UI only */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-gray-900 mb-4">Préférences de notification</h2>
        <div className="space-y-3">
          {[
            { label: 'Alertes de surconsommation', checked: true },
            { label: 'Rappels d\'objectifs', checked: true },
            { label: 'Conseils hebdomadaires', checked: true },
            { label: 'Classement et badges', checked: false },
          ].map((pref, idx) => (
            <label key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <input type="checkbox" defaultChecked={pref.checked}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
              <span className="text-sm text-gray-900">{pref.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}