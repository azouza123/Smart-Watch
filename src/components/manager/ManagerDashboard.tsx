import React, { useState } from 'react';
import { StatsCards } from '../StatsCards';
import { ConsumptionChart } from '../ConsumptionChart';
import { ComparisonChart } from '../ComparisonChart';
import { AlertsPanel } from '../AlertsPanel';
import { PredictionPanel } from '../PredictionPanel';
import { Building2, ChevronDown } from 'lucide-react';

export function ManagerDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('week');
  const [selectedScope, setSelectedScope] = useState('campus-a');

  const scopes = [
    { id: 'all', label: 'Tous les sites' },
    { id: 'campus-a', label: 'Campus A' },
    { id: 'campus-b', label: 'Campus B' },
    { id: 'residence-c', label: 'Résidence C' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-2">Tableau de bord gestionnaire</h1>
          <p className="text-gray-600">Suivi des consommations et alertes</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Scope Selector */}
          <div className="relative">
            <select
              value={selectedScope}
              onChange={(e) => setSelectedScope(e.target.value)}
              className="appearance-none pl-10 pr-10 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {scopes.map(scope => (
                <option key={scope.id} value={scope.id}>{scope.label}</option>
              ))}
            </select>
            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Period Selector */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedPeriod('day')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedPeriod === 'day'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Jour
            </button>
            <button
              onClick={() => setSelectedPeriod('week')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedPeriod === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Semaine
            </button>
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedPeriod === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Mois
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards period={selectedPeriod} />

      {/* Alerts Panel */}
      <AlertsPanel />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConsumptionChart period={selectedPeriod} />
        <ComparisonChart period={selectedPeriod} />
      </div>

      {/* Prediction Panel */}
      <PredictionPanel />
    </div>
  );
}
