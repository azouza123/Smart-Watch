import React from 'react';
import { TrendingUp, Users, Award, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function MyComparison() {
  const comparisonData = [
    { category: 'Vous', consumption: 280, color: '#3b82f6' },
    { category: 'Moyenne bâtiment', consumption: 320, color: '#94a3b8' },
    { category: 'Moyenne campus', consumption: 340, color: '#cbd5e1' },
    { category: 'Top 10%', consumption: 220, color: '#10b981' },
  ];

  const leaderboard = [
    { rank: 1, name: 'Logement A305', consumption: 210, badge: '🏆' },
    { rank: 2, name: 'Logement B102', consumption: 215, badge: '🥈' },
    { rank: 3, name: 'Logement A208', consumption: 218, badge: '🥉' },
    { rank: 10, name: 'Logement A115', consumption: 265, badge: '' },
    { rank: 11, name: 'Logement C201', consumption: 270, badge: '' },
    { rank: 12, name: 'Vous (A101)', consumption: 280, badge: '', highlight: true },
    { rank: 13, name: 'Logement A302', consumption: 285, badge: '' },
    { rank: 14, name: 'Logement B205', consumption: 290, badge: '' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Comparaisons</h1>
        <p className="text-gray-600">Comparez votre consommation (données anonymisées)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-8 h-8 text-amber-600" />
            <span className="text-2xl text-gray-900">#12</span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Votre classement</p>
          <p className="text-xs text-gray-500">Sur 120 logements</p>
        </div>
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="w-8 h-8 text-green-600" />
            <span className="text-2xl text-green-900">-12.5%</span>
          </div>
          <p className="text-sm text-green-700 mb-1">vs Moyenne bâtiment</p>
          <p className="text-xs text-green-600">Vous économisez 40L/semaine</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-blue-600" />
            <span className="text-2xl text-blue-900">Top 15%</span>
          </div>
          <p className="text-sm text-blue-700 mb-1">Performance globale</p>
          <p className="text-xs text-blue-600">Meilleur que 85% des logements</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-gray-900 mb-4">Votre position</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="category" stroke="#6b7280" />
            <YAxis stroke="#6b7280" label={{ value: 'Litres/semaine', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="consumption" radius={[8, 8, 0, 0]}>
              {comparisonData.map((entry, index) => (
                <rect key={`rect-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-gray-900">Classement (consommation hebdomadaire)</h2>
          <p className="text-sm text-gray-500 mt-1">Données anonymisées pour préserver la vie privée</p>
        </div>
        <div className="divide-y divide-gray-200">
          {leaderboard.map((entry) => (
            <div
              key={entry.rank}
              className={`p-4 flex items-center justify-between ${
                entry.highlight ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-50'
              } transition-colors`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  entry.rank <= 3 ? 'bg-amber-100' : entry.highlight ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <span className="text-gray-900">#{entry.rank}</span>
                </div>
                <div>
                  <p className={`text-sm ${entry.highlight ? 'text-blue-900' : 'text-gray-900'}`}>
                    {entry.badge} {entry.name}
                  </p>
                  <p className="text-xs text-gray-500">{entry.consumption} L/semaine</p>
                </div>
              </div>
              {entry.highlight && (
                <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs">
                  Vous
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-600 to-blue-500 rounded-xl p-6 text-white">
        <h2 className="text-white mb-3">🎯 Défi du mois</h2>
        <p className="text-green-100 mb-4">
          Entrez dans le Top 10 et remportez le badge "Champion mensuel" !
        </p>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-green-100 mb-2">Progression vers le Top 10</p>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div className="bg-white h-3 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl">75%</p>
            <p className="text-xs text-green-100">Réduisez 15L/semaine</p>
          </div>
        </div>
      </div>
    </div>
  );
}
