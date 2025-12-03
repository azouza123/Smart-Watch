package com.exemple.SmartWatch_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "capteur")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Capteur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ex: SEN-001
    @Column(nullable = false, unique = true)
    private String reference;

    // ex: "Campus A - Bâtiment Nord"
    private String emplacement;

    @Enumerated(EnumType.STRING)
    private TypeCapteur type;

    @ManyToOne
    @JoinColumn(name = "batiment_id")
    private Batiment batiment;

    // Pour coller au front
    private String zone;       // "Bâtiment Nord"
    private String logement;   // "A101"

    // Batterie en %
    private Double batterie;

    // Débit actuel (L/min, m³/h, à toi de décider)
    private Double debitActuel;

    // true = en ligne, false = hors ligne
    private Boolean actif;

    // dernière date/heure d'une donnée reçue
    private LocalDateTime derniereDonnee;
}
