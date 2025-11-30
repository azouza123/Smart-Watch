package com.exemple.SmartWatch_backend.repository;

import com.exemple.SmartWatch_backend.entity.Occupant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OccupantRepository extends JpaRepository<Occupant, Long> {
}

