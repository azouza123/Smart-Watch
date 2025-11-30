package com.exemple.SmartWatch_backend.repository;

import com.exemple.SmartWatch_backend.entity.Batiment;
import com.exemple.SmartWatch_backend.entity.Consumption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsumptionRepository extends JpaRepository<Consumption, Long> {
    List<Consumption> findTop10ByOrderByTimestampDesc();
    List<Consumption> findByBatiment(Batiment batiment);
}
