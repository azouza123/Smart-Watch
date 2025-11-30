package com.exemple.SmartWatch_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "utilisateur")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "mot_de_passe", nullable = false)
    private String motDePasse;

    // ADMINISTRATEUR, GESTIONNAIRE, OCCUPANT, TECHNICIEN
    @Enumerated(EnumType.STRING)
    private Role role;
}