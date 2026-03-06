package com.exemple.SmartWatch_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "alerte")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Alerte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Enumerated(EnumType.STRING)
    private TypeAlerte type;

    @Enumerated(EnumType.STRING)
    private SeveriteAlerte severity;

    @Enumerated(EnumType.STRING)
    private StatutAlerte status;

    @ManyToOne
    @JoinColumn(name = "batiment_id")
    private Batiment batiment;

    @ManyToOne
    @JoinColumn(name = "capteur_id")
    private Capteur capteur;

    private String zone;
    private String unit;

    private Double threshold;
    private Double actual;

    private String assignee;

    private LocalDateTime triggeredAt;

    @ElementCollection
    @CollectionTable(name = "alerte_notes", joinColumns = @JoinColumn(name = "alerte_id"))
    @Builder.Default
    private List<AlerteNote> notes = new ArrayList<>();

    // ✅ NEW — time-series readings for chart
    @OneToMany(mappedBy = "alerte", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<AlerteReading> readings = new ArrayList<>();
}