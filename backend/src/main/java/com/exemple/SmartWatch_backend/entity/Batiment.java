package com.exemple.SmartWatch_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "batiment")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Batiment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    private String adresse;

    @Enumerated(EnumType.STRING)
    private TypeBatiment type;

    // utilisateur (gestionnaire) qui gère ce bâtiment
    @ManyToOne
    @JoinColumn(name = "gestionnaire_id")
    private Utilisateur gestionnaire;
}
