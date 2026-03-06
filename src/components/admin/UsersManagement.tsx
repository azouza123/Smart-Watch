import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Search, Shield, X, Save } from 'lucide-react';
import { utilisateurApi } from '../../services/api';

type Role = 'ADMINISTRATEUR' | 'GESTIONNAIRE' | 'TECHNICIEN' | 'OCCUPANT';
type Statut = 'ACTIF' | 'BLOQUE';

interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: Role;
  statut: Statut;
}

const Modal = ({ isOpen, onClose, title, children }: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-blue-800 rounded-lg text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export function UsersManagement() {
  const [users, setUsers] = useState<Utilisateur[]>([]);
  const [stats, setStats] = useState({
    totalUtilisateurs: 0,
    nbAdministrateurs: 0,
    nbGestionnaires: 0,
    nbOccupants: 0,
    nbTechniciens: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Utilisateur | null>(null);
  const [newUser, setNewUser] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    role: 'OCCUPANT' as Role
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchUsers(); fetchStats(); }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await utilisateurApi.getAll();
      setUsers(data);
    } catch (err: any) {
      setError('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await utilisateurApi.getStats();
      setStats(data);
    } catch (err) {}
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch('http://localhost:8081/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newUser),
      }).then(r => {
        if (!r.ok) return r.text().then(t => { throw new Error(t); });
      });
      await fetchUsers();
      await fetchStats();
      setNewUser({ nom: '', prenom: '', email: '', motDePasse: '', role: 'OCCUPANT' });
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setSaving(true);
    try {
      await utilisateurApi.update(editingUser.id, editingUser);
      await fetchUsers();
      await fetchStats();
      setIsEditModalOpen(false);
      setEditingUser(null);
    } catch (err: any) {
      setError('Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    try {
      await utilisateurApi.delete(id);
      await fetchUsers();
      await fetchStats();
    } catch (err: any) {
      setError('Erreur lors de la suppression');
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: Statut) => {
    try {
      // ACTIF → false → BLOQUE | BLOQUE → true → ACTIF
      await utilisateurApi.changeStatus(id, currentStatus !== 'ACTIF');
      await fetchUsers();
    } catch (err) {
      setError('Erreur lors du changement de statut');
    }
  };

  const getRoleBadge = (role: Role) => {
    const badges = {
      ADMINISTRATEUR: 'bg-purple-100 text-purple-700',
      GESTIONNAIRE: 'bg-blue-100 text-blue-700',
      TECHNICIEN: 'bg-amber-100 text-amber-700',
      OCCUPANT: 'bg-green-100 text-green-700'
    };
    return badges[role] || 'bg-gray-100 text-gray-700';
  };

  const getRoleLabel = (role: Role) => {
    const labels = {
      ADMINISTRATEUR: 'Administrateur',
      GESTIONNAIRE: 'Gestionnaire',
      TECHNICIEN: 'Technicien',
      OCCUPANT: 'Occupant'
    };
    return labels[role] || role;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      `${user.prenom} ${user.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between">
          {error}
          <button onClick={() => setError('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouvel utilisateur">
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
              <input type="text" required value={newUser.prenom}
                onChange={e => setNewUser(p => ({ ...p, prenom: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input type="text" required value={newUser.nom}
                onChange={e => setNewUser(p => ({ ...p, nom: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" required value={newUser.email}
              onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
            <input type="password" required value={newUser.motDePasse}
              onChange={e => setNewUser(p => ({ ...p, motDePasse: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rôle *</label>
            <select value={newUser.role}
              onChange={e => setNewUser(p => ({ ...p, role: e.target.value as Role }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option value="OCCUPANT">Occupant</option>
              <option value="TECHNICIEN">Technicien</option>
              <option value="GESTIONNAIRE">Gestionnaire</option>
              <option value="ADMINISTRATEUR">Administrateur</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2">
              <Save className="w-4 h-4" />
              {saving ? 'Création...' : 'Créer'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Modifier l'utilisateur">
        <form onSubmit={handleUpdateUser} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input type="text" value={editingUser?.prenom || ''}
                onChange={e => setEditingUser(p => p ? { ...p, prenom: e.target.value } : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input type="text" value={editingUser?.nom || ''}
                onChange={e => setEditingUser(p => p ? { ...p, nom: e.target.value } : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={editingUser?.email || ''}
              onChange={e => setEditingUser(p => p ? { ...p, email: e.target.value } : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
            <select value={editingUser?.role || 'OCCUPANT'}
              onChange={e => setEditingUser(p => p ? { ...p, role: e.target.value as Role } : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option value="OCCUPANT">Occupant</option>
              <option value="TECHNICIEN">Technicien</option>
              <option value="GESTIONNAIRE">Gestionnaire</option>
              <option value="ADMINISTRATEUR">Administrateur</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" disabled={saving}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60 flex items-center gap-2">
              <Save className="w-4 h-4" />
              {saving ? 'Mise à jour...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Gestion des utilisateurs</h1>
          <p className="text-gray-600">Gérer les comptes et les autorisations</p>
        </div>
        <button onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Nouvel utilisateur
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-gray-400" />
            <span className="text-2xl text-gray-900">{stats.totalUtilisateurs}</span>
          </div>
          <p className="text-sm text-gray-600">Total utilisateurs</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Shield className="w-8 h-8 text-purple-600" />
            <span className="text-2xl text-purple-900">{stats.nbAdministrateurs}</span>
          </div>
          <p className="text-sm text-purple-700">Administrateurs</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-blue-600" />
            <span className="text-2xl text-blue-900">{stats.nbGestionnaires}</span>
          </div>
          <p className="text-sm text-blue-700">Gestionnaires</p>
        </div>
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-green-600" />
            <span className="text-2xl text-green-900">{stats.nbOccupants}</span>
          </div>
          <p className="text-sm text-green-700">Occupants</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Rechercher par nom ou email..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">Tous les rôles</option>
            <option value="ADMINISTRATEUR">Administrateurs</option>
            <option value="GESTIONNAIRE">Gestionnaires</option>
            <option value="TECHNICIEN">Techniciens</option>
            <option value="OCCUPANT">Occupants</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 text-sm text-gray-600">Utilisateur</th>
                <th className="text-left py-3 px-6 text-sm text-gray-600">Email</th>
                <th className="text-left py-3 px-6 text-sm text-gray-600">Rôle</th>
                <th className="text-left py-3 px-6 text-sm text-gray-600">Statut</th>
                <th className="text-left py-3 px-6 text-sm text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-500 rounded-lg flex items-center justify-center text-white font-medium">
                        {user.prenom?.charAt(0)}{user.nom?.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-900">{user.prenom} {user.nom}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">{user.email}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs ${getRoleBadge(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleToggleStatus(user.id, user.statut)}
                      className={`px-3 py-1 rounded-full text-xs cursor-pointer transition-colors ${
                        user.statut === 'ACTIF'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}>
                      {user.statut === 'ACTIF' ? 'Actif' : 'Bloqué'}
                    </button>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setEditingUser(user); setIsEditModalOpen(true); }}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}