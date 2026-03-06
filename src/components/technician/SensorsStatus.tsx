import React, { useState, useEffect } from 'react';
import { Radio, CheckCircle, AlertCircle, Battery, Activity, MapPin, Search, X } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8081/api';
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

interface Capteur {
  id: number;
  reference: string;
  emplacement: string;
  type: string;
  batimentId: number | null;
  zone: string;
  logement: string;
  batterie: number;
  debitActuel: number;
  actif: boolean;
  derniereDonnee: string | null;
}

export function SensorsStatus() {
  const [sensors, setSensors] = useState<Capteur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchSensors(); }, []);

  const fetchSensors = async () => {
    try {
      setLoading(true);
      const data = await fetch(`${API_BASE_URL}/capteurs`, { headers: getAuthHeaders() }).then(r => r.json());
      setSensors(data);
    } catch {
      setError('Erreur lors du chargement des capteurs');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEtat = async (id: number, actif: boolean) => {
    try {
      await fetch(`${API_BASE_URL}/capteurs/${id}/etat?actif=${!actif}`, {
        method: 'PUT', headers: getAuthHeaders()
      });
      await fetchSensors();
    } catch {
      setError("Erreur lors du changement d'état");
    }
  };

  const getStatus = (sensor: Capteur) => {
    if (!sensor.actif) return 'offline';
    if (sensor.batterie !== null && sensor.batterie < 20) return 'low_battery';
    return 'online';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'offline': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'low_battery': return <Battery className="w-5 h-5 text-amber-600" />;
      default: return <Radio className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'online': return { label: 'En ligne', color: 'bg-green-100 text-green-700' };
      case 'offline': return { label: 'Hors ligne', color: 'bg-red-100 text-red-700' };
      case 'low_battery': return { label: 'Batterie faible', color: 'bg-amber-100 text-amber-700' };
      default: return { label: '—', color: 'bg-gray-100 text-gray-700' };
    }
  };

  const filteredSensors = sensors.filter(s => {
    const status = getStatus(s);
    const matchesStatus = filterStatus === 'all' || status === filterStatus;
    const matchesSearch = s.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.zone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.emplacement || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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
        <h1 className="text-gray-900 mb-2">État des capteurs</h1>
        <p className="text-gray-600">Monitoring en temps réel</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Rechercher un capteur..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'all', label: 'Tous', active: 'bg-blue-600 text-white' },
              { key: 'online', label: 'En ligne', active: 'bg-green-600 text-white' },
              { key: 'offline', label: 'Hors ligne', active: 'bg-red-600 text-white' },
              { key: 'low_battery', label: 'Batterie faible', active: 'bg-amber-600 text-white' },
            ].map(btn => (
              <button key={btn.key} onClick={() => setFilterStatus(btn.key)}
                className={`px-4 py-2 rounded-lg transition-colors ${filterStatus === btn.key ? btn.active : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredSensors.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Radio className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p>Aucun capteur trouvé</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSensors.map((sensor) => {
          const status = getStatus(sensor);
          const statusInfo = getStatusLabel(status);
          return (
            <div key={sensor.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(status)}
                  <div>
                    <h3 className="text-gray-900 font-medium">{sensor.reference}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {sensor.zone || '—'} › {sensor.logement || '—'}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Battery className={`w-5 h-5 mx-auto mb-1 ${sensor.batterie > 50 ? 'text-green-600' : sensor.batterie > 20 ? 'text-amber-600' : 'text-red-600'}`} />
                  <p className="text-xs text-gray-600">Batterie</p>
                  <p className="text-sm text-gray-900">{sensor.batterie}%</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Activity className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Débit</p>
                  <p className="text-sm text-gray-900">{sensor.debitActuel} L/min</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Radio className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Dernière donnée</p>
                  <p className="text-sm text-gray-900">
                    {sensor.derniereDonnee
                      ? new Date(sensor.derniereDonnee).toLocaleTimeString('fr-FR')
                      : '—'}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => handleToggleEtat(sensor.id, sensor.actif)}
                  className={`flex-1 px-3 py-2 rounded-lg transition-colors text-sm border ${sensor.actif
                    ? 'border-red-300 text-red-600 hover:bg-red-50'
                    : 'border-green-300 text-green-600 hover:bg-green-50'}`}>
                  {sensor.actif ? 'Désactiver' : 'Activer'}
                </button>
                <button className="flex-1 px-3 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm">
                  Diagnostiquer
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}