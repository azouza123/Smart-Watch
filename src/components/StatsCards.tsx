import React, { useState, useEffect } from 'react';
import { Droplets, Radio, Building2, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8081/api';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

interface StatsCardsProps {
  period: 'day' | 'week' | 'month';
}

interface RealStats {
  totalCapteurs: number;
  nbEnLigne: number;
  nbHorsLigne: number;
  nbBatterieFaible: number;
  totalBatiments: number;
  nbAlertesOuvertes: number;
  nbAlertesTotal: number;
}

export function StatsCards({ period }: StatsCardsProps) {
  const [stats, setStats] = useState<RealStats>({
    totalCapteurs: 0,
    nbEnLigne: 0,
    nbHorsLigne: 0,
    nbBatterieFaible: 0,
    totalBatiments: 0,
    nbAlertesOuvertes: 0,
    nbAlertesTotal: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [capteurStats, batiments, alerteStats] = await Promise.all([
        fetch(`${API_BASE_URL}/capteurs/stats`, { headers: getAuthHeaders() }).then(r => r.json()),
        fetch(`${API_BASE_URL}/batiments`, { headers: getAuthHeaders() }).then(r => r.json()),
        fetch(`${API_BASE_URL}/alertes/stats`, { headers: getAuthHeaders() }).then(r => r.json()),
      ]);

      setStats({
        totalCapteurs: capteurStats.totalCapteurs,
        nbEnLigne: capteurStats.nbEnLigne,
        nbHorsLigne: capteurStats.nbHorsLigne,
        nbBatterieFaible: capteurStats.nbBatterieFaible,
        totalBatiments: batiments.length,
        nbAlertesOuvertes: alerteStats.nbOpen,
        nbAlertesTotal: alerteStats.total,
      });
    } catch (err) {
      console.error('Erreur chargement stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const efficiency = stats.totalCapteurs > 0
    ? Math.round((stats.nbEnLigne / stats.totalCapteurs) * 100)
    : 0;

  const cards = [
    {
      title: 'Capteurs actifs',
      value: loading ? '...' : `${stats.nbEnLigne} / ${stats.totalCapteurs}`,
      subtitle: `${stats.nbHorsLigne} hors ligne`,
      icon: <Radio className="w-6 h-6 text-blue-600" />,
      iconBg: 'bg-blue-100',
      badge: stats.nbEnLigne > 0
        ? { label: `${efficiency}% en ligne`, color: 'text-green-600' }
        : null,
      trend: null,
    },
    {
      title: 'Bâtiments gérés',
      value: loading ? '...' : stats.totalBatiments.toString(),
      subtitle: 'Bâtiments enregistrés',
      icon: <Building2 className="w-6 h-6 text-purple-600" />,
      iconBg: 'bg-purple-100',
      badge: null,
      trend: null,
    },
    {
      title: 'Alertes ouvertes',
      value: loading ? '...' : stats.nbAlertesOuvertes.toString(),
      subtitle: `${stats.nbAlertesTotal} alertes au total`,
      icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
      iconBg: stats.nbAlertesOuvertes > 0 ? 'bg-red-100' : 'bg-green-100',
      badge: stats.nbAlertesOuvertes === 0
        ? { label: 'Aucune alerte', color: 'text-green-600' }
        : { label: 'À traiter', color: 'text-red-600' },
      trend: null,
    },
    {
      title: 'Score d\'efficacité',
      value: loading ? '...' : `${efficiency}%`,
      subtitle: 'Basé sur les capteurs actifs',
      icon: efficiency >= 80
        ? <TrendingDown className="w-6 h-6 text-green-600" />
        : <TrendingUp className="w-6 h-6 text-amber-600" />,
      iconBg: efficiency >= 80 ? 'bg-green-100' : 'bg-amber-100',
      badge: null,
      trend: efficiency,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${card.iconBg} rounded-lg flex items-center justify-center`}>
              {card.icon}
            </div>
            {card.badge && (
              <span className={`text-sm font-medium ${card.badge.color}`}>
                {card.badge.label}
              </span>
            )}
          </div>
          <h3 className="text-gray-600 text-sm mb-1">{card.title}</h3>
          <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
          <p className="text-xs text-gray-500">{card.subtitle}</p>
          {card.trend !== null && (
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  card.trend >= 80
                    ? 'bg-gradient-to-r from-green-400 to-green-600'
                    : card.trend >= 60
                    ? 'bg-gradient-to-r from-amber-400 to-amber-600'
                    : 'bg-gradient-to-r from-red-400 to-red-600'
                }`}
                style={{ width: `${card.trend}%` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}