import React, { useState } from 'react';
import { Building2, Plus, Edit, Trash2, Users, Radio, ChevronRight } from 'lucide-react';

export function BuildingsManagement() {
  const [selectedBuilding, setSelectedBuilding] = useState<number | null>(null);

  const buildings = [
    { 
      id: 1, 
      name: 'Campus A', 
      address: '123 Rue de la République, Paris', 
      zones: 12, 
      units: 450, 
      sensors: 68,
      status: 'active'
    },
    { 
      id: 2, 
      name: 'Campus B', 
      address: '456 Avenue des Sciences, Lyon', 
      zones: 8, 
      units: 320, 
      sensors: 52,
      status: 'active'
    },
    { 
      id: 3, 
      name: 'Résidence C', 
      address: '789 Boulevard Vert, Marseille', 
      zones: 6, 
      units: 280, 
      sensors: 45,
      status: 'active'
    },
  ];

  const zones = [
    { id: 1, name: 'Bâtiment Nord', units: 120, sensors: 18 },
    { id: 2, name: 'Bâtiment Sud', units: 110, sensors: 16 },
    { id: 3, name: 'Bâtiment Est', units: 105, sensors: 15 },
    { id: 4, name: 'Bâtiment Ouest', units: 115, sensors: 19 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Gestion des bâtiments</h1>
          <p className="text-gray-600">Configuration de la hiérarchie : Bâtiments › Zones › Logements</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Nouveau bâtiment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Buildings List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-gray-900">Liste des bâtiments</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {buildings.map((building) => (
              <div 
                key={building.id}
                className={`p-6 cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedBuilding === building.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedBuilding(building.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-gray-900">{building.name}</h3>
                      <p className="text-sm text-gray-600">{building.address}</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
                    selectedBuilding === building.id ? 'rotate-90' : ''
                  }`} />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-xs text-gray-600">Zones</p>
                    <p className="text-gray-900">{building.zones}</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-xs text-gray-600">Logements</p>
                    <p className="text-gray-900">{building.units}</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-xs text-gray-600">Capteurs</p>
                    <p className="text-gray-900">{building.sensors}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    <Edit className="w-4 h-4" />
                    Modifier
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm">
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zones Detail */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-gray-900">
              {selectedBuilding ? `Zones - ${buildings.find(b => b.id === selectedBuilding)?.name}` : 'Zones'}
            </h2>
            {selectedBuilding && (
              <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                <Plus className="w-4 h-4" />
                Ajouter zone
              </button>
            )}
          </div>
          
          {selectedBuilding ? (
            <div className="p-6 space-y-4">
              {zones.map((zone) => (
                <div key={zone.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-gray-900">{zone.name}</h3>
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">{zone.units} logements</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">{zone.sensors} capteurs</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              Sélectionnez un bâtiment pour voir ses zones
            </div>
          )}
        </div>
      </div>

      {/* Building Tree View */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-gray-900 mb-4">Arborescence complète</h2>
        <div className="space-y-2 text-sm">
          <div className="font-medium text-gray-900">📁 Campus A</div>
          <div className="ml-6 space-y-1">
            <div className="text-gray-700">📂 Bâtiment Nord</div>
            <div className="ml-6 space-y-1">
              <div className="text-gray-600">🏠 Appartement A101 <span className="text-gray-400">→ 3 capteurs</span></div>
              <div className="text-gray-600">🏠 Appartement A102 <span className="text-gray-400">→ 2 capteurs</span></div>
              <div className="text-gray-600">🏠 Appartement A103 <span className="text-gray-400">→ 3 capteurs</span></div>
            </div>
            <div className="text-gray-700">📂 Bâtiment Sud</div>
            <div className="ml-6 text-gray-600">...</div>
          </div>
        </div>
      </div>
    </div>
  );
}
