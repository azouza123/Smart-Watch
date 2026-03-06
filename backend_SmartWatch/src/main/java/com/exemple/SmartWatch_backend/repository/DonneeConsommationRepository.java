package com.exemple.SmartWatch_backend.repository;

import com.exemple.SmartWatch_backend.entity.DonneeConsommation;
import com.exemple.SmartWatch_backend.entity.PeriodeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface DonneeConsommationRepository extends JpaRepository<DonneeConsommation, Long> {

    List<DonneeConsommation> findByCapteurIdOrderByTimestampAsc(Long capteurId);

    List<DonneeConsommation> findByBatimentIdOrderByTimestampAsc(Long batimentId);

    List<DonneeConsommation> findByTimestampBetweenOrderByTimestampAsc(
            LocalDateTime start, LocalDateTime end
    );

    List<DonneeConsommation> findByBatimentIdAndTimestampBetweenOrderByTimestampAsc(
            Long batimentId, LocalDateTime start, LocalDateTime end
    );

    @Query("SELECT d.zone, SUM(d.valeur) FROM DonneeConsommation d " +
            "WHERE d.timestamp BETWEEN :start AND :end " +
            "GROUP BY d.zone")
    List<Object[]> sumByZoneBetween(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query("SELECT d.zone, SUM(d.valeur) FROM DonneeConsommation d " +
            "WHERE d.batiment.id = :batimentId " +
            "AND d.timestamp BETWEEN :start AND :end " +
            "GROUP BY d.zone")
    List<Object[]> sumByZoneAndBatimentBetween(
            @Param("batimentId") Long batimentId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}