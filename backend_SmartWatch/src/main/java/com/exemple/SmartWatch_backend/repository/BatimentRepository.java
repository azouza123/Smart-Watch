package com.exemple.SmartWatch_backend.repository;

import com.exemple.SmartWatch_backend.entity.Batiment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BatimentRepository extends JpaRepository<Batiment, Long> {
}
