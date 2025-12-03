package com.exemple.SmartWatch_backend.model;

import com.exemple.SmartWatch_backend.entity.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String nom;
    private String prenom;
    private String email;
    private String motDePasse;
    private Role role;
}
