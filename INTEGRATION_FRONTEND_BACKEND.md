# Guide d'intégration Frontend - Backend

## ✅ Service API créé

Le fichier `src/services/api.ts` contient toutes les fonctions pour appeler le backend.

## 📋 Endpoints disponibles

### Admin (`/api/admin`)
- `adminApi.getUsers()` - Liste tous les utilisateurs
- `adminApi.createUser(data)` - Crée un utilisateur
- `adminApi.updateUser(id, data)` - Modifie un utilisateur
- `adminApi.deleteUser(id)` - Supprime un utilisateur
- `adminApi.getBuildings()` - Liste tous les bâtiments
- `adminApi.createBuilding(data)` - Crée un bâtiment
- `adminApi.updateBuilding(id, data)` - Modifie un bâtiment
- `adminApi.deleteBuilding(id)` - Supprime un bâtiment
- `adminApi.getSensors()` - Liste tous les capteurs
- `adminApi.createSensor(data)` - Crée un capteur
- `adminApi.updateSensor(id, data)` - Modifie un capteur
- `adminApi.deleteSensor(id)` - Supprime un capteur

### Manager (`/api/manager`)
- `managerApi.getConsumption()` - Liste les consommations
- `managerApi.getTargets()` - Liste les objectifs
- `managerApi.getAlerts()` - Liste les alertes
- `managerApi.manageAction(data)` - Gère une action

### Occupant (`/api/occupant`)
- `occupantApi.getWaterConsumption()` - Consommation d'eau
- `occupantApi.sendAlert(data)` - Envoie une alerte
- `occupantApi.getAdvice()` - Conseils
- `occupantApi.getComparison()` - Comparaisons

### Technician (`/api/technician`)
- `technicianApi.createIntervention(data)` - Crée une intervention
- `technicianApi.getTasks()` - Liste les tâches
- `technicianApi.getSensorStats()` - Statistiques des capteurs
- `technicianApi.getAlerts()` - Liste les alertes

## 🔧 Comment connecter un composant

### Exemple : UsersManagement

```typescript
import { adminApi } from '../../services/api';
import { useState, useEffect } from 'react';

export function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les données au montage
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await adminApi.getUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Créer un utilisateur
  const handleCreate = async (userData) => {
    try {
      await adminApi.createUser(userData);
      await loadUsers(); // Recharger
    } catch (error) {
      alert('Erreur');
    }
  };

  // Supprimer un utilisateur
  const handleDelete = async (id) => {
    if (confirm('Supprimer ?')) {
      try {
        await adminApi.deleteUser(id);
        await loadUsers(); // Recharger
      } catch (error) {
        alert('Erreur');
      }
    }
  };

  return (
    // Votre JSX ici
    <button onClick={() => handleDelete(user.id)}>Supprimer</button>
  );
}
```

## 🎯 Étapes pour chaque composant

1. **Importer l'API** : `import { adminApi } from '../../services/api';`
2. **Ajouter useState** pour les données
3. **Ajouter useEffect** pour charger au montage
4. **Créer les handlers** pour les boutons (create, update, delete)
5. **Connecter les boutons** avec `onClick={handleFunction}`

## 📝 Format des données

### Utilisateur
```typescript
{
  id: number,
  nom: string,
  prenom: string,
  email: string,
  motDePasse: string,
  role: 'ADMIN' | 'MANAGER' | 'OCCUPANT' | 'TECHNICIAN'
}
```

### Bâtiment
```typescript
{
  id: number,
  nom: string,
  adresse: string,
  objectif: string,
  gestionnaireId?: number
}
```

### Capteur
```typescript
{
  idcapteur: number,
  debit: number,
  etat: boolean,
  batterie: number,
  batimentId: number,
  administrateurId: number
}
```

### Alerte
```typescript
{
  idalerte: number,
  typeAlerte: string,
  date: string,
  message: string,
  time: string,
  capteurId?: number,
  gestionnaireId?: number,
  occupantId?: number,
  technicienId?: number
}
```

## ⚠️ Important

- L'URL de base est `http://localhost:8081/api`
- Le token JWT est automatiquement ajouté depuis `localStorage.getItem('token')`
- Tous les appels retournent des Promises, utilisez `async/await` ou `.then()`
- En cas d'erreur, une exception est levée, utilisez `try/catch`

## 🚀 Prochaines étapes

1. Modifier chaque composant pour utiliser l'API
2. Tester chaque bouton avec le backend
3. Gérer les erreurs et les états de chargement
4. Ajouter des notifications de succès/erreur

