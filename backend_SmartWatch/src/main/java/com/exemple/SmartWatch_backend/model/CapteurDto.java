package com.exemple.SmartWatch_backend.model;

import com.exemple.SmartWatch_backend.entity.TypeCapteur;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CapteurDto {

    private Long id;
    private String reference;
    private String emplacement;
    private TypeCapteur type;

    private Long batimentId;   // id du bâtiment

    private String zone;
    private String logement;

    private Double batterie;
    private Double debitActuel;
    private Boolean actif;

    private LocalDateTime derniereDonnee;
}
