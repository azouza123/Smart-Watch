import React, { useState } from 'react';
import { Droplets, TrendingDown, Target, Award, Trophy } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function OccupantDashboard() {
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  const weekData = [
    { day: 'Lun', consumption: 42, goal: 45 },
    { day: 'Mar', consumption: 38, goal: 45 },
    { day: 'Mer', consumption: 41, goal: 45 },
    { day: 'Jeu', consumption: 36, goal: 45 },
    { day: 'Ven', consumption: 40, goal: 45 },
    { day: 'Sam', consumption: 48, goal: 45 },
    { day: 'Dim', consumption: 35, goal: 45 },
  ];

  const usageData = [
    { name: 'Douche', value: 45, color: '#3b82f6' },
    { name: 'Cuisine', value: 25, color: '#10b981' },
    { name: 'Toilettes', value: 20, color: '#8b5cf6' },
    { name: 'Autre', value: 10, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Ma consommation</h1>
        <p className="text-gray-600">Logement A101 - Bâtiment Nord</p>
      </div>

      {/* Hero Card */}
      <div className="bg-gradient-to-r from-blue-600 to-green-500 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Droplets className="w-12 h-12" />
              <div>
                <p className="text-blue-100 text-sm">Cette semaine</p>
                <h2 className="text-white text-4xl">280 L</h2>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <TrendingDown className="w-5 h-5 text-green-300" />
              <p className="text-green-100">-15% vs semaine dernière</p>
            </div>
          </div>
          <div className="text-right">
            <div className="w-32 h-32 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center mb-3">
              <div className="text-center">
                <div className="text-3xl mb-1">88%</div>
                <div className="text-xs text-blue-100">Objectif</div>
              </div>
            </div>
            <p className="text-sm text-blue-100">35L restants</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Mon objectif hebdo</h3>
          <p className="text-gray-900 text-2xl">315 L</p>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '88%' }}></div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Économies ce mois</h3>
          <p className="text-gray-900 text-2xl">180 L</p>
          <p className="text-sm text-green-600 mt-2">≈ 0.72 € économisés</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Trophy className="w-10 h-10 text-amber-600" />
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Classement</h3>
          <p className="text-gray-900 text-2xl">#12</p>
          <p className="text-sm text-gray-600 mt-2">Sur 120 logements</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900">Consommation journalière</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setPeriod('week')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  period === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Semaine
              </button>
              <button
                onClick={() => setPeriod('month')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  period === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Mois
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={weekData}>
              <defs>
                <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Area type="monotone" dataKey="goal" stroke="#10b981" strokeDasharray="3 3" fill="none" name="Objectif" />
              <Area type="monotone" dataKey="consumption" stroke="#3b82f6" fillOpacity={1} fill="url(#colorConsumption)" name="Consommation" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-gray-900 mb-4">Répartition par usage</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={usageData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {usageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {usageData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-gray-900 mb-4">Mes badges</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Première semaine', icon: '🎯', earned: true },
            { name: 'Économe', icon: '💧', earned: true },
            { name: 'Top 20', icon: '🏆', earned: true },
            { name: 'Champion mensuel', icon: '👑', earned: false },
          ].map((badge, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg text-center ${
                badge.earned ? 'bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-200' : 'bg-gray-50 border border-gray-200 opacity-50'
              }`}
            >
              <div className="text-3xl mb-2">{badge.icon}</div>
              <p className="text-sm text-gray-900">{badge.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
