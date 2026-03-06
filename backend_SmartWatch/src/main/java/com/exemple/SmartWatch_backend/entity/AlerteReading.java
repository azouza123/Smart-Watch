package com.exemple.SmartWatch_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alerte_reading")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlerteReading {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "alerte_id")
    private Alerte alerte;

    private LocalDateTime time;
    private Double value;
}