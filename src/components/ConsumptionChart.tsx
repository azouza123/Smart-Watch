import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface ConsumptionChartProps {
  period: 'day' | 'week' | 'month';
}

export function ConsumptionChart({ period }: ConsumptionChartProps) {
  const dataByPeriod = {
    day: [
      { time: '00h', consumption: 15, target: 8 },
      { time: '02h', consumption: 8, target: 8 },
      { time: '04h', consumption: 5, target: 8 },
      { time: '06h', consumption: 25, target: 8 },
      { time: '08h', consumption: 35, target: 8 },
      { time: '10h', consumption: 28, target: 8 },
      { time: '12h', consumption: 32, target: 8 },
      { time: '14h', consumption: 22, target: 8 },
      { time: '16h', consumption: 18, target: 8 },
      { time: '18h', consumption: 30, target: 8 },
      { time: '20h', consumption: 20, target: 8 },
      { time: '22h', consumption: 12, target: 8 },
    ],
    week: [
      { time: 'Lun', consumption: 220, target: 200 },
      { time: 'Mar', consumption: 245, target: 200 },
      { time: 'Mer', consumption: 235, target: 200 },
      { time: 'Jeu', consumption: 260, target: 200 },
      { time: 'Ven', consumption: 240, target: 200 },
      { time: 'Sam', consumption: 280, target: 200 },
      { time: 'Dim', consumption: 200, target: 200 },
    ],
    month: [
      { time: 'Sem 1', consumption: 1600, target: 1400 },
      { time: 'Sem 2', consumption: 1750, target: 1400 },
      { time: 'Sem 3', consumption: 1650, target: 1400 },
      { time: 'Sem 4', consumption: 1700, target: 1400 },
    ],
  };

  const data = dataByPeriod[period];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="mb-4">
        <h2 className="text-gray-900">Évolution de la consommation</h2>
        <p className="text-sm text-gray-500">Consommation réelle vs objectif</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="time" stroke="#6b7280" />
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
          <Area 
            type="monotone" 
            dataKey="consumption" 
            stroke="#3b82f6" 
            fillOpacity={1} 
            fill="url(#colorConsumption)"
            name="Consommation (L)"
            strokeWidth={2}
          />
          <Area 
            type="monotone" 
            dataKey="target" 
            stroke="#10b981" 
            fillOpacity={1} 
            fill="url(#colorTarget)"
            name="Objectif (L)"
            strokeWidth={2}
            strokeDasharray="5 5"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
