import React, { useState, useEffect } from 'react';
import { Building2, Plus, Trash2, ChevronRight, X, MapPin, Settings, Save, Users } from 'lucide-react';
import { batimentApi } from '../../services/api';

type TypeBatiment = 'IMMEUBLE' | 'MAISON' | 'CAMPUS';

interface Batiment {
  id: number;
  nom: string;
  adresse: string;
  type: TypeBatiment;
  gestionnaireId: number | null;
}

const Modal = ({ isOpen, onClose, title, children }: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-blue-800 rounded-lg text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export function BuildingsManagement() {
  const [buildings, setBuildings] = useState<Batiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<Batiment | null>(null);
  const [saving, setSaving] = useState(false);
  const [newBuilding, setNewBuilding] = useState({ nom: '', adresse: '', type: 'IMMEUBLE' as TypeBatiment, gestionnaireId: '' });

  useEffect(() => { fetchBuildings(); }, []);

  const fetchBuildings = async () => {
    try {
      setLoading(true);
      const data = await batimentApi.getAll();
      setBuildings(data);
    } catch (err) {
      setError('Erreur lors du chargement des bâtiments');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await batimentApi.create({
        ...newBuilding,
        gestionnaireId: newBuilding.gestionnaireId ? Number(newBuilding.gestionnaireId) : null,
      });
      await fetchBuildings();
      setNewBuilding({ nom: '', adresse: '', type: 'IMMEUBLE', gestionnaireId: '' });
      setIsCreateModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBuilding) return;
    setSaving(true);
    try {
      await batimentApi.update(editingBuilding.id, editingBuilding);
      await fetchBuildings();
      setIsEditModalOpen(false);
      setEditingBuilding(null);
    } catch (err: any) {
      setError('Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce bâtiment ?')) return;
    try {
      await batimentApi.delete(id);
      await fetchBuildings();
      if (selectedBuilding === id) setSelectedBuilding(null);
    } catch (err: any) {
      setError('Erreur lors de la suppression');
    }
  };

  const getTypeLabel = (type: TypeBatiment) => {
    const labels = { IMMEUBLE: 'Immeuble', MAISON: 'Maison', CAMPUS: 'Campus' };
    return labels[type] || type;
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between">
          {error}<button onClick={() => setError('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Nouveau Bâtiment">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input type="text" required value={newBuilding.nom}
              onChange={e => setNewBuilding(p => ({ ...p, nom: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse *</label>
            <input type="text" required value={newBuilding.adresse}
              onChange={e => setNewBuilding(p => ({ ...p, adresse: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select value={newBuilding.type}
              onChange={e => { const val = e.target.value as TypeBatiment; setNewBuilding(p => ({ ...p, type: val })); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option value="IMMEUBLE">Immeuble</option>
              <option value="MAISON">Maison</option>
              <option value="CAMPUS">Campus</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID Gestionnaire (optionnel)</label>
            <input type="number" value={newBuilding.gestionnaireId}
              onChange={e => setNewBuilding(p => ({ ...p, gestionnaireId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Laisser vide si non assigné" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Annuler</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2">
              <Save className="w-4 h-4" />{saving ? 'Création...' : 'Créer'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Modifier le Bâtiment">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input type="text" value={editingBuilding?.nom || ''}
              onChange={e => setEditingBuilding(p => p ? { ...p, nom: e.target.value } : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <input type="text" value={editingBuilding?.adresse || ''}
              onChange={e => setEditingBuilding(p => p ? { ...p, adresse: e.target.value } : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select value={editingBuilding?.type || 'IMMEUBLE'}
              onChange={e => { const val = e.target.value as TypeBatiment; setEditingBuilding(p => p ? { ...p, type: val } : null); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option value="IMMEUBLE">Immeuble</option>
              <option value="MAISON">Maison</option>
              <option value="CAMPUS">Campus</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Annuler</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60 flex items-center gap-2">
              <Save className="w-4 h-4" />{saving ? 'Mise à jour...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </Modal>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestion des bâtiments</h1>
          <p className="text-gray-600">Gérer les bâtiments du système</p>
        </div>
        <button onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg font-medium">
          <Building2 className="w-5 h-5" /> Nouveau bâtiment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buildings.map(building => (
          <div key={building.id}
            className={`bg-white rounded-xl shadow-sm border-2 transition-all cursor-pointer ${selectedBuilding === building.id ? 'border-blue-500' : 'border-gray-200 hover:border-blue-300'}`}
            onClick={() => setSelectedBuilding(building.id)}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{building.nom}</h3>
                    <p className="text-xs text-gray-500">{getTypeLabel(building.type)}</p>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${selectedBuilding === building.id ? 'rotate-90' : ''}`} />
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{building.adresse}</span>
              </div>
              {building.gestionnaireId && (
                <div className="flex items-center gap-2 text-sm text-blue-600 mb-4 bg-blue-50 px-3 py-2 rounded-lg">
                  <Users className="w-4 h-4" />
                  <span>Gestionnaire ID: {building.gestionnaireId}</span>
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={e => { e.stopPropagation(); setEditingBuilding(building); setIsEditModalOpen(true); }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 text-sm">
                  <Settings className="w-4 h-4" /> Modifier
                </button>
                <button onClick={e => { e.stopPropagation(); handleDelete(building.id); }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 text-sm">
                  <Trash2 className="w-4 h-4" /> Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
        {buildings.length === 0 && (
          <div className="col-span-3 text-center py-16 text-gray-500">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="font-medium text-lg">Aucun bâtiment trouvé</p>
            <p className="text-sm">Cliquez sur "Nouveau bâtiment" pour commencer</p>
          </div>
        )}
      </div>
    </div>
  );
}