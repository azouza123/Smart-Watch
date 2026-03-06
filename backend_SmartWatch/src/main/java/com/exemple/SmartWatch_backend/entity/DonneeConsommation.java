package com.exemple.SmartWatch_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "donnee_consommation")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonneeConsommation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "capteur_id")
    private Capteur capteur;

    @ManyToOne
    @JoinColumn(name = "batiment_id")
    private Batiment batiment;

    private LocalDateTime timestamp;
    private Double valeur; // litres
    private String zone;

    @Enumerated(EnumType.STRING)
    private
    PeriodeType periode; // DAY, WEEK, MONTH
}