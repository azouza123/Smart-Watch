package com.exemple.SmartWatch_backend.model;

import com.exemple.SmartWatch_backend.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthenticationResponse {
    private String accessToken;
    private String refreshToken;
    private Role role;
    private String nom;
    private String prenom;
    private String email;
}