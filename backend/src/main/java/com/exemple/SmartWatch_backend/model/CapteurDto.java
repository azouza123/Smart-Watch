package com.exemple.SmartWatch_backend.model;

import lombok.Data;

@Data
public class CapteurDto {
    private Long idcapteur;
    private Float debit;
    private Boolean etat;
    private Float batterie;
    private Long batimentId;
    private Long administrateurId;
}

