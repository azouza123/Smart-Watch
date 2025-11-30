package com.exemple.SmartWatch_backend.repository;

import com.exemple.SmartWatch_backend.entity.Capteur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CapteurRepository extends JpaRepository<Capteur, Long> {
    List<Capteur> findByBatimentId(Long batimentId);
    List<Capteur> findByEtat(Boolean etat);
}

