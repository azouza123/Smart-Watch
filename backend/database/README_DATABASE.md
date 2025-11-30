# Guide de création de la base de données

## 📋 Tables à créer dans MySQL

### Option 1 : Création automatique par Hibernate (Recommandé)

Hibernate créera automatiquement les tables au démarrage de l'application Spring Boot grâce à la configuration :

```properties
spring.jpa.hibernate.ddl-auto=update
```

**Avantages :**
- ✅ Création automatique
- ✅ Mise à jour automatique des schémas
- ✅ Pas besoin de script manuel

**Inconvénients :**
- ⚠️ Peut modifier les tables existantes
- ⚠️ Ne crée pas les index optimisés

### Option 2 : Création manuelle avec le script SQL

Si vous préférez créer les tables manuellement :

1. **Ouvrir phpMyAdmin ou MySQL Workbench**
2. **Exécuter le script** `create_tables.sql`
3. **Changer la configuration** dans `application.properties` :

```properties
spring.jpa.hibernate.ddl-auto=validate  # Au lieu de "update"
```

## 📊 Liste des tables

### Tables principales

1. **utilisateur** - Table principale pour tous les utilisateurs
2. **administrateur** - Table spécialisée (hérite de utilisateur)
3. **gestionnaire** - Table spécialisée (hérite de utilisateur)
4. **occupant** - Table spécialisée (hérite de utilisateur)
5. **technicien** - Table spécialisée (hérite de utilisateur)

6. **batiment** - Table principale pour tous les bâtiments
7. **campus** - Table spécialisée (hérite de batiment)
8. **immeuble** - Table spécialisée (hérite de batiment)
9. **maison** - Table spécialisée (hérite de batiment)

10. **capteur** - Capteurs de mesure
11. **alerte** - Alertes système
12. **consumption** - Consommations enregistrées
13. **sensor_data** - Données des capteurs
14. **alert** - Ancienne table d'alertes (si nécessaire)

## 🔗 Relations entre tables

```
utilisateur (1) ──< (N) administrateur
utilisateur (1) ──< (N) gestionnaire
utilisateur (1) ──< (N) occupant
utilisateur (1) ──< (N) technicien

batiment (1) ──< (N) campus
batiment (1) ──< (N) immeuble
batiment (1) ──< (N) maison

gestionnaire (1) ──< (N) batiment
batiment (1) ──< (N) capteur
administrateur (1) ──< (N) capteur
capteur (1) ──< (N) alerte
gestionnaire (1) ──< (N) alerte
occupant (1) ──< (N) alerte
technicien (1) ──< (N) alerte
batiment (1) ──< (N) consumption
batiment (1) ──< (N) sensor_data
```

## 📝 Structure des tables principales

### utilisateur
- `id` (BIGINT, PK, AUTO_INCREMENT)
- `nom` (VARCHAR)
- `prenom` (VARCHAR)
- `email` (VARCHAR, UNIQUE, NOT NULL)
- `mot_de_passe` (VARCHAR)
- `role` (VARCHAR) - ADMIN, MANAGER, OCCUPANT, TECHNICIAN

### batiment
- `idbatiment` (BIGINT, PK, AUTO_INCREMENT)
- `nom_bat` (VARCHAR)
- `adresse` (VARCHAR)
- `objectif` (VARCHAR)
- `nbre_de_capteurs` (INT)
- `gestionnaire_id` (BIGINT, FK → gestionnaire.id)

### capteur
- `idcapteur` (BIGINT, PK, AUTO_INCREMENT)
- `debit` (FLOAT)
- `etat` (BOOLEAN)
- `batterie` (FLOAT)
- `batiment_id` (BIGINT, FK → batiment.idbatiment)
- `administrateur_id` (BIGINT, FK → administrateur.id)

### alerte
- `idalerte` (BIGINT, PK, AUTO_INCREMENT)
- `type_alerte` (VARCHAR)
- `date` (DATE)
- `message` (TEXT)
- `time` (VARCHAR)
- `capteur_id` (BIGINT, FK → capteur.idcapteur)
- `gestionnaire_id` (BIGINT, FK → gestionnaire.id)
- `occupant_id` (BIGINT, FK → occupant.id)
- `technicien_id` (BIGINT, FK → technicien.id)

## 🚀 Instructions d'installation

### Méthode 1 : Automatique (Hibernate)

1. Assurez-vous que MySQL est démarré
2. Créez la base de données : `CREATE DATABASE smartwatch_db;`
3. Vérifiez les paramètres dans `application.properties`
4. Démarrez l'application Spring Boot
5. Hibernate créera automatiquement toutes les tables

### Méthode 2 : Manuelle (Script SQL)

1. Ouvrez phpMyAdmin ou MySQL Workbench
2. Connectez-vous à MySQL
3. Exécutez le script `create_tables.sql`
4. Vérifiez que toutes les tables sont créées
5. Changez `ddl-auto=validate` dans `application.properties`

## ✅ Vérification

Pour vérifier que tout est correct :

```sql
USE smartwatch_db;
SHOW TABLES;

-- Vérifier les tables principales
SELECT COUNT(*) FROM utilisateur;
SELECT COUNT(*) FROM batiment;
SELECT COUNT(*) FROM capteur;
SELECT COUNT(*) FROM alerte;
```

## 🔧 Maintenance

### Réinitialiser la base de données

```sql
DROP DATABASE IF EXISTS smartwatch_db;
CREATE DATABASE smartwatch_db;
-- Puis réexécuter create_tables.sql
```

### Sauvegarder la base de données

```bash
mysqldump -u root -p smartwatch_db > backup.sql
```

### Restaurer la base de données

```bash
mysql -u root -p smartwatch_db < backup.sql
```

## 📌 Notes importantes

- Les mots de passe dans le script sont hashés avec BCrypt (exemple : `$2a$10$...`)
- Les relations utilisent `ON DELETE CASCADE` ou `ON DELETE SET NULL` selon le cas
- Les index sont créés pour améliorer les performances des requêtes
- Le charset utilisé est `utf8mb4` pour supporter les caractères spéciaux

