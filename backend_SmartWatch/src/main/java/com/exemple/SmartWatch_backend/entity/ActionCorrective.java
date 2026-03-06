package com.exemple.SmartWatch_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "action_corrective")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActionCorrective {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Enumerated(EnumType.STRING)
    private TypeAction type;

    @Enumerated(EnumType.STRING)
    private StatutAction status;

    @Enumerated(EnumType.STRING)
    private PrioriteAction priority;

    private String assignee;
    private LocalDate dueDate;
    private Integer relatedAlerts;

    @Column(columnDefinition = "TEXT")
    private String description;
}