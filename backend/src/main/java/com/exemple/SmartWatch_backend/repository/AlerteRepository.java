package com.exemple.SmartWatch_backend.repository;

import com.exemple.SmartWatch_backend.entity.Alerte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlerteRepository extends JpaRepository<Alerte, Long> {
    List<Alerte> findByGestionnaireId(Long gestionnaireId);
    List<Alerte> findByOccupantId(Long occupantId);
    List<Alerte> findByTechnicienId(Long technicienId);
    List<Alerte> findByCapteurId(Long capteurId);
}

