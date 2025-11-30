package com.exemple.SmartWatch_backend.repository;

import com.exemple.SmartWatch_backend.entity.Technicien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TechnicienRepository extends JpaRepository<Technicien, Long> {
}

