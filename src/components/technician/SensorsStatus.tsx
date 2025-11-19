import React, { useState } from 'react';
import { Radio, CheckCircle, AlertCircle, Battery, Activity, MapPin, Search } from 'lucide-react';

export function SensorsStatus() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const sensors = [
    { id: 'SEN-001', location: 'Campus A › Nord › A101', status: 'online', battery: 95, lastSeen: '2 min', signal: 'excellent', flow: 2.3 },
    { id: 'SEN-002', location: 'Campus A › Nord › A102', status: 'online', battery: 87, lastSeen: '5 min', signal: 'good', flow: 0.0 },
    { id: 'SEN-003', location: 'Campus A › Nord › A103', status: 'low_battery', battery: 15, lastSeen: '10 min', signal: 'good', flow: 1.8 },
    { id: 'SEN-004', location: 'Campus A › Sud › A201', status: 'offline', battery: 0, lastSeen: '2 jours', signal: 'none', flow: 0.0 },
    { id: 'SEN-005', location: 'Campus B › Résidence › B101', status: 'online', battery: 92, lastSeen: '1 min', signal: 'excellent', flow: 3.5 },
    { id: 'SEN-042', location: 'Campus B › Résidence › B305', status: 'offline', battery: 0, lastSeen: '26 heures', signal: 'none', flow: 0.0 },
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

  const filteredSensors = sensors.filter(s => {
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
    const matchesSearch = s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">État des capteurs</h1>
        <p className="text-gray-600">Monitoring en temps réel</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un capteur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'online', 'offline', 'low_battery'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === status
                    ? status === 'online' ? 'bg-green-600 text-white' :
                      status === 'offline' ? 'bg-red-600 text-white' :
                      status === 'low_battery' ? 'bg-amber-600 text-white' :
                      'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'Tous' :
                 status === 'online' ? 'En ligne' :
                 status === 'offline' ? 'Hors ligne' :
                 'Batterie faible'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSensors.map((sensor) => {
          const statusColor = sensor.status === 'online' ? 'green' :
                            sensor.status === 'offline' ? 'red' : 'amber';
          
          return (
            <div key={sensor.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(sensor.status)}
                  <div>
                    <h3 className="text-gray-900">{sensor.id}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {sensor.location}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs bg-${statusColor}-100 text-${statusColor}-700`}>
                  {sensor.status === 'online' ? 'En ligne' :
                   sensor.status === 'offline' ? 'Hors ligne' :
                   'Batterie faible'}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Battery className={`w-5 h-5 mx-auto mb-1 ${
                    sensor.battery > 50 ? 'text-green-600' :
                    sensor.battery > 20 ? 'text-amber-600' :
                    'text-red-600'
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
                  <p className="text-xs text-gray-600">Signal</p>
                  <p className="text-sm text-gray-900 capitalize">{sensor.signal}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Dernière donnée</p>
                  <p className="text-sm text-gray-900">{sensor.lastSeen}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  Détails
                </button>
                <button className="flex-1 px-3 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm">
                  Diagnostiquer
                </button>
                {sensor.status !== 'online' && (
                  <button className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                    Intervenir
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
