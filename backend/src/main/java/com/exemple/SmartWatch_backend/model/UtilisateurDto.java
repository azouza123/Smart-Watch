package com.exemple.SmartWatch_backend.model;

import com.exemple.SmartWatch_backend.entity.Role;
import com.exemple.SmartWatch_backend.entity.StatutUtilisateur;
import lombok.Data;

@Data
public class UtilisateurDto {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String motDePasse;          // tu peux l’ignorer côté front
    private Role role;
    private StatutUtilisateur statut;   // 🔹 nouveau
}
