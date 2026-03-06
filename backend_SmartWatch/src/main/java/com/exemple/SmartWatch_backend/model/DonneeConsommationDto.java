package com.exemple.SmartWatch_backend.model;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DonneeConsommationDto {
    private Long id;
    private Long capteurId;
    private Long batimentId;
    private String batimentNom;
    private String zone;
    private LocalDateTime timestamp;
    private Double valeur;
    private String periode;
}