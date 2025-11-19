# 📘 Guide de l'Interface Gestionnaire - SmartWater

## 🎯 Vue d'ensemble

L'interface **Gestionnaire / Facility Manager** est conçue pour les responsables de sites qui supervisent la consommation d'eau d'un ou plusieurs bâtiments. C'est le rôle central de pilotage opérationnel de la plateforme.

### Accès à l'interface
- **Connexion** : Page de login → Bouton "Gestionnaire" ou email contenant "manager"
- **Couleur distinctive** : Bleu (pour différencier des autres rôles)

---

## 🗂️ Structure de navigation

L'interface comporte **5 sections principales** accessibles via la barre latérale :

```
📊 Tableau de bord      → Vue synthétique globale
🔔 Alertes             → Gestion des anomalies
📋 Actions correctives → Suivi des interventions
🏢 Détails bâtiments   → Analyse par bâtiment
📄 Rapports            → Exports et reporting
```

---

## 1️⃣ Tableau de bord (ManagerDashboard)

### 🎯 Objectif
Avoir une vue d'ensemble rapide de la consommation et des alertes du périmètre géré.

### 📍 Composants principaux

#### A. En-tête avec contrôles
- **Sélecteur de périmètre** (dropdown)
  - Tous les sites
  - Campus A
  - Campus B
  - Résidence C
  - 💡 *Permet de filtrer toutes les données affichées*

- **Sélecteur de période** (boutons)
  - Jour
  - Semaine
  - Mois
  - 💡 *Change les graphiques et statistiques*

#### B. Cartes statistiques (4 KPI)
1. **Consommation actuelle**
   - Volume total de la période
   - Tendance (↗️ ou ↘️) vs période précédente
   - Exemple : `1,680 L` avec `-12.5% ↘️`

2. **Moyenne historique**
   - Référence pour comparer
   - Exemple : `1,920 L`

3. **Objectif**
   - Cible définie pour la période
   - Progression en %
   - Exemple : `1,400 L` → 120% atteint

4. **Score d'efficacité**
   - Note globale sur 100
   - Barre de progression visuelle
   - Exemple : `87%`

#### C. Panel d'alertes
Liste des **3 alertes récentes** :
- 🟠 Surconsommation détectée (avec lieu et heure)
- 🔵 Objectif hebdomadaire en vue
- 🟢 Économie réalisée

**Actions possibles** :
- Voir tout → Redirige vers la page Alertes
- Cliquer sur une alerte pour plus de détails

#### D. Graphiques de consommation

**Graphique 1 : Évolution de la consommation**
- Courbe de consommation réelle (bleu)
- Courbe d'objectif (vert, pointillés)
- Axe X : Temps (heures/jours/semaines selon période)
- Axe Y : Volume en litres

**Graphique 2 : Consommation par zone**
- Barres comparatives :
  - Période actuelle (bleu)
  - Période précédente (gris)
- Zones : Cuisine, Salle de bain, Toilettes, Jardin
- 💡 *Identifie où agir en priorité*

#### E. Module de prédiction
- **Tendance hebdomadaire** : +5% prévu
- **Pic prévu** : Samedi 275L
- **Action recommandée** : Réduire weekend

**Graphique prédictif** :
- Points bleus : Données réelles (Lun-Ven)
- Points violets : Prédiction (Sam-Mar)
- Ligne verticale : Séparation présent/futur

**Analyse intelligente** :
> "L'algorithme détecte une augmentation de 5% pendant le weekend. Pour atteindre votre objectif mensuel, réduire de 25L/jour pendant le weekend."

---

## 2️⃣ Gestion des Alertes (AlertsManagement)

### 🎯 Objectif
Centraliser toutes les anomalies détectées et piloter leur résolution.

### 📊 Statistiques en haut de page
- **Total alertes (7j)** : Nombre global
- **Ouvertes** 🔴 : Non traitées
- **En cours** 🟡 : Assignées en cours de résolution
- **Résolues** 🟢 : Clôturées

### 🔍 Filtres rapides
4 boutons pour filtrer :
- **Toutes** : Vue complète
- **Ouvertes** : Nécessitent action immédiate
- **En cours** : Interventions en cours
- **Résolues** : Historique des résolutions

### 📋 Liste des alertes (colonne gauche)

Chaque carte d'alerte affiche :
- **Icône de sévérité** 
  - 🔴 Critique (rouge)
  - 🟠 Élevée (orange)
  - 🟡 Moyenne (jaune)

- **Badge de statut**
  - 🔴 Ouverte
  - 🟡 En cours
  - 🟢 Résolue

- **Informations clés**
  - Titre : "Surconsommation détectée - Bâtiment Nord"
  - Localisation : 📍 Campus A › Bâtiment Nord › A103
  - Horodatage : 🕐 2025-10-31 08:30
  - Assignation : 👤 Technicien Martin (si assignée)

**Interaction** :
- Cliquer sur une alerte → Affiche détails à droite
- Alerte sélectionnée → Bordure bleue

### 📄 Détail de l'alerte (colonne droite)

#### En-tête
- Titre complet
- Localisation hiérarchique (Building › Zone › Unit)
- Bouton ❌ pour fermer

#### Graphique d'événement
- **Courbe temporelle** autour du déclenchement
- **Ligne rouge pointillée** = Seuil configuré
- Points de données avec timestamp
- 💡 *Visualise le moment exact du dépassement*

#### Informations détaillées
Deux blocs :
- **Seuil configuré** : Valeur normale (ex: 45 L/h)
- **Valeur détectée** : Valeur anormale (ex: 68 L/h) en rouge

#### Actions disponibles

**Boutons d'action** :
1. **Assigner à...** (dropdown)
   - Technicien Martin
   - Technicien Dupont
   - 💡 *Délègue l'intervention*

2. **Marquer en cours** (bouton orange)
   - Change le statut
   - Indique qu'une action est lancée

3. **Résoudre** (bouton vert)
   - Clôture l'alerte
   - Demande confirmation

#### Notes et historique

**Notes existantes** (bulle bleue) :
```
👤 Gestionnaire
🕐 08:45
"Technicien assigné pour intervention"
```

**Ajouter une note** :
- Champ texte : "Ajouter une note..."
- Bouton "Ajouter"
- 💡 *Permet la communication entre équipes*

### 💡 Workflow typique
```
1. Alerte détectée automatiquement
2. Gestionnaire consulte les détails
3. Assigne à un technicien
4. Marque "En cours"
5. Technicien intervient et ajoute une note
6. Gestionnaire vérifie et marque "Résolue"
```

---

## 3️⃣ Actions Correctives (ActionsManagement)

### 🎯 Objectif
Planifier et suivre toutes les interventions (techniques et organisationnelles).

### 📊 Statistiques
- **En cours** 🟡 : Actions démarrées
- **Planifiées** 🔵 : À venir
- **Complétées (7j)** 🟢 : Historique récent

### 📋 Liste des actions

Chaque carte affiche :

#### Informations principales
- **Icône** : 📋 ClipboardList
- **Titre** : "Intervention fuite - A201"
- **Badges** :
  - Statut : Terminée / En cours / Planifiée
  - Priorité : 🔴 Haute / 🟡 Moyenne / ⚪ Basse

#### Détails
- **Type** : Maintenance ou Sensibilisation
- **Assigné à** : 👤 Technicien Martin
- **Échéance** : 📅 2025-11-01

#### Alertes liées
Si l'action est liée à une alerte :
```
⚠️ 1 alerte(s) liée(s)
```

#### Actions possibles
- **Détails** : Voir le descriptif complet
- **Modifier** : Changer assignation, échéance, etc.

### 💡 Types d'actions

**Maintenance** :
- Réparation de fuite
- Remplacement de capteur
- Calibration équipement

**Sensibilisation** :
- Campagne d'information
- Formation éco-gestes
- Affichage conseils

### 🆕 Nouvelle action
Bouton en haut à droite pour créer :
- Type d'action
- Priorité
- Assignation
- Échéance
- Description

---

## 4️⃣ Détails Bâtiments (BuildingDetailsView)

### 🎯 Objectif
Analyse approfondie de la consommation d'un bâtiment spécifique.

### 🏢 En-tête bâtiment
- **Nom** : Campus A
- **Adresse** : 📍 123 Rue de la République, Paris 75001

### 📊 Statistiques du bâtiment

4 indicateurs :
1. **Zones** : Nombre de zones (ex: 4)
2. **Logements** : Nombre d'unités (ex: 450)
3. **Capteurs** : Total installés (ex: 68)
4. **Économie** : -12% vs mois dernier (vert)

### 📊 Graphique par zone

**Graphique en barres** :
- Axe X : Nom des zones (Bâtiment Nord, Sud, Est, Ouest)
- Axe Y : Consommation en litres
- Barres bleues proportionnelles
- 💡 *Compare les performances entre zones*

### 📋 Tableau détaillé des zones

Colonnes :
1. **Zone** : Nom
2. **Logements** : Nombre d'unités
3. **Consommation** : Volume total
4. **Efficacité** : Score en %
   - Barre de progression visuelle
   - Couleur verte selon performance

**Interaction** :
- Survol ligne → Fond gris clair
- 💡 *Identifie zones à améliorer*

### 💡 Cas d'usage
- Comparer performance entre bâtiments
- Identifier zones problématiques
- Préparer rapports pour direction
- Planifier actions ciblées

---

## 5️⃣ Rapports et Exports (ReportsView)

### 🎯 Objectif
Générer et télécharger des rapports pour la direction, les audits ou l'archivage.

### 🆕 Génération rapide

3 modèles prédéfinis :

#### 1. Rapport mensuel 📄
- Synthèse complète du mois
- Graphiques de tendances
- Alertes du mois
- Économies réalisées

#### 2. Analyse économies 📈
- Comparaison N vs N-1
- ROI des actions
- Projection annuelle
- Recommandations

#### 3. Export données 💾
- Format CSV personnalisé
- Période sélectionnable
- Données brutes pour analyse externe
- Compatible Excel/BI tools

**Interaction** : Cliquer sur une carte → Formulaire de configuration

### 📚 Rapports disponibles

Liste des rapports générés avec :
- **Icône** : 📄 FileText
- **Titre** : "Rapport mensuel - Octobre 2025"
- **Métadonnées** :
  - 📅 Date : 2025-10-31
  - 💾 Taille : 2.4 MB
  - 📎 Format : PDF ou CSV

**Bouton téléchargement** : ⬇️ Télécharger

### 💡 Exemples de rapports
1. **Rapport mensuel** : Vue d'ensemble pour comité de direction
2. **Analyse trimestrielle** : Bilan détaillé Q3 2025
3. **Export données brutes** : Pour analyse personnalisée
4. **Rapport économies** : ROI et impact environnemental

---

## 🎨 Design et ergonomie

### Palette de couleurs
- **Principal** : Bleu (#3b82f6)
- **Succès** : Vert (#10b981)
- **Alerte** : Amber (#f59e0b)
- **Danger** : Rouge (#ef4444)
- **Neutre** : Gris (#6b7280)

### Composants visuels

#### Cartes (Cards)
- Fond blanc
- Bordure grise légère
- Ombre subtile
- Coins arrondis (16px)

#### Badges de statut
- Pills arrondis
- Couleur selon contexte
- Texte court et clair

#### Graphiques
- Recharts library
- Tooltips interactifs
- Couleurs cohérentes
- Grille discrète

---

## 🔄 Flux de travail typique du Gestionnaire

### Journée type

**Matin (9h00)** :
```
1. Connexion → Tableau de bord
2. Check KPI globaux
3. Consulter nouvelles alertes (badge rouge)
4. Prioriser les alertes critiques
```

**Traitement alertes (9h15)** :
```
5. Ouvrir "Alertes"
6. Filtrer "Ouvertes"
7. Sélectionner alerte critique (fuite)
8. Analyser graphique événement
9. Assigner à technicien
10. Marquer "En cours"
11. Ajouter note : "Intervention urgente demandée"
```

**Suivi actions (10h00)** :
```
12. Ouvrir "Actions correctives"
13. Vérifier progression "En cours"
14. Contacter technicien si retard
15. Marquer actions terminées
```

**Analyse (14h00)** :
```
16. Ouvrir "Détails bâtiments"
17. Comparer zones Campus A
18. Identifier Bâtiment Nord surconsommateur
19. Planifier action sensibilisation
```

**Fin de semaine (Vendredi 16h)** :
```
20. Ouvrir "Rapports"
21. Générer rapport hebdomadaire
22. Télécharger PDF
23. Envoyer à direction
```

---

## 🎯 Points clés à retenir

### Ce que le Gestionnaire PEUT faire :
✅ Surveiller consommation globale et par bâtiment  
✅ Recevoir et gérer les alertes automatiques  
✅ Assigner des techniciens aux interventions  
✅ Suivre les actions correctives  
✅ Générer des rapports pour la direction  
✅ Analyser les tendances et prédictions  
✅ Comparer les performances entre zones  

### Ce que le Gestionnaire NE PEUT PAS faire :
❌ Modifier la configuration système (Admin)  
❌ Ajouter/supprimer des bâtiments (Admin)  
❌ Installer des capteurs physiquement (Technicien)  
❌ Voir la consommation individuelle des occupants (Privacy)  

---

## 🚀 Conseils d'utilisation avancée

### 1. Définir des objectifs réalistes
- Analyser l'historique (6 mois minimum)
- Fixer objectif progressif (-5% puis -10%)
- Communiquer clairement aux occupants

### 2. Optimiser la gestion des alertes
- Traiter les critiques en < 2h
- Assigner rapidement (ne pas laisser en "Ouverte")
- Ajouter des notes détaillées pour traçabilité

### 3. Prioriser les actions
- Focus sur zones à fort impact (Bâtiment Nord = 3800L)
- ROI rapide : fuites > sensibilisation
- Planifier maintenance préventive

### 4. Exploiter les prédictions
- Anticiper pics (weekend, événements)
- Ajuster objectifs si tendance négative
- Communiquer prévisions aux équipes

### 5. Reporting efficace
- Export hebdomadaire pour suivi direction
- Export mensuel pour comité exécutif
- Export CSV pour analyses personnalisées

---

## 📱 Responsive Design

L'interface s'adapte aux écrans :
- **Desktop** (>1024px) : Toutes fonctionnalités
- **Tablette** (768-1024px) : Colonnes empilées
- **Mobile** (< 768px) : Navigation condensée

💡 *Recommandé : Utiliser desktop pour gestion complète*

---

## 🔐 Sécurité et permissions

Le Gestionnaire a accès :
- ✅ Données de son périmètre uniquement
- ✅ Alertes de ses bâtiments
- ✅ Actions qu'il a créées/assignées
- ✅ Rapports de son scope

Pas d'accès :
- ❌ Configuration globale
- ❌ Autres gestionnaires
- ❌ Données personnelles occupants (anonymisées)

---

## ❓ FAQ Gestionnaire

**Q: Comment savoir si une alerte est vraiment urgente ?**  
R: Regardez la couleur et le type :
- 🔴 Critique (fuite) → Immédiat
- 🟠 Urgent (surconso 2x) → < 2h
- 🟡 Moyen → < 24h

**Q: Puis-je modifier un objectif en cours de mois ?**  
R: Non, seul l'Admin peut. Contactez-le si nécessaire.

**Q: Comment motiver les occupants à économiser ?**  
R: Utilisez les rapports pour :
- Communiquer économies réalisées
- Partager classement anonyme
- Organiser challenges inter-bâtiments

**Q: Une alerte semble fausse, que faire ?**  
R: 
1. Vérifier le graphique (pic isolé ?)
2. Ajouter note "Faux positif à vérifier"
3. Assigner technicien pour diagnostic
4. Informer Admin si règle à ajuster

**Q: Comment exporter pour Excel ?**  
R: Rapports → Export CSV → Ouvrir dans Excel

---

## 🆘 Support

En cas de problème :
1. Vérifier connexion réseau
2. Rafraîchir page (F5)
3. Contacter Admin système
4. Consulter logs d'erreur (console navigateur)

---

## 📚 Ressources complémentaires

- Guide Administrateur : Configuration système
- Guide Technicien : Maintenance capteurs
- Guide Occupant : Utilisation occupant
- API Documentation : Intégrations externes

---

**Version** : 1.0.0  
**Dernière mise à jour** : Novembre 2025  
**Contact** : support@smartwater.com
