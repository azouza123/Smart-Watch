package com.exemple.SmartWatch_backend.repository;

import com.exemple.SmartWatch_backend.entity.Alerte;
import com.exemple.SmartWatch_backend.entity.StatutAlerte;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlerteRepository extends JpaRepository<Alerte, Long> {
    List<Alerte> findByStatus(StatutAlerte status);
    long countByStatus(StatutAlerte status);
}