package com.exemple.SmartWatch_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "capteur")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Capteur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idcapteur;

    private Float debit;

    private Boolean etat;

    private Float batterie;

    @ManyToOne
    @JoinColumn(name = "batiment_id")
    private Batiment batiment;

    @ManyToOne
    @JoinColumn(name = "administrateur_id")
    private Administrateur administrateur;
}
