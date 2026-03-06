import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_BASE_URL = 'http://localhost:8081/api';
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

const FALLBACK: Record<string, { time: string; consumption: number }[]> = {
  day: [
    { time: '00h', consumption: 15 }, { time: '04h', consumption: 8 },
    { time: '08h', consumption: 35 }, { time: '12h', consumption: 32 },
    { time: '16h', consumption: 18 }, { time: '20h', consumption: 20 },
  ],
  week: [
    { time: 'Lun', consumption: 220 }, { time: 'Mar', consumption: 245 },
    { time: 'Mer', consumption: 235 }, { time: 'Jeu', consumption: 260 },
    { time: 'Ven', consumption: 240 }, { time: 'Sam', consumption: 280 },
    { time: 'Dim', consumption: 200 },
  ],
  month: [
    { time: 'Sem 1', consumption: 1600 }, { time: 'Sem 2', consumption: 1750 },
    { time: 'Sem 3', consumption: 1650 }, { time: 'Sem 4', consumption: 1700 },
  ],
};

interface ConsumptionChartProps {
  period: 'day' | 'week' | 'month';
  batimentId?: number | null;
}

export function ConsumptionChart({ period, batimentId }: ConsumptionChartProps) {
  const [data, setData] = useState<any[]>(FALLBACK[period]);
  const [loading, setLoading] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => { fetchData(); }, [period, batimentId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const url = batimentId
        ? `${API_BASE_URL}/consommation/chart/batiment/${batimentId}?periode=${period.toUpperCase()}`
        : `${API_BASE_URL}/consommation/chart?periode=${period.toUpperCase()}`;

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
          <h2 className="text-gray-900">Évolution de la consommation</h2>
          <p className="text-sm text-gray-500">Consommation réelle vs objectif</p>
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
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="time" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip contentStyle={{
            backgroundColor: 'white', border: '1px solid #e5e7eb',
            borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
          }} />
          <Legend />
          <Area type="monotone" dataKey="consumption" stroke="#3b82f6"
            fillOpacity={1} fill="url(#colorConsumption)"
            name="Consommation (L)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}