import React, { useState, useEffect } from 'react';
import { StatsCards } from '../StatsCards';
import { ConsumptionChart } from '../ConsumptionChart';
import { ComparisonChart } from '../ComparisonChart';
import { AlertsPanel } from '../AlertsPanel';
import { PredictionPanel } from '../PredictionPanel';
import { Building2, ChevronDown } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8081/api';
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export function ManagerDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('week');
  const [selectedBatimentId, setSelectedBatimentId] = useState<number | null>(null);
  const [batiments, setBatiments] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/batiments`, { headers: getAuthHeaders() })
      .then(r => r.json())
      .then(data => setBatiments(data))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-2">Tableau de bord gestionnaire</h1>
          <p className="text-gray-600">Suivi des consommations et alertes</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <select
              value={selectedBatimentId ?? ''}
              onChange={e => setSelectedBatimentId(e.target.value ? Number(e.target.value) : null)}
              className="appearance-none pl-10 pr-10 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Tous les bâtiments</option>
              {batiments.map(b => (
                <option key={b.id} value={b.id}>{b.nom}</option>
              ))}
            </select>
            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <div className="flex gap-2">
            {(['day', 'week', 'month'] as const).map(p => (
              <button key={p} onClick={() => setSelectedPeriod(p)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedPeriod === p
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}>
                {p === 'day' ? 'Jour' : p === 'week' ? 'Semaine' : 'Mois'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <StatsCards period={selectedPeriod} />
      <AlertsPanel />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConsumptionChart period={selectedPeriod} batimentId={selectedBatimentId} />
        <ComparisonChart period={selectedPeriod} batimentId={selectedBatimentId} />
      </div>

      <PredictionPanel />
    </div>
  );
}