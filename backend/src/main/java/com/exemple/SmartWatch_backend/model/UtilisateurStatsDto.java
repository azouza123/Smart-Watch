package com.exemple.SmartWatch_backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UtilisateurStatsDto {

    private long totalUtilisateurs;
    private long nbAdministrateurs;
    private long nbGestionnaires;
    private long nbOccupants;
    private long nbTechniciens;
}
