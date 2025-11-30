-- =====================================================
-- Script SQL pour créer toutes les tables de smartwatch_db
-- Base de données: smartwatch_db
-- =====================================================

-- Créer la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS smartwatch_db;
USE smartwatch_db;

-- =====================================================
-- TABLES UTILISATEURS (Héritage JOINED)
-- =====================================================

-- Table principale utilisateur
CREATE TABLE IF NOT EXISTS utilisateur (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255),
    prenom VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255),
    role VARCHAR(50) -- ADMIN, MANAGER, OCCUPANT, TECHNICIAN
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tables spécialisées (héritage JOINED)
CREATE TABLE IF NOT EXISTS administrateur (
    id BIGINT PRIMARY KEY,
    FOREIGN KEY (id) REFERENCES utilisateur(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS gestionnaire (
    id BIGINT PRIMARY KEY,
    FOREIGN KEY (id) REFERENCES utilisateur(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS occupant (
    id BIGINT PRIMARY KEY,
    FOREIGN KEY (id) REFERENCES utilisateur(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS technicien (
    id BIGINT PRIMARY KEY,
    FOREIGN KEY (id) REFERENCES utilisateur(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TABLES BÂTIMENTS (Héritage JOINED)
-- =====================================================

-- Table principale batiment
CREATE TABLE IF NOT EXISTS batiment (
    idbatiment BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom_bat VARCHAR(255),
    adresse VARCHAR(500),
    objectif VARCHAR(500),
    nbre_de_capteurs INT DEFAULT 0,
    gestionnaire_id BIGINT,
    FOREIGN KEY (gestionnaire_id) REFERENCES gestionnaire(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tables spécialisées (héritage JOINED)
CREATE TABLE IF NOT EXISTS campus (
    idbatiment BIGINT PRIMARY KEY,
    FOREIGN KEY (idbatiment) REFERENCES batiment(idbatiment) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS immeuble (
    idbatiment BIGINT PRIMARY KEY,
    FOREIGN KEY (idbatiment) REFERENCES batiment(idbatiment) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS maison (
    idbatiment BIGINT PRIMARY KEY,
    FOREIGN KEY (idbatiment) REFERENCES batiment(idbatiment) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TABLE CAPTEUR
-- =====================================================

CREATE TABLE IF NOT EXISTS capteur (
    idcapteur BIGINT AUTO_INCREMENT PRIMARY KEY,
    debit FLOAT,
    etat BOOLEAN DEFAULT TRUE,
    batterie FLOAT,
    batiment_id BIGINT,
    administrateur_id BIGINT,
    FOREIGN KEY (batiment_id) REFERENCES batiment(idbatiment) ON DELETE CASCADE,
    FOREIGN KEY (administrateur_id) REFERENCES administrateur(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TABLE ALERTE
-- =====================================================

CREATE TABLE IF NOT EXISTS alerte (
    idalerte BIGINT AUTO_INCREMENT PRIMARY KEY,
    type_alerte VARCHAR(255),
    date DATE,
    message TEXT,
    time VARCHAR(50),
    capteur_id BIGINT,
    gestionnaire_id BIGINT,
    occupant_id BIGINT,
    technicien_id BIGINT,
    FOREIGN KEY (capteur_id) REFERENCES capteur(idcapteur) ON DELETE CASCADE,
    FOREIGN KEY (gestionnaire_id) REFERENCES gestionnaire(id) ON DELETE SET NULL,
    FOREIGN KEY (occupant_id) REFERENCES occupant(id) ON DELETE SET NULL,
    FOREIGN KEY (technicien_id) REFERENCES technicien(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TABLE CONSUMPTION
-- =====================================================

CREATE TABLE IF NOT EXISTS consumption (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50), -- ELECTRICITY, WATER, GAS
    value DOUBLE,
    timestamp DATETIME,
    batiment_id BIGINT,
    FOREIGN KEY (batiment_id) REFERENCES batiment(idbatiment) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TABLE SENSOR_DATA
-- =====================================================

CREATE TABLE IF NOT EXISTS sensor_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50), -- TEMPERATURE, HUMIDITY, CO2, MOVEMENT
    value DOUBLE,
    timestamp DATETIME,
    batiment_id BIGINT,
    FOREIGN KEY (batiment_id) REFERENCES batiment(idbatiment) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TABLE ALERT (si elle existe encore)
-- =====================================================

CREATE TABLE IF NOT EXISTS alert (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    message TEXT,
    severity VARCHAR(50), -- INFO, WARNING, CRITICAL
    timestamp DATETIME,
    resolved BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- INDEX pour améliorer les performances
-- =====================================================

-- Index sur les emails
CREATE INDEX idx_utilisateur_email ON utilisateur(email);

-- Index sur les rôles
CREATE INDEX idx_utilisateur_role ON utilisateur(role);

-- Index sur les dates
CREATE INDEX idx_alerte_date ON alerte(date);
CREATE INDEX idx_consumption_timestamp ON consumption(timestamp);
CREATE INDEX idx_sensor_data_timestamp ON sensor_data(timestamp);

-- Index sur les relations
CREATE INDEX idx_capteur_batiment ON capteur(batiment_id);
CREATE INDEX idx_capteur_administrateur ON capteur(administrateur_id);
CREATE INDEX idx_alerte_capteur ON alerte(capteur_id);
CREATE INDEX idx_alerte_gestionnaire ON alerte(gestionnaire_id);
CREATE INDEX idx_alerte_occupant ON alerte(occupant_id);
CREATE INDEX idx_alerte_technicien ON alerte(technicien_id);
CREATE INDEX idx_consumption_batiment ON consumption(batiment_id);
CREATE INDEX idx_sensor_data_batiment ON sensor_data(batiment_id);
CREATE INDEX idx_batiment_gestionnaire ON batiment(gestionnaire_id);

-- =====================================================
-- DONNÉES DE TEST (optionnel)
-- =====================================================

-- Insérer un administrateur de test
INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, role) 
VALUES ('Admin', 'Principal', 'admin@smartwatch.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN')
ON DUPLICATE KEY UPDATE email=email;

INSERT INTO administrateur (id) 
SELECT id FROM utilisateur WHERE email = 'admin@smartwatch.com' AND role = 'ADMIN'
ON DUPLICATE KEY UPDATE id=id;

-- Insérer un gestionnaire de test
INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, role) 
VALUES ('Gestionnaire', 'Test', 'manager@smartwatch.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'MANAGER')
ON DUPLICATE KEY UPDATE email=email;

INSERT INTO gestionnaire (id) 
SELECT id FROM utilisateur WHERE email = 'manager@smartwatch.com' AND role = 'MANAGER'
ON DUPLICATE KEY UPDATE id=id;

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================

