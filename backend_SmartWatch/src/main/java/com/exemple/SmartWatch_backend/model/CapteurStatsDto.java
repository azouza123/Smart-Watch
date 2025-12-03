package com.exemple.SmartWatch_backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CapteurStatsDto {

    private long totalCapteurs;
    private long nbEnLigne;
    private long nbHorsLigne;
    private long nbBatterieFaible;
}
