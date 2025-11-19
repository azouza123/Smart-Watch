import React, { useState } from 'react';
import { Wrench, CheckCircle, Clock, AlertCircle, Calendar, Plus } from 'lucide-react';

export function Interventions() {
  const [statusFilter, setStatusFilter] = useState('all');

  const interventions = [
    {
      id: 1,
      title: 'Remplacement capteur SEN-042',
      location: 'Campus B › Résidence › B305',
      type: 'replacement',
      priority: 'high',
      status: 'in_progress',
      assignedAt: '2025-10-31 08:00',
      estimatedDuration: '2 heures',
      notes: 'Capteur muet depuis 26 heures. Batterie probablement HS.',
    },
    {
      id: 2,
      title: 'Inspection fuite - A201',
      location: 'Campus A › Sud › A201',
      type: 'inspection',
      priority: 'critical',
      status: 'pending',
      assignedAt: '2025-10-31 10:30',
      estimatedDuration: '1 heure',
      notes: 'Débit nocturne anormal détecté. Fuite probable.',
    },
    {
      id: 3,
      title: 'Changement batterie SEN-003',
      location: 'Campus A › Nord › A103',
      type: 'maintenance',
      priority: 'medium',
      status: 'pending',
      assignedAt: '2025-10-31 14:00',
      estimatedDuration: '30 min',
      notes: 'Batterie à 15%, remplacement préventif.',
    },
    {
      id: 4,
      title: 'Calibration capteur SEN-015',
      location: 'Campus A › Est › A305',
      type: 'calibration',
      priority: 'low',
      status: 'completed',
      assignedAt: '2025-10-30 09:00',
      completedAt: '2025-10-30 10:15',
      estimatedDuration: '1 heure',
      notes: 'Calibration annuelle effectuée avec succès.',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-600 text-white';
      case 'high':
        return 'bg-orange-600 text-white';
      case 'medium':
        return 'bg-amber-600 text-white';
      case 'low':
        return 'bg-gray-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const filteredInterventions = statusFilter === 'all' 
    ? interventions 
    : interventions.filter(i => i.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Mes interventions</h1>
          <p className="text-gray-600">Planning et suivi des tâches</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Nouvelle intervention
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-amber-600" />
            <span className="text-2xl text-amber-900">{interventions.filter(i => i.status === 'pending').length}</span>
          </div>
          <p className="text-sm text-amber-700">En attente</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Wrench className="w-8 h-8 text-blue-600" />
            <span className="text-2xl text-blue-900">{interventions.filter(i => i.status === 'in_progress').length}</span>
          </div>
          <p className="text-sm text-blue-700">En cours</p>
        </div>
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-2xl text-green-900">{interventions.filter(i => i.status === 'completed').length}</span>
          </div>
          <p className="text-sm text-green-700">Complétées (7j)</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex gap-2">
          {['all', 'pending', 'in_progress', 'completed'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'Toutes' :
               status === 'pending' ? 'En attente' :
               status === 'in_progress' ? 'En cours' :
               'Complétées'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredInterventions.map((intervention) => (
          <div key={intervention.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <div className={`p-3 rounded-lg ${
                  intervention.status === 'completed' ? 'bg-green-100' :
                  intervention.status === 'in_progress' ? 'bg-blue-100' :
                  'bg-amber-100'
                }`}>
                  {intervention.status === 'completed' ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : intervention.status === 'in_progress' ? (
                    <Wrench className="w-6 h-6 text-blue-600" />
                  ) : (
                    <Clock className="w-6 h-6 text-amber-600" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-gray-900">{intervention.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(intervention.status)}`}>
                      {intervention.status === 'completed' ? 'Complétée' :
                       intervention.status === 'in_progress' ? 'En cours' :
                       'En attente'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(intervention.priority)}`}>
                      {intervention.priority === 'critical' ? 'Critique' :
                       intervention.priority === 'high' ? 'Urgent' :
                       intervention.priority === 'medium' ? 'Moyen' :
                       'Faible'}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">📍 {intervention.location}</p>

                  <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Type</p>
                      <p className="text-gray-900 capitalize">{intervention.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Assigné</p>
                      <p className="text-gray-900">{intervention.assignedAt}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Durée estimée</p>
                      <p className="text-gray-900">{intervention.estimatedDuration}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Notes:</p>
                    <p className="text-sm text-gray-900">{intervention.notes}</p>
                  </div>

                  {intervention.completedAt && (
                    <div className="mt-3 p-2 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-xs text-green-900">
                        ✓ Complétée le {intervention.completedAt}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                {intervention.status === 'pending' && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Commencer
                  </button>
                )}
                {intervention.status === 'in_progress' && (
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                    Terminer
                  </button>
                )}
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  Détails
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
