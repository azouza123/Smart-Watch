import React, { useState } from 'react';
import { Target, TrendingDown, Calendar, Save } from 'lucide-react';

export function MyGoals() {
  const [weeklyGoal, setWeeklyGoal] = useState(315);
  const [monthlyGoal, setMonthlyGoal] = useState(1260);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Mes objectifs</h1>
        <p className="text-gray-600">Définissez vos objectifs de consommation</p>
      </div>

      <div className="bg-gradient-to-r from-green-600 to-blue-500 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Target className="w-8 h-8" />
          <div>
            <h2 className="text-white">Votre engagement environnemental</h2>
            <p className="text-green-100 text-sm">Chaque litre compte pour la planète</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-3xl mb-1">1,240 L</div>
            <p className="text-sm text-green-100">Économisés ce mois</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-1">-18%</div>
            <p className="text-sm text-green-100">vs début année</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-1">4.8 kg</div>
            <p className="text-sm text-green-100">CO₂ évités</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h2 className="text-gray-900">Objectif hebdomadaire</h2>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-2">Consommation cible (litres/semaine)</label>
            <input
              type="range"
              min="200"
              max="500"
              value={weeklyGoal}
              onChange={(e) => setWeeklyGoal(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>200 L</span>
              <span className="text-blue-600">{weeklyGoal} L</span>
              <span>500 L</span>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg mb-4">
            <p className="text-sm text-gray-900 mb-2">Progression actuelle</p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">280 L / {weeklyGoal} L</span>
              <span className="text-sm text-blue-600">{Math.round((280 / weeklyGoal) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${Math.min((280 / weeklyGoal) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Consommation moyenne/jour</span>
              <span className="text-gray-900">{Math.round(weeklyGoal / 7)} L</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Il reste</span>
              <span className="text-gray-900">{weeklyGoal - 280} L</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <TrendingDown className="w-6 h-6 text-green-600" />
            <h2 className="text-gray-900">Objectif mensuel</h2>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-2">Consommation cible (litres/mois)</label>
            <input
              type="range"
              min="800"
              max="2000"
              value={monthlyGoal}
              onChange={(e) => setMonthlyGoal(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>800 L</span>
              <span className="text-green-600">{monthlyGoal} L</span>
              <span>2000 L</span>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg mb-4">
            <p className="text-sm text-gray-900 mb-2">Projection mensuelle</p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">≈ {Math.round((280 / 7) * 30)} L / {monthlyGoal} L</span>
              <span className="text-sm text-green-600">{Math.round(((280 / 7) * 30 / monthlyGoal) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${Math.min(((280 / 7) * 30 / monthlyGoal) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Objectif hebdo équivalent</span>
              <span className="text-gray-900">{Math.round(monthlyGoal / 4)} L</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Économie visée vs moyenne</span>
              <span className="text-green-600">-240 L</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-gray-900 mb-4">Objectifs recommandés</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Conservateur', weekly: 350, monthly: 1400, difficulty: 'Facile', color: 'green' },
            { name: 'Équilibré', weekly: 300, monthly: 1200, difficulty: 'Moyen', color: 'blue' },
            { name: 'Ambitieux', weekly: 250, monthly: 1000, difficulty: 'Difficile', color: 'purple' },
          ].map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setWeeklyGoal(preset.weekly);
                setMonthlyGoal(preset.monthly);
              }}
              className={`p-4 rounded-lg border-2 border-${preset.color}-200 hover:border-${preset.color}-400 transition-all text-left bg-${preset.color}-50`}
            >
              <h3 className="text-gray-900 mb-2">{preset.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{preset.difficulty}</p>
              <div className="space-y-1 text-sm">
                <p className="text-gray-700">{preset.weekly} L/semaine</p>
                <p className="text-gray-700">{preset.monthly} L/mois</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Save className="w-5 h-5" />
          Enregistrer mes objectifs
        </button>
      </div>
    </div>
  );
}
