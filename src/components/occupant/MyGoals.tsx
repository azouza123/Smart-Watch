import React, { useState, useEffect } from 'react';
import { Target, TrendingDown, Calendar, Save, CheckCircle, X } from 'lucide-react';
import { User } from '../../App';

const API_BASE_URL = 'http://localhost:8081/api';
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

interface MyGoalsProps {
  user: User;
}

export function MyGoals({ user }: MyGoalsProps) {
  const [weeklyGoal, setWeeklyGoal] = useState(315);
  const [monthlyGoal, setMonthlyGoal] = useState(1260);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchGoals(); }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const data = await fetch(
        `${API_BASE_URL}/objectifs/user/${user.id}`,
        { headers: getAuthHeaders() }
      ).then(r => r.json());

      if (data.objectifHebdo) setWeeklyGoal(data.objectifHebdo);
      if (data.objectifMensuel) setMonthlyGoal(data.objectifMensuel);
    } catch {
      // use defaults if no goals saved yet
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await fetch(`${API_BASE_URL}/objectifs/user/${user.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          objectifHebdo: weeklyGoal,
          objectifMensuel: monthlyGoal,
        }),
      }).then(r => {
        if (!r.ok) throw new Error('Erreur sauvegarde');
        return r.json();
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Mes objectifs</h1>
        <p className="text-gray-600">Définissez vos objectifs de consommation</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between">
          {error}<button onClick={() => setError('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Objectifs enregistrés avec succès !
        </div>
      )}

      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-blue-500 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Target className="w-8 h-8" />
          <div>
            <h2 className="text-white">Votre engagement environnemental</h2>
            <p className="text-green-100 text-sm">Chaque litre compte pour la planète</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-3xl mb-1">{weeklyGoal} L</div>
            <p className="text-sm text-green-100">Objectif semaine</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-1">{monthlyGoal} L</div>
            <p className="text-sm text-green-100">Objectif mois</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-1">{Math.round(weeklyGoal / 7)} L</div>
            <p className="text-sm text-green-100">Par jour</p>
          </div>
        </div>
      </div>

      {/* Goal sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h2 className="text-gray-900">Objectif hebdomadaire</h2>
          </div>
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-2">
              Consommation cible (litres/semaine)
            </label>
            <input type="range" min="200" max="500" value={weeklyGoal}
              onChange={e => setWeeklyGoal(parseInt(e.target.value))}
              className="w-full accent-blue-600" />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>200 L</span>
              <span className="text-blue-600 font-medium">{weeklyGoal} L</span>
              <span>500 L</span>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Consommation moyenne/jour</span>
              <span className="text-gray-900">{Math.round(weeklyGoal / 7)} L</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Objectif mensuel équivalent</span>
              <span className="text-gray-900">{weeklyGoal * 4} L</span>
            </div>
          </div>
        </div>

        {/* Monthly */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <TrendingDown className="w-6 h-6 text-green-600" />
            <h2 className="text-gray-900">Objectif mensuel</h2>
          </div>
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-2">
              Consommation cible (litres/mois)
            </label>
            <input type="range" min="800" max="2000" value={monthlyGoal}
              onChange={e => setMonthlyGoal(parseInt(e.target.value))}
              className="w-full accent-green-600" />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>800 L</span>
              <span className="text-green-600 font-medium">{monthlyGoal} L</span>
              <span>2000 L</span>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Objectif hebdo équivalent</span>
              <span className="text-gray-900">{Math.round(monthlyGoal / 4)} L</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Par jour</span>
              <span className="text-gray-900">{Math.round(monthlyGoal / 30)} L</span>
            </div>
          </div>
        </div>
      </div>

      {/* Presets */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-gray-900 mb-4">Objectifs recommandés</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Conservateur', weekly: 350, monthly: 1400, difficulty: 'Facile',
              bg: 'bg-green-50', border: 'border-green-200 hover:border-green-400', text: 'text-green-700' },
            { name: 'Équilibré', weekly: 300, monthly: 1200, difficulty: 'Moyen',
              bg: 'bg-blue-50', border: 'border-blue-200 hover:border-blue-400', text: 'text-blue-700' },
            { name: 'Ambitieux', weekly: 250, monthly: 1000, difficulty: 'Difficile',
              bg: 'bg-purple-50', border: 'border-purple-200 hover:border-purple-400', text: 'text-purple-700' },
          ].map((preset, idx) => (
            <button key={idx}
              onClick={() => { setWeeklyGoal(preset.weekly); setMonthlyGoal(preset.monthly); }}
              className={`p-4 rounded-lg border-2 ${preset.border} transition-all text-left ${preset.bg} ${
                weeklyGoal === preset.weekly && monthlyGoal === preset.monthly
                  ? 'ring-2 ring-offset-2 ring-blue-500'
                  : ''
              }`}>
              <h3 className="text-gray-900 font-medium mb-1">{preset.name}</h3>
              <p className={`text-xs mb-3 ${preset.text}`}>{preset.difficulty}</p>
              <div className="space-y-1 text-sm">
                <p className="text-gray-700">{preset.weekly} L/semaine</p>
                <p className="text-gray-700">{preset.monthly} L/mois</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60">
          {saved
            ? <><CheckCircle className="w-5 h-5" /> Enregistré !</>
            : saving
            ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> Enregistrement...</>
            : <><Save className="w-5 h-5" /> Enregistrer mes objectifs</>
          }
        </button>
      </div>
    </div>
  );
}