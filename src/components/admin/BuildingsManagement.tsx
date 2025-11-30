import React, { useState } from 'react';
import { Building2, Plus, Edit, Trash2, Users, Radio, ChevronRight, X, MapPin, Settings } from 'lucide-react';

interface Building {
  id: number;
  name: string;
  address: string;
  zones: number;
  units: number;
  sensors: number;
  status: string;
}

interface Zone {
  id: number;
  name: string;
  units: number;
  sensors: number;
  buildingId?: number;
}

export function BuildingsManagement() {
  const [selectedBuilding, setSelectedBuilding] = useState<number | null>(null);
  const [isBuildingModalOpen, setIsBuildingModalOpen] = useState(false);
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [isEditBuildingModalOpen, setIsEditBuildingModalOpen] = useState(false);
  const [isEditZoneModalOpen, setIsEditZoneModalOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  
  const [buildings, setBuildings] = useState<Building[]>([
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
  ]);

  const [zones, setZones] = useState<Zone[]>([
    { id: 1, name: 'Bâtiment Nord', units: 120, sensors: 18, buildingId: 1 },
    { id: 2, name: 'Bâtiment Sud', units: 110, sensors: 16, buildingId: 1 },
    { id: 3, name: 'Bâtiment Est', units: 105, sensors: 15, buildingId: 1 },
    { id: 4, name: 'Bâtiment Ouest', units: 115, sensors: 19, buildingId: 1 },
    { id: 5, name: 'Zone A', units: 80, sensors: 12, buildingId: 2 },
    { id: 6, name: 'Zone B', units: 75, sensors: 10, buildingId: 2 },
  ]);

  const [newBuilding, setNewBuilding] = useState({
    name: '',
    address: '',
    zones: 0,
    units: 0,
    sensors: 0
  });

  const [newZone, setNewZone] = useState({
    name: '',
    units: 0,
    sensors: 0
  });

  // Gestion des bâtiments
  const handleAddBuilding = (e: React.FormEvent) => {
    e.preventDefault();
    const buildingToAdd: Building = {
      ...newBuilding,
      id: Math.max(...buildings.map(b => b.id), 0) + 1,
      status: 'active'
    };
    setBuildings(prev => [...prev, buildingToAdd]);
    setNewBuilding({ name: '', address: '', zones: 0, units: 0, sensors: 0 });
    setIsBuildingModalOpen(false);
  };

  const handleEditBuilding = (building: Building) => {
    setEditingBuilding(building);
    setIsEditBuildingModalOpen(true);
  };

  const handleUpdateBuilding = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBuilding) {
      setBuildings(prev => 
        prev.map(b => b.id === editingBuilding.id ? editingBuilding : b)
      );
      setIsEditBuildingModalOpen(false);
      setEditingBuilding(null);
    }
  };

  const handleDeleteBuilding = (buildingId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce bâtiment ?')) {
      setBuildings(prev => prev.filter(b => b.id !== buildingId));
      setZones(prev => prev.filter(z => z.buildingId !== buildingId));
      if (selectedBuilding === buildingId) {
        setSelectedBuilding(null);
      }
    }
  };

  // Gestion des zones
  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault();
    const zoneToAdd: Zone = {
      ...newZone,
      id: Math.max(...zones.map(z => z.id), 0) + 1,
      buildingId: selectedBuilding!
    };
    setZones(prev => [...prev, zoneToAdd]);
    setNewZone({ name: '', units: 0, sensors: 0 });
    setIsZoneModalOpen(false);
  };

  const handleEditZone = (zone: Zone) => {
    setSelectedZone(zone);
    setIsEditZoneModalOpen(true);
  };

  const handleUpdateZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedZone) {
      setZones(prev => 
        prev.map(z => z.id === selectedZone.id ? selectedZone : z)
      );
      setIsEditZoneModalOpen(false);
      setSelectedZone(null);
    }
  };

  const handleDeleteZone = (zoneId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette zone ?')) {
      setZones(prev => prev.filter(z => z.id !== zoneId));
    }
  };

  const filteredZones = zones.filter(zone => zone.buildingId === selectedBuilding);

  // Composant Modal réutilisable avec le nouveau design
  const Modal = ({ 
    isOpen, 
    onClose, 
    title, 
    children 
  }: { 
    isOpen: boolean; 
    onClose: () => void; 
    title: string; 
    children: React.ReactNode;
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">{title}</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-blue-800 rounded-lg transition-colors text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="p-8">
            {children}
          </div>
        </div>
      </div>
    );
  };

  // Composant Input réutilisable
  const InputField = ({ 
    label, 
    type = "text", 
    value, 
    onChange, 
    required = false,
    placeholder = ""
  }: {
    label: string;
    type?: string;
    value: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    placeholder?: string;
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        required={required}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Modales avec le nouveau design */}
      <Modal 
        isOpen={isBuildingModalOpen} 
        onClose={() => setIsBuildingModalOpen(false)} 
        title="Nouveau Bâtiment"
      >
        <form onSubmit={handleAddBuilding} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Nom du bâtiment"
              value={newBuilding.name}
              onChange={(e) => setNewBuilding(prev => ({...prev, name: e.target.value}))}
              required
              placeholder="Entrez le nom du bâtiment"
            />
            <InputField
              label="Adresse"
              value={newBuilding.address}
              onChange={(e) => setNewBuilding(prev => ({...prev, address: e.target.value}))}
              required
              placeholder="Adresse complète"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField
              label="Nombre de zones"
              type="number"
              value={newBuilding.zones}
              onChange={(e) => setNewBuilding(prev => ({...prev, zones: parseInt(e.target.value) || 0}))}
              placeholder="0"
            />
            <InputField
              label="Nombre de logements"
              type="number"
              value={newBuilding.units}
              onChange={(e) => setNewBuilding(prev => ({...prev, units: parseInt(e.target.value) || 0}))}
              placeholder="0"
            />
            <InputField
              label="Nombre de capteurs"
              type="number"
              value={newBuilding.sensors}
              onChange={(e) => setNewBuilding(prev => ({...prev, sensors: parseInt(e.target.value) || 0}))}
              placeholder="0"
            />
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button 
              type="button" 
              onClick={() => setIsBuildingModalOpen(false)} 
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <X className="w-4 h-4" />
              Annuler
            </button>
            <button 
              type="submit" 
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Créer le Bâtiment
            </button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={isEditBuildingModalOpen} 
        onClose={() => setIsEditBuildingModalOpen(false)} 
        title="Modifier le Bâtiment"
      >
        <form onSubmit={handleUpdateBuilding} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Nom du bâtiment"
              value={editingBuilding?.name || ''}
              onChange={(e) => setEditingBuilding(prev => prev ? {...prev, name: e.target.value} : null)}
              required
              placeholder="Entrez le nom du bâtiment"
            />
            <InputField
              label="Adresse"
              value={editingBuilding?.address || ''}
              onChange={(e) => setEditingBuilding(prev => prev ? {...prev, address: e.target.value} : null)}
              required
              placeholder="Adresse complète"
            />
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button 
              type="button" 
              onClick={() => setIsEditBuildingModalOpen(false)} 
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <X className="w-4 h-4" />
              Annuler
            </button>
            <button 
              type="submit" 
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-lg"
            >
              <Settings className="w-4 h-4" />
              Enregistrer les Modifications
            </button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={isZoneModalOpen} 
        onClose={() => setIsZoneModalOpen(false)} 
        title="Nouvelle Zone"
      >
        <form onSubmit={handleAddZone} className="space-y-6">
          <div className="space-y-6">
            <InputField
              label="Nom de la zone"
              value={newZone.name}
              onChange={(e) => setNewZone(prev => ({...prev, name: e.target.value}))}
              required
              placeholder="Entrez le nom de la zone"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Nombre de logements"
                type="number"
                value={newZone.units}
                onChange={(e) => setNewZone(prev => ({...prev, units: parseInt(e.target.value) || 0}))}
                placeholder="0"
              />
              <InputField
                label="Nombre de capteurs"
                type="number"
                value={newZone.sensors}
                onChange={(e) => setNewZone(prev => ({...prev, sensors: parseInt(e.target.value) || 0}))}
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button 
              type="button" 
              onClick={() => setIsZoneModalOpen(false)} 
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <X className="w-4 h-4" />
              Annuler
            </button>
            <button 
              type="submit" 
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Créer la Zone
            </button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={isEditZoneModalOpen} 
        onClose={() => setIsEditZoneModalOpen(false)} 
        title="Modifier la Zone"
      >
        <form onSubmit={handleUpdateZone} className="space-y-6">
          <div className="space-y-6">
            <InputField
              label="Nom de la zone"
              value={selectedZone?.name || ''}
              onChange={(e) => setSelectedZone(prev => prev ? {...prev, name: e.target.value} : null)}
              required
              placeholder="Entrez le nom de la zone"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Nombre de logements"
                type="number"
                value={selectedZone?.units || 0}
                onChange={(e) => setSelectedZone(prev => prev ? {...prev, units: parseInt(e.target.value) || 0} : null)}
                placeholder="0"
              />
              <InputField
                label="Nombre de capteurs"
                type="number"
                value={selectedZone?.sensors || 0}
                onChange={(e) => setSelectedZone(prev => prev ? {...prev, sensors: parseInt(e.target.value) || 0} : null)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button 
              type="button" 
              onClick={() => setIsEditZoneModalOpen(false)} 
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <X className="w-4 h-4" />
              Annuler
            </button>
            <button 
              type="submit" 
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-lg"
            >
              <Settings className="w-4 h-4" />
              Enregistrer les Modifications
            </button>
          </div>
        </form>
      </Modal>

      {/* Contenu principal reste inchangé */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestion des bâtiments</h1>
          <p className="text-gray-600">Configuration de la hiérarchie : Bâtiments › Zones › Logements</p>
        </div>
        <button 
          onClick={() => setIsBuildingModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg font-medium"
        >
          <Building2 className="w-5 h-5" />
          Nouveau bâtiment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Buildings List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Liste des bâtiments</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {buildings.map((building) => (
              <div 
                key={building.id}
                className={`p-6 cursor-pointer transition-all hover:bg-gray-50 ${
                  selectedBuilding === building.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                }`}
                onClick={() => setSelectedBuilding(building.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{building.name}</h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {building.address}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
                    selectedBuilding === building.id ? 'rotate-90' : ''
                  }`} />
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 font-medium">Zones</p>
                    <p className="text-gray-900 font-semibold">{building.zones}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 font-medium">Logements</p>
                    <p className="text-gray-900 font-semibold">{building.units}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 font-medium">Capteurs</p>
                    <p className="text-gray-900 font-semibold">{building.sensors}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditBuilding(building);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                  >
                    <Settings className="w-4 h-4" />
                    Modifier
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBuilding(building.id);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                  >
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
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedBuilding ? `Zones - ${buildings.find(b => b.id === selectedBuilding)?.name}` : 'Zones'}
            </h2>
            {selectedBuilding && (
              <button 
                onClick={() => setIsZoneModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all text-sm font-medium shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Ajouter zone
              </button>
            )}
          </div>
          
          {selectedBuilding ? (
            <div className="p-6 space-y-4">
              {filteredZones.map((zone) => (
                <div key={zone.id} className="p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-all bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium text-gray-900">{zone.name}</h3>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEditZone(zone)}
                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                        title="Modifier la zone"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteZone(zone.id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        title="Supprimer la zone"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Users className="w-4 h-4 text-green-600" />
                      <span className="font-medium">{zone.units} logements</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Radio className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">{zone.sensors} capteurs</span>
                    </div>
                  </div>
                </div>
              ))}
              {filteredZones.length === 0 && (
                <div className="text-center text-gray-500 py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="font-medium">Aucune zone configurée</p>
                  <p className="text-sm">Cliquez sur "Ajouter zone" pour commencer</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="font-medium text-lg mb-2">Sélectionnez un bâtiment</p>
              <p className="text-sm">Choisissez un bâtiment dans la liste pour voir ses zones</p>
            </div>
          )}
        </div>
      </div>

      {/* Building Tree View */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Arborescence complète</h2>
        <div className="space-y-3">
          {buildings.map(building => (
            <div key={building.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 font-medium text-gray-900 mb-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                {building.name}
              </div>
              <div className="ml-6 space-y-2">
                {zones.filter(zone => zone.buildingId === building.id).map(zone => (
                  <div key={zone.id} className="bg-white rounded p-3 border border-gray-200">
                    <div className="flex items-center gap-2 font-medium text-gray-700 mb-1">
                      <MapPin className="w-4 h-4 text-green-600" />
                      {zone.name}
                    </div>
                    <div className="ml-6 space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Logements: {zone.units} unités
                      </div>
                      <div className="flex items-center gap-2">
                        <Radio className="w-4 h-4" />
                        Capteurs: {zone.sensors} appareils
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}