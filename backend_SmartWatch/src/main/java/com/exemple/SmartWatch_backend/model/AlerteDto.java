package com.exemple.SmartWatch_backend.model;

import com.exemple.SmartWatch_backend.entity.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlerteDto {
    private Long id;
    private String title;
    private TypeAlerte type;
    private SeveriteAlerte severity;
    private StatutAlerte status;
    private Long batimentId;
    private String batimentNom;
    private Long capteurId;
    private String capteurReference;
    private String zone;
    private String unit;
    private Double threshold;
    private Double actual;
    private String assignee;
    private LocalDateTime triggeredAt;
    private List<AlerteNote> notes;
}