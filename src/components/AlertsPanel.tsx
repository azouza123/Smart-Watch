import React, { useState, useEffect } from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle, X } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8081/api';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

interface Alerte {
  id: number;
  title: string;
  type: string;
  severity: string;
  status: string;
  batimentNom: string | null;
  zone: string;
  triggeredAt: string;
}

export function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alerte[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/alertes`, { headers: getAuthHeaders() })
      .then(r => r.json())
      .then(data => {
        // show only latest 3 open/in_progress alerts
        const filtered = data
          .filter((a: Alerte) => a.status === 'OPEN' || a.status === 'IN_PROGRESS')
          .slice(0, 3);
        setAlerts(filtered);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
      case 'HIGH': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'MEDIUM': return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      default: return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
      case 'HIGH': return 'bg-red-50 border-red-200';
      case 'MEDIUM': return 'bg-amber-50 border-amber-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'OPEN': return 'Ouverte';
      case 'IN_PROGRESS': return 'En cours';
      case 'RESOLVED': return 'Résolue';
      default: return status;
    }
  };

  const formatTime = (triggeredAt: string) => {
    if (!triggeredAt) return '—';
    const date = new Date(triggeredAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHrs < 1) return 'Il y a moins d\'une heure';
    if (diffHrs < 24) return `Il y a ${diffHrs} heure(s)`;
    return `Il y a ${Math.floor(diffHrs / 24)} jour(s)`;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gray-900">Alertes et notifications</h2>
        <span className="text-sm text-gray-500">{alerts.length} alerte(s) active(s)</span>
      </div>

      {loading && (
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && alerts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-2" />
          <p className="text-sm">Aucune alerte active — tout va bien!</p>
        </div>
      )}

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id}
            className={`p-4 rounded-lg border ${getAlertColor(alert.severity)} transition-all hover:shadow-sm`}>
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getAlertIcon(alert.severity)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-gray-900 text-sm font-medium">{alert.title}</h3>
                  <span className="text-xs text-gray-500">{formatTime(alert.triggeredAt)}</span>
                </div>
                <p className="text-sm text-gray-600">
                  📍 {alert.batimentNom || '—'} › {alert.zone || '—'}
                </p>
                <span className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full ${
                  alert.status === 'OPEN' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {getStatusLabel(alert.status)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}