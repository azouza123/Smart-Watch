import React, { useState } from 'react';
import { Radio, Plus, Activity, Battery, AlertCircle, CheckCircle, Search, Filter } from 'lucide-react';

export function SensorsManagement() {
  const [statusFilter, setStatusFilter] = useState('all');

  const sensors = [
    { id: 'SEN-001', serial: 'WM-2024-A1-001', building: 'Campus A', zone: 'Bâtiment Nord', unit: 'A101', type: 'Débitmètre', status: 'online', battery: 95, lastSeen: '2 min', flow: 2.3 },
    { id: 'SEN-002', serial: 'WM-2024-A1-002', building: 'Campus A', zone: 'Bâtiment Nord', unit: 'A102', type: 'Compteur', status: 'online', battery: 87, lastSeen: '5 min', flow: 0.0 },
    { id: 'SEN-003', serial: 'WM-2024-A1-003', building: 'Campus A', zone: 'Bâtiment Nord', unit: 'A103', type: 'Débitmètre', status: 'low_battery', battery: 15, lastSeen: '10 min', flow: 1.8 },
    { id: 'SEN-004', serial: 'WM-2024-A2-001', building: 'Campus A', zone: 'Bâtiment Sud', unit: 'A201', type: 'Débitmètre', status: 'offline', battery: 0, lastSeen: '2 jours', flow: 0.0 },
    { id: 'SEN-005', serial: 'WM-2024-B1-001', building: 'Campus B', zone: 'Résidence', unit: 'B101', type: 'Compteur', status: 'online', battery: 92, lastSeen: '1 min', flow: 3.5 },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'offline':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'low_battery':
        return <Battery className="w-5 h-5 text-amber-600" />;
      default:
        return <Radio className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-700';
      case 'offline':
        return 'bg-red-100 text-red-700';
      case 'low_battery':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'online':
        return 'En ligne';
      case 'offline':
        return 'Hors ligne';
      case 'low_battery':
        return 'Batterie faible';
      default:
        return status;
    }
  };

  const filteredSensors = statusFilter === 'all' 
    ? sensors 
    : sensors.filter(s => s.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Gestion des capteurs</h1>
          <p className="text-gray-600">Installation, configuration et monitoring</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Nouveau capteur
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Radio className="w-8 h-8 text-gray-400" />
            <span className="text-2xl text-gray-900">{sensors.length}</span>
          </div>
          <p className="text-sm text-gray-600">Total capteurs</p>
        </div>
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-2xl text-green-900">{sensors.filter(s => s.status === 'online').length}</span>
          </div>
          <p className="text-sm text-green-700">En ligne</p>
        </div>
        <div className="bg-red-50 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <span className="text-2xl text-red-900">{sensors.filter(s => s.status === 'offline').length}</span>
          </div>
          <p className="text-sm text-red-700">Hors ligne</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <Battery className="w-8 h-8 text-amber-600" />
            <span className="text-2xl text-amber-900">{sensors.filter(s => s.status === 'low_battery').length}</span>
          </div>
          <p className="text-sm text-amber-700">Batterie faible</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setStatusFilter('online')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === 'online'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              En ligne
            </button>
            <button
              onClick={() => setStatusFilter('offline')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === 'offline'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Hors ligne
            </button>
            <button
              onClick={() => setStatusFilter('low_battery')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === 'low_battery'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Batterie faible
            </button>
          </div>
        </div>
      </div>

      {/* Sensors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSensors.map((sensor) => (
          <div key={sensor.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(sensor.status)}
                <div>
                  <h3 className="text-gray-900">{sensor.id}</h3>
                  <p className="text-xs text-gray-500">{sensor.serial}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs ${getStatusBadge(sensor.status)}`}>
                {getStatusLabel(sensor.status)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Bâtiment</p>
                <p className="text-sm text-gray-900">{sensor.building}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Zone</p>
                <p className="text-sm text-gray-900">{sensor.zone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Logement</p>
                <p className="text-sm text-gray-900">{sensor.unit}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Type</p>
                <p className="text-sm text-gray-900">{sensor.type}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Battery className={`w-5 h-5 mx-auto mb-1 ${
                  sensor.battery > 50 ? 'text-green-600' : sensor.battery > 20 ? 'text-amber-600' : 'text-red-600'
                }`} />
                <p className="text-xs text-gray-600">Batterie</p>
                <p className="text-sm text-gray-900">{sensor.battery}%</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Activity className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Débit</p>
                <p className="text-sm text-gray-900">{sensor.flow} L/min</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Radio className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Dernière donnée</p>
                <p className="text-sm text-gray-900">{sensor.lastSeen}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                Voir détails
              </button>
              <button className="flex-1 px-3 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm">
                Configurer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
