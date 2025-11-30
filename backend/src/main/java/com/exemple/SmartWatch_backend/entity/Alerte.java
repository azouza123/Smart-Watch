package com.exemple.SmartWatch_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "alerte")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Alerte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idalerte;

    @Column(name = "type_alerte")
    private String typeAlerte;

    private LocalDate date;

    private String message;
    
    private String time;

    @ManyToOne
    @JoinColumn(name = "capteur_id")
    private Capteur capteur;

    @ManyToOne
    @JoinColumn(name = "gestionnaire_id")
    private Gestionnaire gestionnaire;

    @ManyToOne
    @JoinColumn(name = "occupant_id")
    private Occupant occupant;

    @ManyToOne
    @JoinColumn(name = "technicien_id")
    private Technicien technicien;
}
