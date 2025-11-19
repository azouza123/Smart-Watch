import React from 'react';
import { Radio, CheckCircle, AlertCircle, Battery, Wrench, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export function TechnicianDashboard() {
  const statusData = [
    { name: 'En ligne', value: 242, color: '#10b981' },
    { name: 'Hors ligne', value: 3, color: '#ef4444' },
    { name: 'Batterie faible', value: 5, color: '#f59e0b' },
  ];

  const interventionsData = [
    { day: 'Lun', completed: 3, pending: 1 },
    { day: 'Mar', completed: 5, pending: 2 },
    { day: 'Mer', completed: 4, pending: 0 },
    { day: 'Jeu', completed: 6, pending: 1 },
    { day: 'Ven', completed: 4, pending: 3 },
  ];

  const urgentTasks = [
    { id: 1, type: 'Capteur hors ligne', location: 'Campus A - B201', priority: 'high', assignedAt: '2 heures' },
    { id: 2, type: 'Batterie faible', location: 'Campus B - R305', priority: 'medium', assignedAt: '4 heures' },
    { id: 3, type: 'Fuite détectée', location: 'Campus A - A103', priority: 'critical', assignedAt: '6 heures' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Tableau de bord technicien</h1>
        <p className="text-gray-600">Monitoring et maintenance des capteurs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Radio className="w-8 h-8 text-gray-400" />
            <span className="text-2xl text-gray-900">250</span>
          </div>
          <p className="text-sm text-gray-600">Total capteurs</p>
        </div>
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-2xl text-green-900">242</span>
          </div>
          <p className="text-sm text-green-700">En ligne (96.8%)</p>
        </div>
        <div className="bg-red-50 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <span className="text-2xl text-red-900">8</span>
          </div>
          <p className="text-sm text-red-700">Nécessitent attention</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Wrench className="w-8 h-8 text-blue-600" />
            <span className="text-2xl text-blue-900">4</span>
          </div>
          <p className="text-sm text-blue-700">Interventions en cours</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-gray-900 mb-4">État des capteurs</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-gray-900 mb-4">Interventions cette semaine</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={interventionsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="completed" fill="#10b981" radius={[8, 8, 0, 0]} name="Complétées" />
              <Bar dataKey="pending" fill="#f59e0b" radius={[8, 8, 0, 0]} name="En attente" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-900">Tâches urgentes</h2>
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
            {urgentTasks.length} prioritaires
          </span>
        </div>
        <div className="space-y-3">
          {urgentTasks.map((task) => {
            const priorityColors = {
              critical: 'border-red-500 bg-red-50',
              high: 'border-orange-500 bg-orange-50',
              medium: 'border-amber-500 bg-amber-50',
            };

            return (
              <div
                key={task.id}
                className={`p-4 rounded-lg border-l-4 ${priorityColors[task.priority as keyof typeof priorityColors]}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <Wrench className="w-5 h-5 text-gray-600" />
                      <h3 className="text-gray-900">{task.type}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        task.priority === 'critical' ? 'bg-red-600 text-white' :
                        task.priority === 'high' ? 'bg-orange-600 text-white' :
                        'bg-amber-600 text-white'
                      }`}>
                        {task.priority === 'critical' ? 'Critique' : task.priority === 'high' ? 'Urgent' : 'Moyen'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">📍 {task.location}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Assigné il y a {task.assignedAt}
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Commencer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-gray-900 mb-4">Performances du mois</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Interventions complétées</span>
              <span className="text-gray-900">78</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Temps moyen résolution</span>
              <span className="text-gray-900">2.5h</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Taux de réussite</span>
              <span className="text-green-600">98.7%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-gray-900 mb-4">Inventaire matériel</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Capteurs de rechange</span>
              <span className="text-gray-900">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Batteries stock</span>
              <span className="text-amber-600">4 ⚠️</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Outils disponibles</span>
              <span className="text-gray-900">Complet</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-gray-900 mb-4">Planning</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Interventions aujourd'hui</span>
              <span className="text-blue-600">4</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Prochaine maintenance</span>
              <span className="text-gray-900">Demain</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tournée inspection</span>
              <span className="text-gray-900">Lundi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
