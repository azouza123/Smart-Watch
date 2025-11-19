import React, { useState } from 'react';
import { ClipboardList, Plus, Calendar, Users, CheckCircle, Clock, AlertCircle, X, Edit } from 'lucide-react';

interface Action {
  id: number;
  title: string;
  type: 'maintenance' | 'awareness';
  status: 'planned' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: string;
  relatedAlerts: number;
  description?: string;
}

export function ActionsManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  
  const [actions, setActions] = useState<Action[]>([
    { 
      id: 1, 
      title: 'Intervention fuite - A201', 
      type: 'maintenance', 
      status: 'in_progress', 
      priority: 'high', 
      assignee: 'Technicien Martin', 
      dueDate: '2025-11-01', 
      relatedAlerts: 1, 
      description: 'Intervention urgente pour résoudre une fuite d\'eau dans le local technique A201.' 
    },
    { 
      id: 2, 
      title: 'Sensibilisation économies d\'eau - Bâtiment Nord', 
      type: 'awareness', 
      status: 'planned', 
      priority: 'medium', 
      assignee: 'Gestionnaire', 
      dueDate: '2025-11-05', 
      relatedAlerts: 0, 
      description: 'Campagne de sensibilisation sur les économies d\'eau pour les occupants du bâtiment Nord.' 
    },
    { 
      id: 3, 
      title: 'Remplacement capteur SEN-042', 
      type: 'maintenance', 
      status: 'completed', 
      priority: 'high', 
      assignee: 'Technicien Dupont', 
      dueDate: '2025-10-30', 
      relatedAlerts: 1, 
      description: 'Remplacement du capteur de pression défectueux SEN-042 dans la chaufferie.' 
    },
  ]);

  const [newAction, setNewAction] = useState<Omit<Action, 'id'>>({
    title: '',
    type: 'maintenance',
    status: 'planned',
    priority: 'medium',
    assignee: '',
    dueDate: '',
    relatedAlerts: 0,
    description: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'in_progress':
        return 'bg-amber-100 text-amber-700';
      case 'planned':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-amber-100 text-amber-700';
      case 'low':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminée';
      case 'in_progress': return 'En cours';
      case 'planned': return 'Planifiée';
      default: return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Priorité haute';
      case 'medium': return 'Priorité moyenne';
      case 'low': return 'Priorité basse';
      default: return priority;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'maintenance': return 'Maintenance';
      case 'awareness': return 'Sensibilisation';
      default: return type;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAction(prev => ({
      ...prev,
      [name]: name === 'relatedAlerts' ? parseInt(value) || 0 : value
    }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (selectedAction) {
      setSelectedAction(prev => ({
        ...prev!,
        [name]: name === 'relatedAlerts' ? parseInt(value) || 0 : value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const actionToAdd: Action = {
      ...newAction,
      id: Math.max(...actions.map(a => a.id), 0) + 1,
    };

    setActions(prevActions => [...prevActions, actionToAdd]);
    resetNewActionForm();
    setIsModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedAction) {
      setActions(prevActions => 
        prevActions.map(action => 
          action.id === selectedAction.id ? selectedAction : action
        )
      );
    }

    setEditModalOpen(false);
    setSelectedAction(null);
  };

  const handleViewDetails = (action: Action) => {
    setSelectedAction(action);
    setDetailModalOpen(true);
  };

  const handleEdit = (action: Action) => {
    setSelectedAction({...action});
    setEditModalOpen(true);
  };

  const resetNewActionForm = () => {
    setNewAction({
      title: '',
      type: 'maintenance',
      status: 'planned',
      priority: 'medium',
      assignee: '',
      dueDate: '',
      relatedAlerts: 0,
      description: ''
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetNewActionForm();
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedAction(null);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedAction(null);
  };

  // Calculer les statistiques en temps réel
  const getStats = () => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
    
    const inProgress = actions.filter(action => action.status === 'in_progress').length;
    const planned = actions.filter(action => action.status === 'planned').length;
    const completed = actions.filter(action => {
      if (action.status === 'completed') {
        const dueDate = new Date(action.dueDate);
        return dueDate >= sevenDaysAgo;
      }
      return false;
    }).length;

    return { inProgress, planned, completed };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Actions correctives</h1>
          <p className="text-gray-600">Planification et suivi des interventions</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Nouvelle action
        </button>
      </div>

      {/* Modal pour nouvelle action */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Nouvelle action corrective</h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de l'action *
                </label>
                <input
                  type="text"
                  name="title"
                  value={newAction.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Intervention fuite - A201"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type d'action
                  </label>
                  <select
                    name="type"
                    value={newAction.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="maintenance">Maintenance</option>
                    <option value="awareness">Sensibilisation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <select
                    name="status"
                    value={newAction.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="planned">Planifiée</option>
                    <option value="in_progress">En cours</option>
                    <option value="completed">Terminée</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priorité
                  </label>
                  <select
                    name="priority"
                    value={newAction.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Basse</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Haute</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigné à *
                  </label>
                  <input
                    type="text"
                    name="assignee"
                    value={newAction.assignee}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Technicien Martin"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d'échéance *
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={newAction.dueDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alertes liées
                  </label>
                  <input
                    type="number"
                    name="relatedAlerts"
                    value={newAction.relatedAlerts}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={newAction.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Description détaillée de l'action..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Créer l'action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal pour voir les détails */}
      {detailModalOpen && selectedAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Détails de l'action</h2>
              <button
                onClick={handleCloseDetailModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <ClipboardList className="w-8 h-8 text-blue-600 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{selectedAction.title}</h3>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(selectedAction.status)}`}>
                      {getStatusText(selectedAction.status)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(selectedAction.priority)}`}>
                      {getPriorityText(selectedAction.priority)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Type d'action</p>
                        <p className="text-gray-900">{getTypeText(selectedAction.type)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Assigné à</p>
                        <p className="text-gray-900 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {selectedAction.assignee}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Date d'échéance</p>
                        <p className="text-gray-900 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {selectedAction.dueDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Alertes liées</p>
                        <p className="text-gray-900">{selectedAction.relatedAlerts}</p>
                      </div>
                    </div>
                  </div>

                  {selectedAction.description && (
                    <div className="mt-6">
                      <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
                      <p className="text-gray-900 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        {selectedAction.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCloseDetailModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Fermer
              </button>
              <button
                onClick={() => handleEdit(selectedAction)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Modifier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal pour modifier une action */}
      {editModalOpen && selectedAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Modifier l'action</h2>
              <button
                onClick={handleCloseEditModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de l'action *
                </label>
                <input
                  type="text"
                  name="title"
                  value={selectedAction.title}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type d'action
                  </label>
                  <select
                    name="type"
                    value={selectedAction.type}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="maintenance">Maintenance</option>
                    <option value="awareness">Sensibilisation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <select
                    name="status"
                    value={selectedAction.status}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="planned">Planifiée</option>
                    <option value="in_progress">En cours</option>
                    <option value="completed">Terminée</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priorité
                  </label>
                  <select
                    name="priority"
                    value={selectedAction.priority}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Basse</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Haute</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigné à *
                  </label>
                  <input
                    type="text"
                    name="assignee"
                    value={selectedAction.assignee}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d'échéance *
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={selectedAction.dueDate}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alertes liées
                  </label>
                  <input
                    type="number"
                    name="relatedAlerts"
                    value={selectedAction.relatedAlerts}
                    onChange={handleEditInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={selectedAction.description || ''}
                  onChange={handleEditInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Description détaillée de l'action..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Statistiques mises à jour */}
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
          <p className="text-sm text-green-700">Complétées (7j)</p>
        </div>
      </div>

      {/* Liste des actions mise à jour */}
      <div className="space-y-4">
        {actions.map((action) => (
          <div key={action.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <ClipboardList className="w-6 h-6 text-blue-600 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-gray-900">{action.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(action.status)}`}>
                      {getStatusText(action.status)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs ${getPriorityColor(action.priority)}`}>
                      {getPriorityText(action.priority)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Type</p>
                      <p className="text-gray-900">{getTypeText(action.type)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Assigné à</p>
                      <p className="text-gray-900 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {action.assignee}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Échéance</p>
                      <p className="text-gray-900 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {action.dueDate}
                      </p>
                    </div>
                  </div>

                  {action.relatedAlerts > 0 && (
                    <div className="mt-3 p-2 bg-amber-50 rounded-lg border border-amber-200">
                      <p className="text-xs text-amber-900 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {action.relatedAlerts} alerte(s) liée(s)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleViewDetails(action)}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Détails
                </button>
                <button 
                  onClick={() => handleEdit(action)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Modifier
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}