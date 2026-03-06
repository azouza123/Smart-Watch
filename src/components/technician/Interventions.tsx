import React, { useState, useEffect } from 'react';
import { Wrench, CheckCircle, Clock, AlertCircle, X } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8081/api';
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export function Interventions() {
  const [alertes, setAlertes] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newNote, setNewNote] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchAlertes(); }, []);

  const fetchAlertes = async () => {
    try {
      setLoading(true);
      const data = await fetch(`${API_BASE_URL}/alertes`, { headers: getAuthHeaders() }).then(r => r.json());
      setAlertes(data);
    } catch {
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatut = async (id: number, statut: string) => {
    setSaving(true);
    try {
      await fetch(`${API_BASE_URL}/alertes/${id}/statut?statut=${statut}`, {
        method: 'PUT', headers: getAuthHeaders()
      });
      await fetchAlertes();
    } catch {
      setError('Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleAddNote = async (id: number) => {
    const text = newNote[id];
    if (!text?.trim()) return;
    setSaving(true);
    try {
      await fetch(`${API_BASE_URL}/alertes/${id}/notes`, {
        method: 'POST', headers: getAuthHeaders(),
        body: JSON.stringify({ author: 'Technicien', text }),
      });
      await fetchAlertes();
      setNewNote(p => ({ ...p, [id]: '' }));
    } catch {
      setError("Erreur lors de l'ajout de la note");
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RESOLVED': return 'bg-green-100 text-green-700';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700';
      case 'OPEN': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-600 text-white';
      case 'HIGH': return 'bg-orange-600 text-white';
      case 'MEDIUM': return 'bg-amber-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'RESOLVED': return 'Résolue';
      case 'IN_PROGRESS': return 'En cours';
      case 'OPEN': return 'Ouverte';
      default: return status;
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'Critique';
      case 'HIGH': return 'Urgent';
      case 'MEDIUM': return 'Moyen';
      case 'LOW': return 'Faible';
      default: return severity;
    }
  };

  const filteredAlertes = statusFilter === 'all'
    ? alertes
    : alertes.filter(a => a.status === statusFilter);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between">
          {error}<button onClick={() => setError('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Mes interventions</h1>
          <p className="text-gray-600">Suivi des alertes et tâches assignées</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-amber-600" />
            <span className="text-2xl text-amber-900">{alertes.filter(a => a.status === 'OPEN').length}</span>
          </div>
          <p className="text-sm text-amber-700">Ouvertes</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Wrench className="w-8 h-8 text-blue-600" />
            <span className="text-2xl text-blue-900">{alertes.filter(a => a.status === 'IN_PROGRESS').length}</span>
          </div>
          <p className="text-sm text-blue-700">En cours</p>
        </div>
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-2xl text-green-900">{alertes.filter(a => a.status === 'RESOLVED').length}</span>
          </div>
          <p className="text-sm text-green-700">Résolues</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'all', label: 'Toutes' },
            { key: 'OPEN', label: 'Ouvertes' },
            { key: 'IN_PROGRESS', label: 'En cours' },
            { key: 'RESOLVED', label: 'Résolues' },
          ].map(btn => (
            <button key={btn.key} onClick={() => setStatusFilter(btn.key)}
              className={`px-4 py-2 rounded-lg transition-colors ${statusFilter === btn.key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filteredAlertes.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-3" />
          <p>Aucune intervention trouvée</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlertes.map((alerte) => (
            <div key={alerte.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-3 rounded-lg ${
                    alerte.status === 'RESOLVED' ? 'bg-green-100' :
                    alerte.status === 'IN_PROGRESS' ? 'bg-blue-100' : 'bg-amber-100'
                  }`}>
                    {alerte.status === 'RESOLVED'
                      ? <CheckCircle className="w-6 h-6 text-green-600" />
                      : alerte.status === 'IN_PROGRESS'
                      ? <Wrench className="w-6 h-6 text-blue-600" />
                      : <Clock className="w-6 h-6 text-amber-600" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-gray-900 font-medium">{alerte.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(alerte.status)}`}>
                        {getStatusLabel(alerte.status)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(alerte.severity)}`}>
                        {getSeverityLabel(alerte.severity)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      📍 {alerte.batimentNom || '—'} › {alerte.zone || '—'} › {alerte.unit || '—'}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Seuil / Valeur détectée</p>
                        <p className="text-gray-900">{alerte.threshold} L/h → <span className="text-red-600">{alerte.actual} L/h</span></p>
                      </div>
                      {alerte.assignee && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Assigné à</p>
                          <p className="text-gray-900">👤 {alerte.assignee}</p>
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    {alerte.notes && alerte.notes.length > 0 && (
                      <div className="mb-3 space-y-2">
                        {alerte.notes.map((note: any, idx: number) => (
                          <div key={idx} className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex justify-between mb-1">
                              <span className="text-xs font-medium text-blue-900">{note.author}</span>
                              <span className="text-xs text-blue-600">{note.time}</span>
                            </div>
                            <p className="text-xs text-gray-900">{note.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add note */}
                    <div className="flex gap-2 mt-2">
                      <input type="text"
                        placeholder="Ajouter une note..."
                        value={newNote[alerte.id] || ''}
                        onChange={e => setNewNote(p => ({ ...p, [alerte.id]: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && handleAddNote(alerte.id)}
                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                      <button onClick={() => handleAddNote(alerte.id)}
                        disabled={saving || !newNote[alerte.id]?.trim()}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 text-sm">
                        Ajouter
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {alerte.status === 'OPEN' && (
                    <button onClick={() => handleUpdateStatut(alerte.id, 'IN_PROGRESS')}
                      disabled={saving}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-60">
                      Commencer
                    </button>
                  )}
                  {alerte.status === 'IN_PROGRESS' && (
                    <button onClick={() => handleUpdateStatut(alerte.id, 'RESOLVED')}
                      disabled={saving}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-60">
                      Terminer
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}