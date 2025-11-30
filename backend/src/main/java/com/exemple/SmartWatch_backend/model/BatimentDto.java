package com.exemple.SmartWatch_backend.model;

import com.exemple.SmartWatch_backend.entity.TypeBatiment;
import lombok.Data;

@Data
public class BatimentDto {

    private Long id;
    private String nom;
    private String adresse;
    private TypeBatiment type;

    // On passe seulement l'id du gestionnaire
    private Long gestionnaireId;
}
