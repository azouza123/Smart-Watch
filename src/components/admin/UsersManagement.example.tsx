// EXEMPLE : Comment connecter les boutons au backend
// Remplacez le contenu de UsersManagement.tsx par cette version

import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Search, Filter, Shield } from 'lucide-react';
import { adminApi } from '../../services/api';

export function UsersManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les utilisateurs au montage du composant
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getUsers();
      // Adapter les données du backend au format frontend
      const adaptedUsers = data.map((user: any) => ({
        id: user.id,
        name: `${user.prenom} ${user.nom}`,
        email: user.email,
        role: user.role?.toLowerCase() || 'occupant',
        status: 'active', // Vous pouvez ajouter un champ status dans le backend
        lastLogin: 'N/A', // Vous pouvez ajouter un champ lastLogin dans le backend
      }));
      setUsers(adaptedUsers);
      setError(null);
    } catch (err: any) {
      setError('Erreur lors du chargement des utilisateurs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handler pour créer un utilisateur
  const handleCreateUser = async (userData: any) => {
    try {
      await adminApi.createUser({
        nom: userData.nom,
        prenom: userData.prenom,
        email: userData.email,
        motDePasse: userData.password,
        role: userData.role.toUpperCase(),
      });
      await loadUsers(); // Recharger la liste
    } catch (err: any) {
      alert('Erreur lors de la création de l\'utilisateur');
      console.error(err);
    }
  };

  // Handler pour modifier un utilisateur
  const handleEditUser = async (userId: number, userData: any) => {
    try {
      await adminApi.updateUser(userId, {
        nom: userData.nom,
        prenom: userData.prenom,
        email: userData.email,
        role: userData.role.toUpperCase(),
      });
      await loadUsers(); // Recharger la liste
    } catch (err: any) {
      alert('Erreur lors de la modification de l\'utilisateur');
      console.error(err);
    }
  };

  // Handler pour supprimer un utilisateur
  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }
    try {
      await adminApi.deleteUser(userId);
      await loadUsers(); // Recharger la liste
    } catch (err: any) {
      alert('Erreur lors de la suppression de l\'utilisateur');
      console.error(err);
    }
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      admin: 'bg-purple-100 text-purple-700',
      manager: 'bg-blue-100 text-blue-700',
      technician: 'bg-amber-100 text-amber-700',
      occupant: 'bg-green-100 text-green-700',
    };
    return badges[role as keyof typeof badges] || 'bg-gray-100 text-gray-700';
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      admin: 'Administrateur',
      manager: 'Gestionnaire',
      technician: 'Technicien',
      occupant: 'Occupant',
    };
    return labels[role as keyof typeof labels] || role;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Gestion des utilisateurs</h1>
          <p className="text-gray-600">Gérer les comptes et les autorisations</p>
        </div>
        <button 
          onClick={() => {
            // Ouvrir un modal pour créer un utilisateur
            // handleCreateUser(userData);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouvel utilisateur
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-gray-400" />
            <span className="text-2xl text-gray-900">{users.length}</span>
          </div>
          <p className="text-sm text-gray-600">Total utilisateurs</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Shield className="w-8 h-8 text-purple-600" />
            <span className="text-2xl text-purple-900">{users.filter(u => u.role === 'admin').length}</span>
          </div>
          <p className="text-sm text-purple-700">Administrateurs</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-blue-600" />
            <span className="text-2xl text-blue-900">{users.filter(u => u.role === 'manager').length}</span>
          </div>
          <p className="text-sm text-blue-700">Gestionnaires</p>
        </div>
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-green-600" />
            <span className="text-2xl text-green-900">{users.filter(u => u.role === 'occupant').length}</span>
          </div>
          <p className="text-sm text-green-700">Occupants</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les rôles</option>
            <option value="admin">Administrateurs</option>
            <option value="manager">Gestionnaires</option>
            <option value="technician">Techniciens</option>
            <option value="occupant">Occupants</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 text-sm text-gray-600">Utilisateur</th>
                <th className="text-left py-3 px-6 text-sm text-gray-600">Email</th>
                <th className="text-left py-3 px-6 text-sm text-gray-600">Rôle</th>
                <th className="text-left py-3 px-6 text-sm text-gray-600">Statut</th>
                <th className="text-left py-3 px-6 text-sm text-gray-600">Dernière connexion</th>
                <th className="text-left py-3 px-6 text-sm text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-500 rounded-lg flex items-center justify-center text-white">
                        {user.name.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">{user.email}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs ${getRoleBadge(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">{user.lastLogin}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEditUser(user.id, user)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

