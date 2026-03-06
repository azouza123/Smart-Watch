package com.exemple.SmartWatch_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "objectif")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Objectif {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "utilisateur_id", unique = true)
    private Utilisateur utilisateur;

    private Integer objectifHebdo;
    private Integer objectifMensuel;
    private LocalDateTime updatedAt;
}