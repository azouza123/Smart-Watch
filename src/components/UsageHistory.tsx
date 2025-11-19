import React, { useState } from 'react';
import { Download, Filter, Search } from 'lucide-react';

export function UsageHistory() {
  const [searchTerm, setSearchTerm] = useState('');

  const historyData = [
    { 
      id: 1, 
      date: '31 Oct 2025', 
      time: '14:35',
      zone: 'Salle de bain', 
      consumption: 45, 
      duration: '12 min',
      status: 'normal',
      device: 'Douche'
    },
    { 
      id: 2, 
      date: '31 Oct 2025', 
      time: '12:20',
      zone: 'Cuisine', 
      consumption: 32, 
      duration: '8 min',
      status: 'normal',
      device: 'Évier'
    },
    { 
      id: 3, 
      date: '31 Oct 2025', 
      time: '09:15',
      zone: 'Salle de bain', 
      consumption: 68, 
      duration: '18 min',
      status: 'elevated',
      device: 'Douche'
    },
    { 
      id: 4, 
      date: '31 Oct 2025', 
      time: '08:30',
      zone: 'Toilettes', 
      consumption: 8, 
      duration: '1 min',
      status: 'normal',
      device: 'WC'
    },
    { 
      id: 5, 
      date: '30 Oct 2025', 
      time: '19:45',
      zone: 'Cuisine', 
      consumption: 25, 
      duration: '6 min',
      status: 'normal',
      device: 'Lave-vaisselle'
    },
    { 
      id: 6, 
      date: '30 Oct 2025', 
      time: '18:20',
      zone: 'Jardin', 
      consumption: 150, 
      duration: '45 min',
      status: 'elevated',
      device: 'Arrosage'
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'elevated':
        return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs">Élevé</span>;
      case 'high':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">Très élevé</span>;
      default:
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Normal</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900">Historique détaillé</h2>
          <p className="text-sm text-gray-500">Suivi de tous les événements de consommation</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            <span className="text-sm">Filtrer</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            <span className="text-sm">Exporter</span>
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher dans l'historique..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm text-gray-600">Date & Heure</th>
              <th className="text-left py-3 px-4 text-sm text-gray-600">Zone</th>
              <th className="text-left py-3 px-4 text-sm text-gray-600">Appareil</th>
              <th className="text-left py-3 px-4 text-sm text-gray-600">Consommation</th>
              <th className="text-left py-3 px-4 text-sm text-gray-600">Durée</th>
              <th className="text-left py-3 px-4 text-sm text-gray-600">Statut</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="text-sm text-gray-900">{item.date}</div>
                  <div className="text-xs text-gray-500">{item.time}</div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">{item.zone}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{item.device}</td>
                <td className="py-3 px-4 text-sm text-gray-900">{item.consumption} L</td>
                <td className="py-3 px-4 text-sm text-gray-600">{item.duration}</td>
                <td className="py-3 px-4">{getStatusBadge(item.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Affichage de 6 sur 234 entrées
        </p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm">
            Précédent
          </button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
            1
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm">
            2
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm">
            3
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm">
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}
