package com.exemple.SmartWatch_backend.repository;

import com.exemple.SmartWatch_backend.entity.Objectif;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ObjectifRepository extends JpaRepository<Objectif, Long> {
    Optional<Objectif> findByUtilisateurId(Long utilisateurId);
}