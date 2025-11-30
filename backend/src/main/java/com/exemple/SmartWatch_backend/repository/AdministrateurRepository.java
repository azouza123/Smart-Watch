package com.exemple.SmartWatch_backend.repository;

import com.exemple.SmartWatch_backend.entity.Administrateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdministrateurRepository extends JpaRepository<Administrateur, Long> {
}

