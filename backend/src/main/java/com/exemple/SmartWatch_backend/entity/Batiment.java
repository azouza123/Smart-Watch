package com.exemple.SmartWatch_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "batiment")
@Inheritance(strategy = InheritanceType.JOINED)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Batiment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idbatiment;

    @Column(name = "nom_bat")
    private String nombat;
    
    private String adresse;
    private String objectif;

    @Column(name = "nbre_de_capteurs")
    private Integer nbreDeCapteurs;

    // Relationships
    @ManyToOne
    @JoinColumn(name = "gestionnaire_id")
    private Gestionnaire gestionnaire;

    // Getters/Setters pour compatibilité avec le service existant
    public Long getId() {
        return idbatiment;
    }

    public void setId(Long id) {
        this.idbatiment = id;
    }

    public String getNom() {
        return nombat;
    }

    public void setNom(String nom) {
        this.nombat = nom;
    }

    public TypeBatiment getType() {
        // Déterminer le type selon la classe réelle
        if (this instanceof Campus) {
            return TypeBatiment.CAMPUS;
        } else if (this instanceof Immeuble) {
            return TypeBatiment.IMMEUBLE;
        } else if (this instanceof Maison) {
            return TypeBatiment.MAISON;
        }
        return null;
    }

    public void setType(TypeBatiment type) {
        // Le type est déterminé par la classe, pas besoin de setter
    }
}
