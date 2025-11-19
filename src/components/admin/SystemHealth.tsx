import React from 'react';
import { Activity, Server, Database, Bell, FileText, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function SystemHealth() {
  const services = [
    { name: 'API Ingestion', status: 'operational', uptime: 99.98, responseTime: 145, requests: 245000 },
    { name: 'Base de données', status: 'operational', uptime: 99.95, responseTime: 23, requests: 450000 },
    { name: 'Service Alertes', status: 'operational', uptime: 99.92, responseTime: 89, requests: 12000 },
    { name: 'Service Prédiction', status: 'degraded', uptime: 98.50, responseTime: 890, requests: 8500 },
    { name: 'Exports/Rapports', status: 'operational', uptime: 99.88, responseTime: 234, requests: 3200 },
    { name: 'Notifications Email', status: 'operational', uptime: 99.91, responseTime: 156, requests: 15000 },
  ];

  const performanceData = [
    { time: '00:00', apiLatency: 120, dbLatency: 18, ingestionRate: 2400 },
    { time: '04:00', apiLatency: 110, dbLatency: 16, ingestionRate: 2200 },
    { time: '08:00', apiLatency: 180, dbLatency: 25, ingestionRate: 3800 },
    { time: '12:00', apiLatency: 200, dbLatency: 30, ingestionRate: 4200 },
    { time: '16:00', apiLatency: 170, dbLatency: 22, ingestionRate: 3900 },
    { time: '20:00', apiLatency: 140, dbLatency: 20, ingestionRate: 3200 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">État du système</h1>
        <p className="text-gray-600">Monitoring et observabilité de la plateforme</p>
      </div>

      {/* Global Status */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-lg flex items-center justify-center">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-white mb-1">Tous les systèmes sont opérationnels</h2>
              <p className="text-green-100 text-sm">Dernière vérification: il y a 2 minutes</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl mb-1">99.9%</div>
            <p className="text-green-100 text-sm">Uptime global (30j)</p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${
                  service.status === 'operational' 
                    ? 'bg-green-100' 
                    : 'bg-amber-100'
                } rounded-lg flex items-center justify-center`}>
                  {service.status === 'operational' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-gray-900 text-sm">{service.name}</h3>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600">Uptime</span>
                  <span className="text-gray-900">{service.uptime}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      service.uptime > 99 ? 'bg-green-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${service.uptime}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Latence</p>
                  <p className="text-sm text-gray-900">{service.responseTime}ms</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Requêtes</p>
                  <p className="text-sm text-gray-900">{(service.requests / 1000).toFixed(0)}k</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="mb-4">
          <h2 className="text-gray-900">Métriques de performance</h2>
          <p className="text-sm text-gray-500">Latence API et BD - Dernières 24 heures</p>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="time" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="apiLatency" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Latence API (ms)"
            />
            <Line 
              type="monotone" 
              dataKey="dbLatency" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Latence BD (ms)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Data Ingestion */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="mb-4">
          <h2 className="text-gray-900">Ingestion des données</h2>
          <p className="text-sm text-gray-500">Taux d'ingestion par heure</p>
        </div>
        
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="time" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="ingestionRate" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              name="Points/heure"
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total ingéré (24h)</p>
            <p className="text-purple-900">78,450</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Taux de réussite</p>
            <p className="text-green-900">99.7%</p>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Erreurs</p>
            <p className="text-amber-900">234</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Capteurs actifs</p>
            <p className="text-blue-900">242/245</p>
          </div>
        </div>
      </div>

      {/* Database Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-blue-600" />
            <h2 className="text-gray-900">Base de données</h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Utilisation disque</span>
                <span className="text-sm text-gray-900">67%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Connexions actives</span>
                <span className="text-sm text-gray-900">34/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '34%' }}></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center p-3 bg-gray-50 rounded">
                <p className="text-xs text-gray-600">Taille</p>
                <p className="text-sm text-gray-900">24.5 GB</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <p className="text-xs text-gray-600">Requêtes/sec</p>
                <p className="text-sm text-gray-900">1,234</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-6 h-6 text-green-600" />
            <h2 className="text-gray-900">Logs & Événements</h2>
          </div>
          <div className="space-y-3">
            {[
              { level: 'info', message: 'Batch d\'agrégation horaire complété', time: 'Il y a 15 min' },
              { level: 'warning', message: 'Latence élevée détectée sur API', time: 'Il y a 1 heure' },
              { level: 'info', message: 'Sauvegarde automatique réussie', time: 'Il y a 2 heures' },
              { level: 'error', message: 'Échec connexion capteur SEN-004', time: 'Il y a 3 heures' },
            ].map((log, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  log.level === 'error' ? 'bg-red-500' : 
                  log.level === 'warning' ? 'bg-amber-500' : 
                  'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{log.message}</p>
                  <p className="text-xs text-gray-500">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
