import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_BASE_URL = 'http://localhost:8081/api';
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

const FALLBACK: Record<string, { zone: string; current: number; previous: number }[]> = {
  day: [
    { zone: 'Cuisine', current: 85, previous: 100 },
    { zone: 'Salle de bain', current: 120, previous: 140 },
    { zone: 'Toilettes', current: 30, previous: 35 },
  ],
  week: [
    { zone: 'Cuisine', current: 580, previous: 650 },
    { zone: 'Salle de bain', current: 820, previous: 950 },
    { zone: 'Toilettes', current: 210, previous: 240 },
  ],
  month: [
    { zone: 'Cuisine', current: 2400, previous: 2800 },
    { zone: 'Salle de bain', current: 3500, previous: 4000 },
    { zone: 'Toilettes', current: 900, previous: 1000 },
  ],
};

interface ComparisonChartProps {
  period: 'day' | 'week' | 'month';
  batimentId?: number | null;
}

export function ComparisonChart({ period, batimentId }: ComparisonChartProps) {
  const [data, setData] = useState<any[]>(FALLBACK[period]);
  const [loading, setLoading] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => { fetchData(); }, [period, batimentId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const url = batimentId
        ? `${API_BASE_URL}/consommation/comparison/batiment/${batimentId}?periode=${period.toUpperCase()}`
        : `${API_BASE_URL}/consommation/comparison?periode=${period.toUpperCase()}`;

      const result = await fetch(url, { headers: getAuthHeaders() }).then(r => r.json());

      if (!result || result.length === 0) {
        setData(FALLBACK[period]);
        setUsingFallback(true);
      } else {
        setData(result);
        setUsingFallback(false);
      }
    } catch {
      setData(FALLBACK[period]);
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Consommation par zone</h2>
          <p className="text-sm text-gray-500">Comparaison période actuelle vs précédente</p>
        </div>
        {usingFallback && (
          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
            Données de démonstration
          </span>
        )}
        {loading && (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="zone" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip contentStyle={{
            backgroundColor: 'white', border: '1px solid #e5e7eb',
            borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
          }} />
          <Legend />
          <Bar dataKey="current" fill="#3b82f6" name="Période actuelle (L)" radius={[8, 8, 0, 0]} />
          <Bar dataKey="previous" fill="#94a3b8" name="Période précédente (L)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}