package com.exemple.SmartWatch_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sensor_data")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SensorData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private SensorType type;

    private Double value;

    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "batiment_id")
    private Batiment batiment;

    public enum SensorType {
        TEMPERATURE,
        HUMIDITY,
        CO2,
        MOVEMENT
    }
}
