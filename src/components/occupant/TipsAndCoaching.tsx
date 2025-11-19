import React from 'react';
import { Lightbulb, Droplet, Clock, CheckCircle } from 'lucide-react';

export function TipsAndCoaching() {
  const tips = [
    {
      id: 1,
      category: 'Douche',
      title: 'Réduisez votre temps de douche',
      description: 'Une douche de 5 minutes consomme environ 60L. Réduire de 2 minutes économise 24L.',
      impact: 'Haut',
      savings: '168 L/semaine',
      completed: false,
    },
    {
      id: 2,
      category: 'Cuisine',
      title: 'Utilisez le lave-vaisselle en mode éco',
      description: 'Le mode éco consomme 30% d\'eau en moins qu\'un cycle normal.',
      impact: 'Moyen',
      savings: '40 L/semaine',
      completed: true,
    },
    {
      id: 3,
      category: 'Toilettes',
      title: 'Vérifiez les fuites',
      description: 'Une chasse d\'eau qui fuit peut gaspiller jusqu\'à 600L par jour.',
      impact: 'Critique',
      savings: 'Jusqu\'à 4,200 L/semaine',
      completed: false,
    },
    {
      id: 4,
      category: 'Général',
      title: 'Fermez le robinet en vous brossant les dents',
      description: 'Laisser couler l\'eau pendant 2 minutes gaspille 12L.',
      impact: 'Faible',
      savings: '24 L/semaine',
      completed: true,
    },
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Critique':
        return 'bg-red-100 text-red-700';
      case 'Haut':
        return 'bg-orange-100 text-orange-700';
      case 'Moyen':
        return 'bg-amber-100 text-amber-700';
      case 'Faible':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Conseils personnalisés</h1>
        <p className="text-gray-600">Des astuces adaptées à vos habitudes</p>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-green-500 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Lightbulb className="w-10 h-10" />
          <div>
            <h2 className="text-white mb-1">Conseil de la semaine</h2>
            <p className="text-blue-100 text-sm">Basé sur votre consommation</p>
          </div>
        </div>
        <p className="text-lg mb-4">
          Votre consommation de douche représente 45% de votre total. 
          En réduisant de 2 minutes par jour, vous pourriez économiser 168L par semaine !
        </p>
        <button className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
          Appliquer ce conseil
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <div className="text-3xl text-gray-900 mb-1">2</div>
          <p className="text-sm text-gray-600">Conseils appliqués</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <Droplet className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <div className="text-3xl text-gray-900 mb-1">64 L</div>
          <p className="text-sm text-gray-600">Économisés/semaine</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <Clock className="w-12 h-12 text-amber-600 mx-auto mb-3" />
          <div className="text-3xl text-gray-900 mb-1">4</div>
          <p className="text-sm text-gray-600">En attente</p>
        </div>
      </div>

      <div className="space-y-4">
        {tips.map((tip) => (
          <div
            key={tip.id}
            className={`bg-white rounded-xl p-6 shadow-sm border-2 ${
              tip.completed ? 'border-green-200 bg-green-50/30' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-4 flex-1">
                {tip.completed ? (
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                ) : (
                  <Lightbulb className="w-6 h-6 text-blue-600 mt-1" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-gray-900">{tip.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${getImpactColor(tip.impact)}`}>
                      Impact {tip.impact}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{tip.description}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Droplet className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-900">{tip.savings}</span>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                      {tip.category}
                    </span>
                  </div>
                </div>
              </div>
              {!tip.completed && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  J'ai appliqué
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-gray-900 mb-4">Ressources utiles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Guide des éco-gestes', icon: '📚', desc: 'PDF téléchargeable' },
            { title: 'Vidéo: Réduire sa consommation', icon: '🎥', desc: '5 min' },
            { title: 'Calculateur d\'économies', icon: '🧮', desc: 'Outil interactif' },
            { title: 'FAQ économies d\'eau', icon: '❓', desc: 'Questions fréquentes' },
          ].map((resource, idx) => (
            <button
              key={idx}
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
            >
              <div className="text-3xl">{resource.icon}</div>
              <div>
                <h3 className="text-sm text-gray-900 mb-1">{resource.title}</h3>
                <p className="text-xs text-gray-600">{resource.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
