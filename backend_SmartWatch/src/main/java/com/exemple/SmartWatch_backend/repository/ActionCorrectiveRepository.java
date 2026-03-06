package com.exemple.SmartWatch_backend.repository;

import com.exemple.SmartWatch_backend.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ActionCorrectiveRepository extends JpaRepository<ActionCorrective, Long> {
    List<ActionCorrective> findByStatus(StatutAction status);
    long countByStatus(StatutAction status);
}