import React, { useState, useEffect } from 'react';
import { ClipboardList, Plus, Calendar, Users, CheckCircle, Clock, AlertCircle, X, Edit, Trash2 } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8081/api';
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

type TypeAction = 'MAINTENANCE' | 'AWARENESS';
type StatutAction = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';
type PrioriteAction = 'LOW' | 'MEDIUM' | 'HIGH';

interface Action {
  id: number;
  title: string;
  type: TypeAction;
  status: StatutAction;
  priority: PrioriteAction;
  assignee: string;
  dueDate: string;
  relatedAlerts: number;
  description?: string;
}

const emptyAction: Omit<Action, 'id'> = {
  title: '', type: 'MAINTENANCE', status: 'PLANNED',
  priority: 'MEDIUM', assignee: '', dueDate: '',
  relatedAlerts: 0, description: ''
};

// ✅ FormFields is OUTSIDE the main component — fixes the focus bug
const FormFields = ({ values, onChange }: {
  values: Omit<Action, 'id'>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}) => (
  <>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
      <input type="text" name="title" value={values.title} onChange={onChange} required
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Ex: Intervention fuite - A201" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
        <select name="type" value={values.type} onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="MAINTENANCE">Maintenance</option>
          <option value="AWARENESS">Sensibilisation</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
        <select name="status" value={values.status} onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="PLANNED">Planifiée</option>
          <option value="IN_PROGRESS">En cours</option>
          <option value="COMPLETED">Terminée</option>
        </select>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Priorité</label>
        <select name="priority" value={values.priority} onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="LOW">Basse</option>
          <option value="MEDIUM">Moyenne</option>
          <option value="HIGH">Haute</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Assigné à *</label>
        <input type="text" name="assignee" value={values.assignee} onChange={onChange} required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ex: Technicien Martin" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Date d'échéance *</label>
        <input type="date" name="dueDate" value={values.dueDate} onChange={onChange} required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Alertes liées</label>
        <input type="number" name="relatedAlerts" value={values.relatedAlerts} onChange={onChange} min="0"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
      <textarea name="description" value={values.description || ''} onChange={onChange} rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Description détaillée..." />
    </div>
  </>
);

export function ActionsManagement() {
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [newAction, setNewAction] = useState<Omit<Action, 'id'>>(emptyAction);

  useEffect(() => { fetchActions(); }, []);

  const fetchActions = async () => {
    try {
      setLoading(true);
      const data = await fetch(`${API_BASE_URL}/actions`, { headers: getAuthHeaders() }).then(r => r.json());
      setActions(data);
    } catch {
      setError('Erreur lors du chargement des actions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch(`${API_BASE_URL}/actions`, {
        method: 'POST', headers: getAuthHeaders(),
        body: JSON.stringify(newAction),
      });
      await fetchActions();
      setNewAction(emptyAction);
      setIsModalOpen(false);
    } catch { setError('Erreur lors de la création'); }
    finally { setSaving(false); }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAction) return;
    setSaving(true);
    try {
      await fetch(`${API_BASE_URL}/actions/${selectedAction.id}`, {
        method: 'PUT', headers: getAuthHeaders(),
        body: JSON.stringify(selectedAction),
      });
      await fetchActions();
      setEditModalOpen(false);
      setSelectedAction(null);
    } catch { setError('Erreur lors de la mise à jour'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer cette action ?')) return;
    try {
      await fetch(`${API_BASE_URL}/actions/${id}`, {
        method: 'DELETE', headers: getAuthHeaders(),
      });
      await fetchActions();
    } catch { setError('Erreur lors de la suppression'); }
  };

  const getStatusColor = (s: string) => ({
    COMPLETED: 'bg-green-100 text-green-700',
    IN_PROGRESS: 'bg-amber-100 text-amber-700',
    PLANNED: 'bg-blue-100 text-blue-700',
  }[s] || 'bg-gray-100 text-gray-700');

  const getPriorityColor = (p: string) => ({
    HIGH: 'bg-red-100 text-red-700',
    MEDIUM: 'bg-amber-100 text-amber-700',
    LOW: 'bg-gray-100 text-gray-700',
  }[p] || 'bg-gray-100 text-gray-700');

  const getStatusText = (s: string) => ({ COMPLETED: 'Terminée', IN_PROGRESS: 'En cours', PLANNED: 'Planifiée' }[s] || s);
  const getPriorityText = (p: string) => ({ HIGH: 'Haute', MEDIUM: 'Moyenne', LOW: 'Basse' }[p] || p);
  const getTypeText = (t: string) => ({ MAINTENANCE: 'Maintenance', AWARENESS: 'Sensibilisation' }[t] || t);

  const stats = {
    inProgress: actions.filter(a => a.status === 'IN_PROGRESS').length,
    planned: actions.filter(a => a.status === 'PLANNED').length,
    completed: actions.filter(a => a.status === 'COMPLETED').length,
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Actions correctives</h1>
          <p className="text-gray-600">Planification et suivi des interventions</p>
        </div>
        <button onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Nouvelle action
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between">
          {error}<button onClick={() => setError('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Nouvelle action corrective</h2>
              <button onClick={() => { setIsModalOpen(false); setNewAction(emptyAction); }}
                className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <FormFields values={newAction}
                onChange={e => setNewAction(p => ({
                  ...p,
                  [e.target.name]: e.target.name === 'relatedAlerts' ? parseInt(e.target.value) || 0 : e.target.value
                }))} />
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => { setIsModalOpen(false); setNewAction(emptyAction); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Annuler</button>
                <button type="submit" disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60">
                  {saving ? 'Création...' : "Créer l'action"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModalOpen && selectedAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Détails de l'action</h2>
              <button onClick={() => setDetailModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-lg font-semibold text-gray-900">{selectedAction.title}</h3>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(selectedAction.status)}`}>
                  {getStatusText(selectedAction.status)}</span>
                <span className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(selectedAction.priority)}`}>
                  {getPriorityText(selectedAction.priority)}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-gray-500 mb-1">Type</p><p className="text-gray-900">{getTypeText(selectedAction.type)}</p></div>
                <div><p className="text-gray-500 mb-1">Assigné à</p><p className="text-gray-900">{selectedAction.assignee}</p></div>
                <div><p className="text-gray-500 mb-1">Échéance</p><p className="text-gray-900">{selectedAction.dueDate?.toString()}</p></div>
                <div><p className="text-gray-500 mb-1">Alertes liées</p><p className="text-gray-900">{selectedAction.relatedAlerts}</p></div>
              </div>
              {selectedAction.description && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Description</p>
                  <p className="bg-gray-50 p-3 rounded-lg text-sm border border-gray-200">{selectedAction.description}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 p-6 border-t">
              <button onClick={() => setDetailModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Fermer</button>
              <button onClick={() => { setEditModalOpen(true); setDetailModalOpen(false); }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Edit className="w-4 h-4" /> Modifier</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && selectedAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Modifier l'action</h2>
              <button onClick={() => setEditModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <FormFields values={selectedAction}
                onChange={e => setSelectedAction(p => p ? ({
                  ...p,
                  [e.target.name]: e.target.name === 'relatedAlerts' ? parseInt(e.target.value) || 0 : e.target.value
                }) : null)} />
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Annuler</button>
                <button type="submit" disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60">
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-blue-600" />
            <span className="text-2xl text-blue-900">{stats.inProgress}</span>
          </div>
          <p className="text-sm text-blue-700">En cours</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-amber-600" />
            <span className="text-2xl text-amber-900">{stats.planned}</span>
          </div>
          <p className="text-sm text-amber-700">Planifiées</p>
        </div>
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-2xl text-green-900">{stats.completed}</span>
          </div>
          <p className="text-sm text-green-700">Terminées</p>
        </div>
      </div>

      {/* Actions list */}
      <div className="space-y-4">
        {actions.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center text-gray-500 border border-gray-200">
            Aucune action corrective pour le moment
          </div>
        ) : actions.map(action => (
          <div key={action.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <ClipboardList className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-gray-900">{action.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(action.status)}`}>
                      {getStatusText(action.status)}</span>
                    <span className={`px-3 py-1 rounded-full text-xs ${getPriorityColor(action.priority)}`}>
                      {getPriorityText(action.priority)}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Type</p>
                      <p className="text-gray-900">{getTypeText(action.type)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Assigné à</p>
                      <p className="text-gray-900 flex items-center gap-1">
                        <Users className="w-3 h-3" />{action.assignee}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Échéance</p>
                      <p className="text-gray-900 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />{action.dueDate?.toString()}</p>
                    </div>
                  </div>
                  {action.relatedAlerts > 0 && (
                    <div className="mt-3 p-2 bg-amber-50 rounded-lg border border-amber-200">
                      <p className="text-xs text-amber-900 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />{action.relatedAlerts} alerte(s) liée(s)</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button onClick={() => { setSelectedAction(action); setDetailModalOpen(true); }}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">Détails</button>
                <button onClick={() => { setSelectedAction({...action}); setEditModalOpen(true); }}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Modifier</button>
                <button onClick={() => handleDelete(action.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4 text-red-600" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}