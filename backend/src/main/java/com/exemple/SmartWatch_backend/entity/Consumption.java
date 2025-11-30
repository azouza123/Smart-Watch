package com.exemple.SmartWatch_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "consumption")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Consumption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private ResourceType type;

    private Double value;

    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "batiment_id")
    private Batiment batiment;

    public enum ResourceType {
        ELECTRICITY,
        WATER,
        GAS
    }
}
