import React from 'react';
import { Shield, Plus, Edit, Trash2, AlertTriangle, Clock, TrendingUp, Droplet } from 'lucide-react';

export function RulesManagement() {
  const rules = [
    {
      id: 1,
      name: 'Surconsommation ponctuelle',
      type: 'consumption',
      description: 'Alerte si consommation > moyenne + 2σ sur 1 heure',
      threshold: 'Dynamique',
      enabled: true,
      triggeredCount: 23,
    },
    {
      id: 2,
      name: 'Fuite nocturne probable',
      type: 'leak',
      description: 'Débit > 1.5 L/h entre 01:00 et 05:00 pendant > 30 min',
      threshold: '1.5 L/h',
      enabled: true,
      triggeredCount: 8,
    },
    {
      id: 3,
      name: 'Capteur muet',
      type: 'sensor',
      description: 'Pas de données reçues depuis > 2 heures',
      threshold: '2 heures',
      enabled: true,
      triggeredCount: 5,
    },
    {
      id: 4,
      name: 'Dépassement objectif mensuel',
      type: 'goal',
      description: 'Projection mensuelle > objectif fixé',
      threshold: 'Objectif utilisateur',
      enabled: true,
      triggeredCount: 12,
    },
    {
      id: 5,
      name: 'Pic de consommation',
      type: 'consumption',
      description: 'Consommation > 100L sur 15 minutes',
      threshold: '100 L / 15 min',
      enabled: false,
      triggeredCount: 0,
    },
  ];

  const getRuleIcon = (type: string) => {
    switch (type) {
      case 'consumption':
        return <TrendingUp className="w-5 h-5 text-blue-600" />;
      case 'leak':
        return <Droplet className="w-5 h-5 text-red-600" />;
      case 'sensor':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'goal':
        return <Clock className="w-5 h-5 text-purple-600" />;
      default:
        return <Shield className="w-5 h-5 text-gray-600" />;
    }
  };

  const getRuleColor = (type: string) => {
    switch (type) {
      case 'consumption':
        return 'bg-blue-50 border-blue-200';
      case 'leak':
        return 'bg-red-50 border-red-200';
      case 'sensor':
        return 'bg-amber-50 border-amber-200';
      case 'goal':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Règles & Seuils d'alerte</h1>
          <p className="text-gray-600">Configuration des règles de détection automatique</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Nouvelle règle
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Shield className="w-8 h-8 text-gray-400" />
            <span className="text-2xl text-gray-900">{rules.length}</span>
          </div>
          <p className="text-sm text-gray-600">Règles configurées</p>
        </div>
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <Shield className="w-8 h-8 text-green-600" />
            <span className="text-2xl text-green-900">{rules.filter(r => r.enabled).length}</span>
          </div>
          <p className="text-sm text-green-700">Règles actives</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-8 h-8 text-blue-600" />
            <span className="text-2xl text-blue-900">{rules.reduce((sum, r) => sum + r.triggeredCount, 0)}</span>
          </div>
          <p className="text-sm text-blue-700">Déclenchements (7j)</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-amber-600" />
            <span className="text-2xl text-amber-900">15 min</span>
          </div>
          <p className="text-sm text-amber-700">Temps de réponse moy.</p>
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {rules.map((rule) => (
          <div key={rule.id} className={`bg-white rounded-xl p-6 shadow-sm border ${getRuleColor(rule.type)}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="mt-1">
                  {getRuleIcon(rule.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-gray-900">{rule.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      rule.enabled 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {rule.enabled ? 'Activée' : 'Désactivée'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{rule.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Seuil</p>
                      <p className="text-sm text-gray-900">{rule.threshold}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Déclenchements (7 derniers jours)</p>
                      <p className="text-sm text-gray-900">{rule.triggeredCount}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={rule.enabled} className="sr-only peer" onChange={() => {}} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
                <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit className="w-4 h-4 text-blue-600" />
                </button>
                <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>

            {/* Example Alert */}
            {rule.triggeredCount > 0 && (
              <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Dernière alerte générée</p>
                <p className="text-sm text-gray-900">Campus A › Bâtiment Nord › A103 - Il y a 2 heures</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create Rule Template */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-gray-900 mb-4">Modèles de règles disponibles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left">
            <TrendingUp className="w-6 h-6 text-blue-600 mb-2" />
            <h4 className="text-sm text-gray-900 mb-1">Pic inhabituel</h4>
            <p className="text-xs text-gray-600">Détection de consommation anormale</p>
          </button>
          <button className="p-4 bg-white rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-md transition-all text-left">
            <Droplet className="w-6 h-6 text-red-600 mb-2" />
            <h4 className="text-sm text-gray-900 mb-1">Fuite continue</h4>
            <p className="text-xs text-gray-600">Débit constant anormal</p>
          </button>
          <button className="p-4 bg-white rounded-lg border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all text-left">
            <Clock className="w-6 h-6 text-amber-600 mb-2" />
            <h4 className="text-sm text-gray-900 mb-1">Dépassement planning</h4>
            <p className="text-xs text-gray-600">Consommation hors horaires prévus</p>
          </button>
        </div>
      </div>
    </div>
  );
}
