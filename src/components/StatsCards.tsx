import React from 'react';
import { Droplets, TrendingDown, TrendingUp, Target, Award } from 'lucide-react';

interface StatsCardsProps {
  period: 'day' | 'week' | 'month';
}

export function StatsCards({ period }: StatsCardsProps) {
  const stats = {
    day: {
      current: 245,
      average: 280,
      target: 200,
      savings: 12.5,
      efficiency: 87
    },
    week: {
      current: 1680,
      average: 1920,
      target: 1400,
      savings: 12.5,
      efficiency: 87
    },
    month: {
      current: 7200,
      average: 8400,
      target: 6000,
      savings: 14.3,
      efficiency: 83
    }
  };

  const data = stats[period];
  const unit = period === 'day' ? 'L' : period === 'week' ? 'L' : 'm³';
  const change = ((data.current - data.average) / data.average) * 100;
  const isImprovement = change < 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* Current Consumption */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Droplets className="w-6 h-6 text-blue-600" />
          </div>
          <span className={`flex items-center gap-1 text-sm ${isImprovement ? 'text-green-600' : 'text-red-600'}`}>
            {isImprovement ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
            {Math.abs(change).toFixed(1)}%
          </span>
        </div>
        <h3 className="text-gray-600 text-sm mb-1">Consommation actuelle</h3>
        <p className="text-gray-900">
          {data.current.toLocaleString()} {unit}
        </p>
      </div>

      {/* Average Consumption */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
        </div>
        <h3 className="text-gray-600 text-sm mb-1">Moyenne historique</h3>
        <p className="text-gray-900">
          {data.average.toLocaleString()} {unit}
        </p>
      </div>

      {/* Target */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Target className="w-6 h-6 text-green-600" />
          </div>
          <span className="text-sm text-gray-500">
            {((data.current / data.target) * 100).toFixed(0)}%
          </span>
        </div>
        <h3 className="text-gray-600 text-sm mb-1">Objectif {period === 'day' ? 'journalier' : period === 'week' ? 'hebdomadaire' : 'mensuel'}</h3>
        <p className="text-gray-900">
          {data.target.toLocaleString()} {unit}
        </p>
      </div>

      {/* Efficiency Score */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
            <Award className="w-6 h-6 text-amber-600" />
          </div>
        </div>
        <h3 className="text-gray-600 text-sm mb-1">Score d'efficacité</h3>
        <p className="text-gray-900">
          {data.efficiency}%
        </p>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-amber-500 to-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${data.efficiency}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
