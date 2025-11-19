import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';

export function AlertsPanel() {
  const alerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Surconsommation détectée',
      message: 'La consommation dans la salle de bain dépasse de 15% la moyenne habituelle.',
      time: 'Il y a 2 heures',
    },
    {
      id: 2,
      type: 'info',
      title: 'Objectif hebdomadaire en vue',
      message: 'Vous êtes à 85% de votre objectif hebdomadaire. Continuez vos efforts!',
      time: 'Il y a 5 heures',
    },
    {
      id: 3,
      type: 'success',
      title: 'Économie réalisée',
      message: 'Vous avez économisé 240L cette semaine par rapport à la semaine dernière.',
      time: 'Hier',
    },
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gray-900">Alertes et notifications</h2>
        <button className="text-sm text-blue-600 hover:text-blue-700">
          Voir tout
        </button>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg border ${getAlertColor(alert.type)} transition-all hover:shadow-sm`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-gray-900 text-sm">{alert.title}</h3>
                  <span className="text-xs text-gray-500">{alert.time}</span>
                </div>
                <p className="text-sm text-gray-600">{alert.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
