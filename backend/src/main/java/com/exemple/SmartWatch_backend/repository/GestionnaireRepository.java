package com.exemple.SmartWatch_backend.repository;

import com.exemple.SmartWatch_backend.entity.Gestionnaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GestionnaireRepository extends JpaRepository<Gestionnaire, Long> {
}

