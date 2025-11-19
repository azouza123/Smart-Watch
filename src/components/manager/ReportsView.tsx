import React from 'react';
import { FileText, Download, Calendar, TrendingUp } from 'lucide-react';

export function ReportsView() {
  const reports = [
    { id: 1, title: 'Rapport mensuel - Octobre 2025', type: 'monthly', date: '2025-10-31', size: '2.4 MB', format: 'PDF' },
    { id: 2, title: 'Analyse trimestrielle Q3 2025', type: 'quarterly', date: '2025-09-30', size: '5.8 MB', format: 'PDF' },
    { id: 3, title: 'Export données brutes - Septembre', type: 'data', date: '2025-09-30', size: '12.1 MB', format: 'CSV' },
    { id: 4, title: 'Rapport économies réalisées 2025', type: 'savings', date: '2025-08-31', size: '3.2 MB', format: 'PDF' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Rapports et exports</h1>
          <p className="text-gray-600">Génération et téléchargement de rapports</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Générer rapport
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200 hover:border-blue-500 transition-all text-left">
          <FileText className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="text-gray-900 mb-2">Rapport mensuel</h3>
          <p className="text-sm text-gray-600">Synthèse complète du mois en cours</p>
        </button>
        <button className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200 hover:border-green-500 transition-all text-left">
          <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
          <h3 className="text-gray-900 mb-2">Analyse économies</h3>
          <p className="text-sm text-gray-600">Rapport des économies réalisées</p>
        </button>
        <button className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200 hover:border-purple-500 transition-all text-left">
          <Download className="w-8 h-8 text-purple-600 mb-3" />
          <h3 className="text-gray-900 mb-2">Export données</h3>
          <p className="text-sm text-gray-600">Export CSV personnalisé</p>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-gray-900">Rapports disponibles</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {reports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-1">{report.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {report.date}
                      </span>
                      <span>{report.size}</span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{report.format}</span>
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="w-4 h-4" />
                  Télécharger
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
