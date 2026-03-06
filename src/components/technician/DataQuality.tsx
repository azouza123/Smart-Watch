import React, { useState, useEffect } from 'react';
import { Database, AlertTriangle, CheckCircle, Activity, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_BASE_URL = 'http://localhost:8081/api';
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export function DataQuality() {
  const [capteurs, setCapteurs] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalCapteurs: 0, nbEnLigne: 0, nbHorsLigne: 0, nbBatterieFaible: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [capteursData, statsData] = await Promise.all([
        fetch(`${API_BASE_URL}/capteurs`, { headers: getAuthHeaders() }).then(r => r.json()),
        fetch(`${API_BASE_URL}/capteurs/stats`, { headers: getAuthHeaders() }).then(r => r.json()),
      ]);
      setCapteurs(capteursData);
      setStats(statsData);
    } catch {
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const qualityScore = stats.totalCapteurs > 0
    ? ((stats.nbEnLigne / stats.totalCapteurs) * 100).toFixed(1)
    : '0';

  // Issues = offline + low battery sensors
  const offlineSensors = capteurs.filter(c => !c.actif);
  const lowBatterySensors = capteurs.filter(c => c.actif && c.batterie < 20);
  const issues = [
    ...offlineSensors.map(c => ({
      id: c.id, type: 'offline', sensor: c.reference,
      location: `${c.zone || '—'} › ${c.logement || '—'}`,
      description: `Capteur hors ligne — aucune donnée reçue`,
      severity: 'critical',
    })),
    ...lowBatterySensors.map(c => ({
      id: c.id, type: 'low_battery', sensor: c.reference,
      location: `${c.zone || '—'} › ${c.logement || '—'}`,
      description: `Batterie faible à ${c.batterie}% — remplacement recommandé`,
      severity: 'high',
    })),
  ];

  // Mock quality chart (would need real time series data)
  const qualityData = [
    { hour: '00h', quality: parseFloat(qualityScore) },
    { hour: '04h', quality: Math.min(100, parseFloat(qualityScore) + 0.1) },
    { hour: '08h', quality: Math.min(100, parseFloat(qualityScore) - 0.5) },
    { hour: '12h', quality: Math.min(100, parseFloat(qualityScore) + 0.2) },
    { hour: '16h', quality: parseFloat(qualityScore) },
    { hour: '20h', quality: Math.min(100, parseFloat(qualityScore) + 0.1) },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

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
        <h1 className="text-gray-900 mb-2">Qualité des données</h1>
        <p className="text-gray-600">Monitoring et validation des données capteurs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`rounded-xl p-6 border ${parseFloat(qualityScore) >= 90 ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className={`w-8 h-8 ${parseFloat(qualityScore) >= 90 ? 'text-green-600' : 'text-amber-600'}`} />
            <span className={`text-2xl ${parseFloat(qualityScore) >= 90 ? 'text-green-900' : 'text-amber-900'}`}>{qualityScore}%</span>
          </div>
          <p className={`text-sm ${parseFloat(qualityScore) >= 90 ? 'text-green-700' : 'text-amber-700'}`}>Qualité globale</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-blue-600" />
            <span className="text-2xl text-blue-900">{stats.totalCapteurs}</span>
          </div>
          <p className="text-sm text-blue-700">Total capteurs</p>
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
            <span className="text-2xl text-amber-900">{stats.nbBatterieFaible}</span>
          </div>
          <p className="text-sm text-amber-700">Batteries faibles</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-gray-900 mb-4">Évolution de la qualité (24h)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={qualityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="hour" stroke="#6b7280" />
            <YAxis stroke="#6b7280" domain={[80, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="quality" stroke="#10b981" strokeWidth={2}
              name="Qualité (%)" dot={{ fill: '#10b981', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-gray-900 mb-4">Problèmes détectés ({issues.length})</h2>
        {issues.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-2" />
            <p>Aucun problème détecté — tous les capteurs fonctionnent correctement!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {issues.map((issue) => (
              <div key={`${issue.type}-${issue.id}`}
                className={`p-4 rounded-lg border ${getSeverityColor(issue.severity)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={`w-6 h-6 mt-1 ${
                      issue.severity === 'critical' ? 'text-red-600' :
                      issue.severity === 'high' ? 'text-orange-600' : 'text-amber-600'
                    }`} />
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-gray-900 font-medium">{issue.sensor}</h3>
                        <span className={`px-2 py-1 rounded text-xs ${
                          issue.severity === 'critical' ? 'bg-red-600 text-white' :
                          issue.severity === 'high' ? 'bg-orange-600 text-white' :
                          'bg-amber-600 text-white'
                        }`}>
                          {issue.severity === 'critical' ? 'Critique' :
                           issue.severity === 'high' ? 'Urgent' : 'Moyen'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 mb-2">{issue.description}</p>
                      <p className="text-sm text-gray-600">📍 {issue.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}