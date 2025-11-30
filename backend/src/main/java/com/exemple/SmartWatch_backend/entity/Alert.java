package com.exemple.SmartWatch_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alert")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;

    @Enumerated(EnumType.STRING)
    private Severity severity;

    private LocalDateTime timestamp;

    private boolean resolved;

    public enum Severity {
        INFO,
        WARNING,
        CRITICAL
    }
}
