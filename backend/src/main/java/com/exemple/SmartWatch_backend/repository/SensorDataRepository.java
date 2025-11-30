package com.exemple.SmartWatch_backend.repository;

import com.exemple.SmartWatch_backend.entity.SensorData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SensorDataRepository extends JpaRepository<SensorData, Long> {
    List<SensorData> findTop10ByOrderByTimestampDesc();
}
