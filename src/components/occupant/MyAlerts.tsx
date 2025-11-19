import React from 'react';
import { AlertCircle, CheckCircle, Info, TrendingUp } from 'lucide-react';

export function MyAlerts() {
  const alerts = [
    {
      id: 1,
      type: 'info',
      title: 'Objectif hebdomadaire presque atteint',
      message: 'Vous êtes à 88% de votre objectif. Il reste 35L pour cette semaine.',
      date: 'Aujourd\'hui 10:30',
      read: false,
    },
    {
      id: 2,
      type: 'warning',
      title: 'Consommation élevée détectée',
      message: 'Votre consommation d\'hier (48L) était supérieure à votre moyenne (40L).',
      date: 'Hier 08:00',
      read: false,
    },
    {
      id: 3,
      type: 'success',
      title: 'Félicitations !',
      message: 'Vous avez économisé 180L ce mois-ci par rapport au mois dernier.',
      date: 'Il y a 2 jours',
      read: true,
    },
    {
      id: 4,
      type: 'info',
      title: 'Nouveau conseil disponible',
      message: 'Découvrez comment réduire votre consommation sous la douche.',
      date: 'Il y a 3 jours',
      read: true,
    },
  ];

  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'warning':
        return { icon: AlertCircle, bgColor: 'bg-amber-50', borderColor: 'border-amber-200', iconColor: 'text-amber-600' };
      case 'success':
        return { icon: CheckCircle, bgColor: 'bg-green-50', borderColor: 'border-green-200', iconColor: 'text-green-600' };
      case 'info':
        return { icon: Info, bgColor: 'bg-blue-50', borderColor: 'border-blue-200', iconColor: 'text-blue-600' };
      default:
        return { icon: Info, bgColor: 'bg-gray-50', borderColor: 'border-gray-200', iconColor: 'text-gray-600' };
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Mes alertes</h1>
        <p className="text-gray-600">Notifications et conseils personnalisés</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <span className="text-2xl text-red-900">{alerts.filter(a => !a.read).length}</span>
          </div>
          <p className="text-sm text-red-700">Non lues</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Info className="w-8 h-8 text-blue-600" />
            <span className="text-2xl text-blue-900">{alerts.length}</span>
          </div>
          <p className="text-sm text-blue-700">Total (7 jours)</p>
        </div>
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <span className="text-2xl text-green-900">-15%</span>
          </div>
          <p className="text-sm text-green-700">Amélioration</p>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => {
          const style = getAlertStyle(alert.type);
          const Icon = style.icon;
          
          return (
            <div
              key={alert.id}
              className={`p-6 rounded-xl border ${style.bgColor} ${style.borderColor} ${
                !alert.read ? 'shadow-md' : 'opacity-75'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg bg-white`}>
                  <Icon className={`w-6 h-6 ${style.iconColor}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-gray-900">{alert.title}</h3>
                    {!alert.read && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                  <p className="text-xs text-gray-500">{alert.date}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
              <input
                type="checkbox"
                defaultChecked={pref.checked}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-900">{pref.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
