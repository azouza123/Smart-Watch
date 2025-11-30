package com.exemple.SmartWatch_backend.model;

import lombok.Data;

@Data
public class AuthenticationRequest {
    private String email;
    private String motDePasse;
}
