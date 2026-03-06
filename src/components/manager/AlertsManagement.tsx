import React, { useState, useEffect } from 'react';
import { AlertTriangle, AlertCircle, CheckCircle, Clock, User, X, Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const API_BASE_URL = 'http://localhost:8081/api';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

const alerteApiCalls = {
  getAll: () => fetch(`${API_BASE_URL}/alertes`, { headers: getAuthHeaders() }).then(r => r.json()),
  getStats: () => fetch(`${API_BASE_URL}/alertes/stats`, { headers: getAuthHeaders() }).then(r => r.json()),
  create: (data: any) => fetch(`${API_BASE_URL}/alertes`, {
    method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data)
  }).then(r => { if (!r.ok) throw new Error('Erreur création'); return r.json(); }),
  updateStatut: (id: number, statut: string) =>
    fetch(`${API_BASE_URL}/alertes/${id}/statut?statut=${statut}`, { method: 'PUT', headers: getAuthHeaders() }).then(r => r.json()),
  updateAssignee: (id: number, assignee: string) =>
    fetch(`${API_BASE_URL}/alertes/${id}/assignee?assignee=${encodeURIComponent(assignee)}`, { method: 'PUT', headers: getAuthHeaders() }).then(r => r.json()),
  addNote: (id: number, author: string, text: string) =>
    fetch(`${API_BASE_URL}/alertes/${id}/notes`, {
      method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ author, text }),
    }).then(r => r.json()),
  getReadings: (id: number) =>
    fetch(`${API_BASE_URL}/alertes/${id}/readings`, { headers: getAuthHeaders() }).then(r => r.json()),
};

interface AlerteNote {
  author: string;
  text: string;
  time: string;
}

interface Alerte {
  id: number;
  title: string;
  type: 'OVERCONSUMPTION' | 'LEAK' | 'SENSOR';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  batimentId: number | null;
  batimentNom: string | null;
  capteurId: number | null;
  capteurReference: string | null;
  zone: string;
  unit: string;
  threshold: number;
  actual: number;
  assignee: string | null;
  triggeredAt: string;
  notes: AlerteNote[];
}

interface AlerteStats {
  total: number;
  nbOpen: number;
  nbInProgress: number;
  nbResolved: number;
}

const FALLBACK_GRAPH = [
  { time: '00:00', value: 15 },
  { time: '01:00', value: 18 },
  { time: '02:00', value: 68 },
  { time: '03:00', value: 65 },
  { time: '04:00', value: 22 },
  { time: '05:00', value: 20 },
];

// ✅ Modal outside component to avoid re-mount on every keystroke
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
          <button onClick={onClose} className="p-2 hover:bg-blue-800 rounded-lg text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export function AlertsManagement() {
  const [alerts, setAlerts] = useState<Alerte[]>([]);
  const [stats, setStats] = useState<AlerteStats>({ total: 0, nbOpen: 0, nbInProgress: 0, nbResolved: 0 });
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newNote, setNewNote] = useState('');
  const [assigneeInput, setAssigneeInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [graphData, setGraphData] = useState<{ time: string; value: number }[]>(FALLBACK_GRAPH);
  const [graphLoading, setGraphLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newAlert, setNewAlert] = useState({
    title: '',
    type: 'OVERCONSUMPTION' as Alerte['type'],
    severity: 'MEDIUM' as Alerte['severity'],
    status: 'OPEN' as Alerte['status'],
    batimentId: '',
    zone: '',
    unit: '',
    threshold: 0,
    actual: 0,
    assignee: '',
  });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [alertsData, statsData] = await Promise.all([
        alerteApiCalls.getAll(),
        alerteApiCalls.getStats(),
      ]);
      setAlerts(alertsData);
      setStats(statsData);
    } catch (err) {
      setError('Erreur lors du chargement des alertes');
    } finally {
      setLoading(false);
    }
  };

  const fetchReadings = async (alerteId: number) => {
    setGraphLoading(true);
    try {
      const data = await alerteApiCalls.getReadings(alerteId);
      if (!data || data.length === 0) {
        setGraphData(FALLBACK_GRAPH);
      } else {
        setGraphData(data.map((r: any) => ({
          time: new Date(r.time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          value: r.value,
        })));
      }
    } catch {
      setGraphData(FALLBACK_GRAPH);
    } finally {
      setGraphLoading(false);
    }
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await alerteApiCalls.create({
        ...newAlert,
        batimentId: newAlert.batimentId ? Number(newAlert.batimentId) : null,
        threshold: Number(newAlert.threshold),
        actual: Number(newAlert.actual),
        assignee: newAlert.assignee || null,
      });
      await fetchAll();
      setNewAlert({
        title: '', type: 'OVERCONSUMPTION', severity: 'MEDIUM', status: 'OPEN',
        batimentId: '', zone: '', unit: '', threshold: 0, actual: 0, assignee: '',
      });
      setIsCreateModalOpen(false);
    } catch (err: any) {
      setError('Erreur lors de la création de l\'alerte');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStatut = async (id: number, statut: string) => {
    setSaving(true);
    try {
      await alerteApiCalls.updateStatut(id, statut);
      await fetchAll();
    } catch (err) {
      setError('Erreur lors de la mise à jour du statut');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateAssignee = async (id: number) => {
    if (!assigneeInput.trim()) return;
    setSaving(true);
    try {
      await alerteApiCalls.updateAssignee(id, assigneeInput);
      await fetchAll();
      setAssigneeInput('');
    } catch (err) {
      setError("Erreur lors de l'assignation");
    } finally {
      setSaving(false);
    }
  };

  const handleAddNote = async (id: number) => {
    if (!newNote.trim()) return;
    setSaving(true);
    try {
      await alerteApiCalls.addNote(id, 'Gestionnaire', newNote);
      await fetchAll();
      setNewNote('');
    } catch (err) {
      setError("Erreur lors de l'ajout de la note");
    } finally {
      setSaving(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-600 bg-red-100 border-red-200';
      case 'HIGH': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'MEDIUM': return 'text-amber-600 bg-amber-100 border-amber-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN': return { label: 'Ouverte', color: 'bg-red-100 text-red-700', icon: AlertCircle };
      case 'IN_PROGRESS': return { label: 'En cours', color: 'bg-amber-100 text-amber-700', icon: Clock };
      case 'RESOLVED': return { label: 'Résolue', color: 'bg-green-100 text-green-700', icon: CheckCircle };
      default: return { label: status, color: 'bg-gray-100 text-gray-700', icon: AlertTriangle };
    }
  };

  const formatTime = (triggeredAt: string) => {
    if (!triggeredAt) return '—';
    const date = new Date(triggeredAt);
    const now = new Date();
    const diffHrs = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffHrs < 1) return "Il y a moins d'une heure";
    if (diffHrs < 24) return `Il y a ${diffHrs} heure(s)`;
    return `Il y a ${Math.floor(diffHrs / 24)} jour(s)`;
  };

  const filteredAlerts = statusFilter === 'all'
    ? alerts
    : alerts.filter(a => a.status === statusFilter);

  const selectedAlertData = selectedAlert ? alerts.find(a => a.id === selectedAlert) : null;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Create Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Nouvelle Alerte">
        <form onSubmit={handleCreateAlert} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
            <input type="text" required value={newAlert.title}
              onChange={e => setNewAlert(p => ({ ...p, title: e.target.value }))}
              placeholder="Ex: Fuite détectée - Logement A201"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select value={newAlert.type}
                onChange={e => setNewAlert(p => ({ ...p, type: e.target.value as Alerte['type'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option value="OVERCONSUMPTION">Surconsommation</option>
                <option value="LEAK">Fuite</option>
                <option value="SENSOR">Capteur</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sévérité</label>
              <select value={newAlert.severity}
                onChange={e => setNewAlert(p => ({ ...p, severity: e.target.value as Alerte['severity'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option value="LOW">Faible</option>
                <option value="MEDIUM">Moyenne</option>
                <option value="HIGH">Haute</option>
                <option value="CRITICAL">Critique</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zone</label>
              <input type="text" value={newAlert.zone}
                onChange={e => setNewAlert(p => ({ ...p, zone: e.target.value }))}
                placeholder="Ex: Zone A"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logement</label>
              <input type="text" value={newAlert.unit}
                onChange={e => setNewAlert(p => ({ ...p, unit: e.target.value }))}
                placeholder="Ex: Apt 101"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Seuil (L/h)</label>
              <input type="number" min="0" step="0.1" value={newAlert.threshold}
                onChange={e => setNewAlert(p => ({ ...p, threshold: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valeur détectée (L/h)</label>
              <input type="number" min="0" step="0.1" value={newAlert.actual}
                onChange={e => setNewAlert(p => ({ ...p, actual: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigné à (optionnel)</label>
            <input type="text" value={newAlert.assignee}
              onChange={e => setNewAlert(p => ({ ...p, assignee: e.target.value }))}
              placeholder="Ex: Technicien Martin"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60">
              {saving ? 'Création...' : 'Créer'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Gestion des alertes</h1>
          <p className="text-gray-600">Suivi et résolution des anomalies détectées</p>
        </div>
        <button onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Nouvelle alerte
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between">
          {error}
          <button onClick={() => setError('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-8 h-8 text-gray-400" />
            <span className="text-2xl text-gray-900">{stats.total}</span>
          </div>
          <p className="text-sm text-gray-600">Total alertes</p>
        </div>
        <div className="bg-red-50 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <span className="text-2xl text-red-900">{stats.nbOpen}</span>
          </div>
          <p className="text-sm text-red-700">Ouvertes</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-amber-600" />
            <span className="text-2xl text-amber-900">{stats.nbInProgress}</span>
          </div>
          <p className="text-sm text-amber-700">En cours</p>
        </div>
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-2xl text-green-900">{stats.nbResolved}</span>
          </div>
          <p className="text-sm text-green-700">Résolues</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'all', label: 'Toutes' },
            { key: 'OPEN', label: 'Ouvertes' },
            { key: 'IN_PROGRESS', label: 'En cours' },
            { key: 'RESOLVED', label: 'Résolues' },
          ].map(btn => (
            <button key={btn.key} onClick={() => setStatusFilter(btn.key)}
              className={`px-4 py-2 rounded-lg transition-colors ${statusFilter === btn.key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts List */}
        <div className="lg:col-span-1 space-y-4">
          {filteredAlerts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p>Aucune alerte trouvée</p>
            </div>
          )}
          {filteredAlerts.map((alert) => {
            const statusInfo = getStatusBadge(alert.status);
            const StatusIcon = statusInfo.icon;
            return (
              <div key={alert.id}
                onClick={() => {
                  setSelectedAlert(alert.id);
                  setAssigneeInput(alert.assignee || '');
                  fetchReadings(alert.id);
                }}
                className={`bg-white rounded-xl p-4 shadow-sm border-2 cursor-pointer transition-all hover:shadow-md ${selectedAlert === alert.id ? 'border-blue-500' : 'border-gray-200'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${statusInfo.color} flex items-center gap-1`}>
                    <StatusIcon className="w-3 h-3" />
                    {statusInfo.label}
                  </span>
                </div>
                <h3 className="text-sm text-gray-900 mb-2 font-medium">{alert.title}</h3>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>📍 {alert.batimentNom || '—'} › {alert.zone || '—'} › {alert.unit || '—'}</p>
                  <p>🕐 {formatTime(alert.triggeredAt)}</p>
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
                  <h2 className="text-gray-900 mb-1 font-semibold">{selectedAlertData.title}</h2>
                  <p className="text-sm text-gray-600">
                    {selectedAlertData.batimentNom || '—'} › {selectedAlertData.zone || '—'} › {selectedAlertData.unit || '—'}
                  </p>
                </div>
                <button onClick={() => setSelectedAlert(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Graph */}
              <div className="mb-6">
                <h3 className="text-gray-900 text-sm mb-4 font-medium">Évolution autour de l'événement</h3>
                {graphLoading ? (
                  <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={graphData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="time" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                      <ReferenceLine y={selectedAlertData.threshold} stroke="#ef4444" strokeDasharray="3 3" label="Seuil" />
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} name="Consommation (L/h)" dot={{ fill: '#3b82f6', r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Threshold vs Actual */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Seuil configuré</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedAlertData.threshold} L/h</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Valeur détectée</p>
                  <p className="text-lg font-semibold text-red-900">{selectedAlertData.actual} L/h</p>
                </div>
              </div>

              {/* Actions */}
              <div className="mb-6">
                <h3 className="text-gray-900 text-sm font-medium mb-3">Actions</h3>
                <div className="flex gap-2 mb-3">
                  <input type="text" placeholder="Assigner à..."
                    value={assigneeInput}
                    onChange={e => setAssigneeInput(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <button onClick={() => handleUpdateAssignee(selectedAlertData.id)} disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60">
                    Assigner
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateStatut(selectedAlertData.id, 'IN_PROGRESS')}
                    disabled={saving || selectedAlertData.status === 'IN_PROGRESS'}
                    className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-40 transition-colors">
                    Marquer en cours
                  </button>
                  <button
                    onClick={() => handleUpdateStatut(selectedAlertData.id, 'RESOLVED')}
                    disabled={saving || selectedAlertData.status === 'RESOLVED'}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-40 transition-colors">
                    Résoudre
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h3 className="text-gray-900 text-sm font-medium mb-3">Notes et historique</h3>
                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                  {selectedAlertData.notes.length === 0 && (
                    <p className="text-sm text-gray-500 italic">Aucune note pour cette alerte</p>
                  )}
                  {selectedAlertData.notes.map((note, idx) => (
                    <div key={idx} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-blue-900">{note.author}</span>
                        <span className="text-xs text-blue-600">{note.time}</span>
                      </div>
                      <p className="text-sm text-gray-900">{note.text}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" placeholder="Ajouter une note..."
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddNote(selectedAlertData.id)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <button onClick={() => handleAddNote(selectedAlertData.id)}
                    disabled={saving || !newNote.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60">
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Sélectionnez une alerte pour voir les détails</p>
              <p className="text-sm text-gray-400 mt-2">ou créez une nouvelle alerte</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}