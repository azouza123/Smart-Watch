package com.exemple.SmartWatch_backend.model;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AlerteDto {
    private Long idalerte;
    private String typeAlerte;
    private LocalDate date;
    private String message;
    private String time;
    private Long capteurId;
    private Long gestionnaireId;
    private Long occupantId;
    private Long technicienId;
}

