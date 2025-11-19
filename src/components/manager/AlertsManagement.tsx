import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, CheckCircle, Clock, User, FileText, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export function AlertsManagement() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState<number | null>(null);

  const alerts = [
    {
      id: 1,
      type: 'overconsumption',
      severity: 'high',
      status: 'open',
      title: 'Surconsommation détectée - Bâtiment Nord',
      building: 'Campus A',
      zone: 'Bâtiment Nord',
      unit: 'A103',
      triggeredAt: '2025-10-31 08:30',
      threshold: 45,
      actual: 68,
      assignee: null,
      notes: [],
    },
    {
      id: 2,
      type: 'leak',
      severity: 'critical',
      status: 'in_progress',
      title: 'Fuite nocturne probable - Logement A201',
      building: 'Campus A',
      zone: 'Bâtiment Sud',
      unit: 'A201',
      triggeredAt: '2025-10-31 02:15',
      threshold: 1.5,
      actual: 4.2,
      assignee: 'Technicien Martin',
      notes: [
        { author: 'Gestionnaire', text: 'Technicien assigné pour intervention', time: '08:45' }
      ],
    },
    {
      id: 3,
      type: 'sensor',
      severity: 'medium',
      status: 'open',
      title: 'Capteur muet - SEN-042',
      building: 'Campus B',
      zone: 'Résidence',
      unit: 'B305',
      triggeredAt: '2025-10-30 18:20',
      threshold: 2,
      actual: 28,
      assignee: null,
      notes: [],
    },
    {
      id: 4,
      type: 'overconsumption',
      severity: 'medium',
      status: 'resolved',
      title: 'Dépassement objectif hebdomadaire',
      building: 'Campus A',
      zone: 'Bâtiment Est',
      unit: 'A305',
      triggeredAt: '2025-10-29 16:00',
      threshold: 200,
      actual: 245,
      assignee: 'Gestionnaire Campus',
      notes: [
        { author: 'Gestionnaire', text: 'Conseil envoyé au résident', time: '16:30' },
        { author: 'Résident', text: 'Problème identifié et corrigé', time: '17:15' }
      ],
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium':
        return 'text-amber-600 bg-amber-100 border-amber-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return { label: 'Ouverte', color: 'bg-red-100 text-red-700', icon: AlertCircle };
      case 'in_progress':
        return { label: 'En cours', color: 'bg-amber-100 text-amber-700', icon: Clock };
      case 'resolved':
        return { label: 'Résolue', color: 'bg-green-100 text-green-700', icon: CheckCircle };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-700', icon: AlertTriangle };
    }
  };

  const filteredAlerts = statusFilter === 'all' 
    ? alerts 
    : alerts.filter(a => a.status === statusFilter);

  const selectedAlertData = selectedAlert ? alerts.find(a => a.id === selectedAlert) : null;

  // Sample data for alert graph
  const alertGraphData = [
    { time: '00:00', value: 15 },
    { time: '01:00', value: 18 },
    { time: '02:00', value: 68 }, // Alert triggered
    { time: '03:00', value: 65 },
    { time: '04:00', value: 22 },
    { time: '05:00', value: 20 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Gestion des alertes</h1>
          <p className="text-gray-600">Suivi et résolution des anomalies détectées</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-8 h-8 text-gray-400" />
            <span className="text-2xl text-gray-900">{alerts.length}</span>
          </div>
          <p className="text-sm text-gray-600">Total alertes (7j)</p>
        </div>
        <div className="bg-red-50 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <span className="text-2xl text-red-900">{alerts.filter(a => a.status === 'open').length}</span>
          </div>
          <p className="text-sm text-red-700">Ouvertes</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-amber-600" />
            <span className="text-2xl text-amber-900">{alerts.filter(a => a.status === 'in_progress').length}</span>
          </div>
          <p className="text-sm text-amber-700">En cours</p>
        </div>
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-2xl text-green-900">{alerts.filter(a => a.status === 'resolved').length}</span>
          </div>
          <p className="text-sm text-green-700">Résolues</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex gap-2">
          {['all', 'open', 'in_progress', 'resolved'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'Toutes' : getStatusBadge(status).label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts List */}
        <div className="lg:col-span-1 space-y-4">
          {filteredAlerts.map((alert) => {
            const statusInfo = getStatusBadge(alert.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <div
                key={alert.id}
                onClick={() => setSelectedAlert(alert.id)}
                className={`bg-white rounded-xl p-4 shadow-sm border-2 cursor-pointer transition-all hover:shadow-md ${
                  selectedAlert === alert.id ? 'border-blue-500' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${statusInfo.color} flex items-center gap-1`}>
                    <StatusIcon className="w-3 h-3" />
                    {statusInfo.label}
                  </span>
                </div>
                
                <h3 className="text-sm text-gray-900 mb-2">{alert.title}</h3>
                
                <div className="text-xs text-gray-600 space-y-1">
                  <p>📍 {alert.building} › {alert.zone} › {alert.unit}</p>
                  <p>🕐 {alert.triggeredAt}</p>
                  {alert.assignee && (
                    <p className="flex items-center gap-1">
                      <User className="w-3 h-3" /> {alert.assignee}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Alert Detail */}
        <div className="lg:col-span-2">
          {selectedAlertData ? (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-gray-900 mb-2">{selectedAlertData.title}</h2>
                  <p className="text-sm text-gray-600">
                    {selectedAlertData.building} › {selectedAlertData.zone} › {selectedAlertData.unit}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedAlert(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Alert Graph */}
              <div className="mb-6">
                <h3 className="text-gray-900 text-sm mb-4">Évolution autour de l'événement</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={alertGraphData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="time" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <ReferenceLine 
                      y={selectedAlertData.threshold} 
                      stroke="#ef4444" 
                      strokeDasharray="3 3"
                      label="Seuil"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Consommation (L/h)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Seuil configuré</p>
                  <p className="text-gray-900">{selectedAlertData.threshold} L/h</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Valeur détectée</p>
                  <p className="text-red-900">{selectedAlertData.actual} L/h</p>
                </div>
              </div>

              {/* Actions */}
              <div className="mb-6">
                <h3 className="text-gray-900 text-sm mb-3">Actions</h3>
                <div className="flex gap-2">
                  <select className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Assigner à...</option>
                    <option value="tech1">Technicien Martin</option>
                    <option value="tech2">Technicien Dupont</option>
                  </select>
                  <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                    Marquer en cours
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Résoudre
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h3 className="text-gray-900 text-sm mb-3">Notes et historique</h3>
                <div className="space-y-3 mb-4">
                  {selectedAlertData.notes.map((note, idx) => (
                    <div key={idx} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-blue-900">{note.author}</span>
                        <span className="text-xs text-blue-600">{note.time}</span>
                      </div>
                      <p className="text-sm text-gray-900">{note.text}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ajouter une note..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Sélectionnez une alerte pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
