import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ComparisonChartProps {
  period: 'day' | 'week' | 'month';
}

export function ComparisonChart({ period }: ComparisonChartProps) {
  const dataByPeriod = {
    day: [
      { zone: 'Cuisine', current: 85, previous: 95 },
      { zone: 'Salle de bain', current: 120, previous: 140 },
      { zone: 'Toilettes', current: 30, previous: 35 },
      { zone: 'Jardin', current: 10, previous: 10 },
    ],
    week: [
      { zone: 'Cuisine', current: 580, previous: 650 },
      { zone: 'Salle de bain', current: 820, previous: 950 },
      { zone: 'Toilettes', current: 210, previous: 240 },
      { zone: 'Jardin', current: 70, previous: 80 },
    ],
    month: [
      { zone: 'Cuisine', current: 2400, previous: 2800 },
      { zone: 'Salle de bain', current: 3500, previous: 4000 },
      { zone: 'Toilettes', current: 900, previous: 1000 },
      { zone: 'Jardin', current: 400, previous: 600 },
    ],
  };

  const data = dataByPeriod[period];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="mb-4">
        <h2 className="text-gray-900">Consommation par zone</h2>
        <p className="text-sm text-gray-500">Comparaison période actuelle vs précédente</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="zone" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
          <Bar dataKey="current" fill="#3b82f6" name="Période actuelle (L)" radius={[8, 8, 0, 0]} />
          <Bar dataKey="previous" fill="#94a3b8" name="Période précédente (L)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
