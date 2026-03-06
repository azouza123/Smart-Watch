import React, { useState, useEffect } from 'react';
import { Radio, Plus, Activity, Battery, AlertCircle, CheckCircle, Filter, X, Save, Trash2, Settings } from 'lucide-react';
import { batimentApi } from '../../services/api';

type TypeCapteur = 'EAU';

interface Capteur {
  id: number;
  reference: string;
  emplacement: string;
  type: TypeCapteur;
  batimentId: number | null;
  zone: string;
  logement: string;
  batterie: number;
  debitActuel: number;
  actif: boolean;
  derniereDonnee: string | null;
}

interface CapteurStats {
  totalCapteurs: number;
  nbEnLigne: number;
  nbHorsLigne: number;
  nbBatterieFaible: number;
}

const API_BASE_URL = 'http://localhost:8081/api';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

const capteurApiCalls = {
  getAll: () => fetch(`${API_BASE_URL}/capteurs`, { headers: getAuthHeaders() }).then(r => r.json()),
  getStats: () => fetch(`${API_BASE_URL}/capteurs/stats`, { headers: getAuthHeaders() }).then(r => r.json()),
  create: (data: any) => fetch(`${API_BASE_URL}/capteurs`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data) }).then(r => { if (!r.ok) throw new Error('Erreur création'); return r.json(); }),
  update: (id: number, data: any) => fetch(`${API_BASE_URL}/capteurs/${id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data) }).then(r => { if (!r.ok) throw new Error('Erreur mise à jour'); return r.json(); }),
  delete: (id: number) => fetch(`${API_BASE_URL}/capteurs/${id}`, { method: 'DELETE', headers: getAuthHeaders() }).then(r => { if (!r.ok) throw new Error('Erreur suppression'); }),
  changeEtat: (id: number, actif: boolean) => fetch(`${API_BASE_URL}/capteurs/${id}/etat?actif=${actif}`, { method: 'PUT', headers: getAuthHeaders() }).then(r => { if (!r.ok) throw new Error('Erreur changement état'); return r.json(); }),
};

const Modal = ({ isOpen, onClose, title, children }: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-blue-800 rounded-lg text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export function SensorsManagement() {
  const [sensors, setSensors] = useState<Capteur[]>([]);
  const [stats, setStats] = useState<CapteurStats>({ totalCapteurs: 0, nbEnLigne: 0, nbHorsLigne: 0, nbBatterieFaible: 0 });
  const [buildings, setBuildings] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSensor, setEditingSensor] = useState<Capteur | null>(null);
  const [saving, setSaving] = useState(false);
  const [newSensor, setNewSensor] = useState({
    reference: '',
    emplacement: '',
    type: 'EAU' as TypeCapteur,
    batimentId: '',
    zone: '',
    logement: '',
    batterie: 100,
    debitActuel: 0,
    actif: true,
  });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [sensorsData, statsData, buildingsData] = await Promise.all([
        capteurApiCalls.getAll(),
        capteurApiCalls.getStats(),
        batimentApi.getAll(),
      ]);
      setSensors(sensorsData);
      setStats(statsData);
      setBuildings(buildingsData);
    } catch (err) {
      setError('Erreur lors du chargement des capteurs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await capteurApiCalls.create({
        ...newSensor,
        batimentId: newSensor.batimentId ? Number(newSensor.batimentId) : null,
      });
      await fetchAll();
      setNewSensor({ reference: '', emplacement: '', type: 'EAU', batimentId: '', zone: '', logement: '', batterie: 100, debitActuel: 0, actif: true });
      setIsCreateModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSensor) return;
    setSaving(true);
    try {
      await capteurApiCalls.update(editingSensor.id, editingSensor);
      await fetchAll();
      setIsEditModalOpen(false);
      setEditingSensor(null);
    } catch (err: any) {
      setError('Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce capteur ?')) return;
    try {
      await capteurApiCalls.delete(id);
      await fetchAll();
    } catch (err: any) {
      setError('Erreur lors de la suppression');
    }
  };

  const handleToggleEtat = async (id: number, currentActif: boolean) => {
    try {
      await capteurApiCalls.changeEtat(id, !currentActif);
      await fetchAll();
    } catch (err) {
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-700';
      case 'offline': return 'bg-red-100 text-red-700';
      case 'low_battery': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'online': return 'En ligne';
      case 'offline': return 'Hors ligne';
      case 'low_battery': return 'Batterie faible';
      default: return status;
    }
  };

  const getTypeLabel = (_type: TypeCapteur) => 'Eau';

  const filteredSensors = sensors.filter(s => {
    const status = getStatus(s);
    return statusFilter === 'all' || status === statusFilter;
  });

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between">
          {error}
          <button onClick={() => setError('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Nouveau Capteur">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Référence *</label>
              <input type="text" required value={newSensor.reference}
                onChange={e => setNewSensor(p => ({ ...p, reference: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select value={newSensor.type} onChange={e => setNewSensor(p => ({ ...p, type: e.target.value as TypeCapteur }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option value="EAU">Eau</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emplacement</label>
            <input type="text" value={newSensor.emplacement}
              onChange={e => setNewSensor(p => ({ ...p, emplacement: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bâtiment</label>
            <select value={newSensor.batimentId} onChange={e => setNewSensor(p => ({ ...p, batimentId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option value="">-- Sélectionner un bâtiment --</option>
              {buildings.map(b => <option key={b.id} value={b.id}>{b.nom}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zone</label>
              <input type="text" value={newSensor.zone}
                onChange={e => setNewSensor(p => ({ ...p, zone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logement</label>
              <input type="text" value={newSensor.logement}
                onChange={e => setNewSensor(p => ({ ...p, logement: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batterie (%)</label>
              <input type="number" min="0" max="100" value={newSensor.batterie}
                onChange={e => setNewSensor(p => ({ ...p, batterie: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Débit actuel (L/min)</label>
              <input type="number" min="0" step="0.1" value={newSensor.debitActuel}
                onChange={e => setNewSensor(p => ({ ...p, debitActuel: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Annuler</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2">
              <Save className="w-4 h-4" />{saving ? 'Création...' : 'Créer'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Modifier le Capteur">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Référence</label>
              <input type="text" value={editingSensor?.reference || ''}
                onChange={e => setEditingSensor(p => p ? { ...p, reference: e.target.value } : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select value={editingSensor?.type || 'EAU'}
                onChange={e => setEditingSensor(p => p ? { ...p, type: e.target.value as TypeCapteur } : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option value="EAU">Eau</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emplacement</label>
            <input type="text" value={editingSensor?.emplacement || ''}
              onChange={e => setEditingSensor(p => p ? { ...p, emplacement: e.target.value } : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zone</label>
              <input type="text" value={editingSensor?.zone || ''}
                onChange={e => setEditingSensor(p => p ? { ...p, zone: e.target.value } : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logement</label>
              <input type="text" value={editingSensor?.logement || ''}
                onChange={e => setEditingSensor(p => p ? { ...p, logement: e.target.value } : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batterie (%)</label>
              <input type="number" min="0" max="100" value={editingSensor?.batterie || 0}
                onChange={e => setEditingSensor(p => p ? { ...p, batterie: Number(e.target.value) } : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Débit actuel (L/min)</label>
              <input type="number" min="0" step="0.1" value={editingSensor?.debitActuel || 0}
                onChange={e => setEditingSensor(p => p ? { ...p, debitActuel: Number(e.target.value) } : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
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
          <h1 className="text-gray-900 mb-2">Gestion des capteurs</h1>
          <p className="text-gray-600">Installation, configuration et monitoring</p>
        </div>
        <button onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Nouveau capteur
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Radio className="w-8 h-8 text-gray-400" />
            <span className="text-2xl text-gray-900">{stats.totalCapteurs}</span>
          </div>
          <p className="text-sm text-gray-600">Total capteurs</p>
        </div>
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-2xl text-green-900">{stats.nbEnLigne}</span>
          </div>
          <p className="text-sm text-green-700">En ligne</p>
        </div>
        <div className="bg-red-50 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <span className="text-2xl text-red-900">{stats.nbHorsLigne}</span>
          </div>
          <p className="text-sm text-red-700">Hors ligne</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <Battery className="w-8 h-8 text-amber-600" />
            <span className="text-2xl text-amber-900">{stats.nbBatterieFaible}</span>
          </div>
          <p className="text-sm text-amber-700">Batterie faible</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'all', label: 'Tous', active: 'bg-blue-600 text-white', inactive: 'bg-gray-100 text-gray-700' },
              { key: 'online', label: 'En ligne', active: 'bg-green-600 text-white', inactive: 'bg-gray-100 text-gray-700' },
              { key: 'offline', label: 'Hors ligne', active: 'bg-red-600 text-white', inactive: 'bg-gray-100 text-gray-700' },
              { key: 'low_battery', label: 'Batterie faible', active: 'bg-amber-600 text-white', inactive: 'bg-gray-100 text-gray-700' },
            ].map(btn => (
              <button key={btn.key} onClick={() => setStatusFilter(btn.key)}
                className={`px-4 py-2 rounded-lg transition-colors ${statusFilter === btn.key ? btn.active : btn.inactive + ' hover:bg-gray-200'}`}>
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSensors.map(sensor => {
          const status = getStatus(sensor);
          const buildingName = buildings.find(b => b.id === sensor.batimentId)?.nom || '—';
          return (
            <div key={sensor.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(status)}
                  <div>
                    <h3 className="text-gray-900 font-medium">{sensor.reference}</h3>
                    <p className="text-xs text-gray-500">{getTypeLabel(sensor.type)}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${getStatusBadge(status)}`}>
                  {getStatusLabel(status)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div><p className="text-xs text-gray-500 mb-1">Bâtiment</p><p className="text-sm text-gray-900">{buildingName}</p></div>
                <div><p className="text-xs text-gray-500 mb-1">Zone</p><p className="text-sm text-gray-900">{sensor.zone || '—'}</p></div>
                <div><p className="text-xs text-gray-500 mb-1">Logement</p><p className="text-sm text-gray-900">{sensor.logement || '—'}</p></div>
                <div><p className="text-xs text-gray-500 mb-1">Emplacement</p><p className="text-sm text-gray-900">{sensor.emplacement || '—'}</p></div>
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
                  <p className="text-sm text-gray-900">{sensor.derniereDonnee ? new Date(sensor.derniereDonnee).toLocaleTimeString('fr-FR') : '—'}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleToggleEtat(sensor.id, sensor.actif)}
                  className={`flex-1 px-3 py-2 rounded-lg transition-colors text-sm ${sensor.actif ? 'border border-red-300 text-red-600 hover:bg-red-50' : 'border border-green-300 text-green-600 hover:bg-green-50'}`}>
                  {sensor.actif ? 'Désactiver' : 'Activer'}
                </button>
                <button onClick={() => { setEditingSensor(sensor); setIsEditModalOpen(true); }}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm">
                  <Settings className="w-4 h-4" /> Modifier
                </button>
                <button onClick={() => handleDelete(sensor.id)}
                  className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
        {filteredSensors.length === 0 && (
          <div className="col-span-2 text-center py-16 text-gray-500">
            <Radio className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="font-medium text-lg">Aucun capteur trouvé</p>
            <p className="text-sm">Cliquez sur "Nouveau capteur" pour commencer</p>
          </div>
        )}
      </div>
    </div>
  );
}