import React from 'react';
import { TrendingUp, Calendar, Zap, Brain } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export function PredictionPanel() {
  const predictionData = [
    { day: 'Lun', actual: 220, predicted: null },
    { day: 'Mar', actual: 245, predicted: null },
    { day: 'Mer', actual: 235, predicted: null },
    { day: 'Jeu', actual: 260, predicted: null },
    { day: 'Ven', actual: 240, predicted: null },
    { day: 'Sam', actual: null, predicted: 275 },
    { day: 'Dim', actual: null, predicted: 210 },
    { day: 'Lun+', actual: null, predicted: 230 },
    { day: 'Mar+', actual: null, predicted: 240 },
  ];

  const insights = [
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'Tendance hebdomadaire',
      value: '+5% prévu',
      color: 'text-amber-600 bg-amber-100',
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      title: 'Pic prévu',
      value: 'Samedi 275L',
      color: 'text-blue-600 bg-blue-100',
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Action recommandée',
      value: 'Réduire weekend',
      color: 'text-green-600 bg-green-100',
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <Brain className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-gray-900">Prédiction de consommation</h2>
          <p className="text-sm text-gray-500">Basée sur l'analyse des habitudes et tendances</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {insights.map((insight, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${insight.color} rounded-lg flex items-center justify-center`}>
                {insight.icon}
              </div>
              <div>
                <p className="text-sm text-gray-600">{insight.title}</p>
                <p className="text-gray-900">{insight.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={predictionData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="day" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <ReferenceLine x="Ven" stroke="#94a3b8" strokeDasharray="3 3" />
          <Line 
            type="monotone" 
            dataKey="actual" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ fill: '#3b82f6', r: 4 }}
            name="Consommation réelle"
          />
          <Line 
            type="monotone" 
            dataKey="predicted" 
            stroke="#a855f7" 
            strokeWidth={3}
            strokeDasharray="5 5"
            dot={{ fill: '#a855f7', r: 4 }}
            name="Consommation prédite"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Brain className="w-5 h-5 text-purple-600 mt-0.5" />
          <div>
            <h3 className="text-sm text-gray-900 mb-1">Analyse intelligente</h3>
            <p className="text-sm text-gray-600">
              L'algorithme détecte une augmentation de 5% de la consommation pendant le weekend. 
              Pour atteindre votre objectif mensuel, nous recommandons de réduire la consommation 
              de 25L par jour pendant le weekend, notamment dans la salle de bain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
