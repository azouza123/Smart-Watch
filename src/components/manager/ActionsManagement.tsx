import React from 'react';
import { ClipboardList, Plus, Calendar, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export function ActionsManagement() {
  const actions = [
    { id: 1, title: 'Intervention fuite - A201', type: 'maintenance', status: 'in_progress', priority: 'high', assignee: 'Technicien Martin', dueDate: '2025-11-01', relatedAlerts: 1 },
    { id: 2, title: 'Sensibilisation économies d\'eau - Bâtiment Nord', type: 'awareness', status: 'planned', priority: 'medium', assignee: 'Gestionnaire', dueDate: '2025-11-05', relatedAlerts: 0 },
    { id: 3, title: 'Remplacement capteur SEN-042', type: 'maintenance', status: 'completed', priority: 'high', assignee: 'Technicien Dupont', dueDate: '2025-10-30', relatedAlerts: 1 },
  ];

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Actions correctives</h1>
          <p className="text-gray-600">Planification et suivi des interventions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Nouvelle action
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-blue-600" />
            <span className="text-2xl text-blue-900">1</span>
          </div>
          <p className="text-sm text-blue-700">En cours</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-amber-600" />
            <span className="text-2xl text-amber-900">1</span>
          </div>
          <p className="text-sm text-amber-700">Planifiées</p>
        </div>
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-2xl text-green-900">1</span>
          </div>
          <p className="text-sm text-green-700">Complétées (7j)</p>
        </div>
      </div>

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
                      {action.status === 'completed' ? 'Terminée' : action.status === 'in_progress' ? 'En cours' : 'Planifiée'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs ${getPriorityColor(action.priority)}`}>
                      {action.priority === 'high' ? 'Priorité haute' : action.priority === 'medium' ? 'Priorité moyenne' : 'Priorité basse'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Type</p>
                      <p className="text-gray-900">{action.type === 'maintenance' ? 'Maintenance' : 'Sensibilisation'}</p>
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
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  Détails
                </button>
                <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
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
