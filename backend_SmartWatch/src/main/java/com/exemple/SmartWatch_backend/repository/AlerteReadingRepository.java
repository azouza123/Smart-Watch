package com.exemple.SmartWatch_backend.repository;

import com.exemple.SmartWatch_backend.entity.AlerteReading;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AlerteReadingRepository extends JpaRepository<AlerteReading, Long> {
    List<AlerteReading> findByAlerteIdOrderByTimeAsc(Long alerteId);
}