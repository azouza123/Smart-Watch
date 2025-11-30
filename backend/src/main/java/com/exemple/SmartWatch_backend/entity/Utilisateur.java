package com.exemple.SmartWatch_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "utilisateur")
@Inheritance(strategy = InheritanceType.JOINED)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "mot_de_passe")
    private String motDePasse;

    @Enumerated(EnumType.STRING)
    private Role role;
}