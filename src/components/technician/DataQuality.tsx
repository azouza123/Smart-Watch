import React from 'react';
import { Database, AlertTriangle, CheckCircle, TrendingUp, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function DataQuality() {
  const qualityData = [
    { hour: '00h', quality: 99.8, errors: 2 },
    { hour: '04h', quality: 99.9, errors: 1 },
    { hour: '08h', quality: 98.5, errors: 15 },
    { hour: '12h', quality: 99.2, errors: 8 },
    { hour: '16h', quality: 99.6, errors: 4 },
    { hour: '20h', quality: 99.7, errors: 3 },
  ];

  const issues = [
    {
      id: 1,
      type: 'missing_data',
      sensor: 'SEN-042',
      location: 'Campus B › B305',
      description: 'Pas de données reçues depuis 26 heures',
      severity: 'critical',
      firstDetected: '2025-10-30 08:00',
    },
    {
      id: 2,
      type: 'outlier',
      sensor: 'SEN-018',
      location: 'Campus A › A205',
      description: 'Valeur anormale détectée: 450 L/min (dépassement)',
      severity: 'high',
      firstDetected: '2025-10-31 06:15',
    },
    {
      id: 3,
      type: 'drift',
      sensor: 'SEN-027',
      location: 'Campus A › A310',
      description: 'Dérive progressive des valeurs observée',
      severity: 'medium',
      firstDetected: '2025-10-29 14:30',
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Qualité des données</h1>
        <p className="text-gray-600">Monitoring et validation des données capteurs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-2xl text-green-900">99.4%</span>
          </div>
          <p className="text-sm text-green-700">Qualité globale</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-blue-600" />
            <span className="text-2xl text-blue-900">78,450</span>
          </div>
          <p className="text-sm text-blue-700">Points reçus (24h)</p>
        </div>
        <div className="bg-red-50 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <span className="text-2xl text-red-900">{issues.length}</span>
          </div>
          <p className="text-sm text-red-700">Problèmes détectés</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <Database className="w-8 h-8 text-amber-600" />
            <span className="text-2xl text-amber-900">234</span>
          </div>
          <p className="text-sm text-amber-700">Erreurs (24h)</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-gray-900 mb-4">Évolution de la qualité (24h)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={qualityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="hour" stroke="#6b7280" />
            <YAxis stroke="#6b7280" domain={[95, 100]} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="quality" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Qualité (%)"
              dot={{ fill: '#10b981', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-gray-900 mb-4">Problèmes de qualité détectés</h2>
        <div className="space-y-4">
          {issues.map((issue) => (
            <div key={issue.id} className={`p-4 rounded-lg border ${getSeverityColor(issue.severity)}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`w-6 h-6 mt-1 ${
                    issue.severity === 'critical' ? 'text-red-600' :
                    issue.severity === 'high' ? 'text-orange-600' :
                    'text-amber-600'
                  }`} />
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-gray-900">{issue.sensor}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        issue.severity === 'critical' ? 'bg-red-600 text-white' :
                        issue.severity === 'high' ? 'bg-orange-600 text-white' :
                        'bg-amber-600 text-white'
                      }`}>
                        {issue.severity === 'critical' ? 'Critique' :
                         issue.severity === 'high' ? 'Urgent' :
                         'Moyen'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 mb-2">{issue.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>📍 {issue.location}</span>
                      <span>🕐 Détecté: {issue.firstDetected}</span>
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Investiguer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-gray-900 mb-4">Types d'erreurs (24h)</h3>
          <div className="space-y-3">
            {[
              { type: 'Données manquantes', count: 89, percent: 38 },
              { type: 'Valeurs aberrantes', count: 56, percent: 24 },
              { type: 'Dédoublonnage', count: 45, percent: 19 },
              { type: 'Dérive capteur', count: 32, percent: 14 },
              { type: 'Autres', count: 12, percent: 5 },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">{item.type}</span>
                  <span className="text-sm text-gray-900">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-gray-900 mb-4">Actions recommandées</h3>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <p className="text-sm text-gray-900">Intervention urgente</p>
              </div>
              <p className="text-xs text-gray-600">1 capteur hors ligne (SEN-042)</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-amber-600" />
                <p className="text-sm text-gray-900">Calibration nécessaire</p>
              </div>
              <p className="text-xs text-gray-600">2 capteurs avec dérive (SEN-018, SEN-027)</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <p className="text-sm text-gray-900">Maintenance préventive</p>
              </div>
              <p className="text-xs text-gray-600">5 capteurs à inspecter cette semaine</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
