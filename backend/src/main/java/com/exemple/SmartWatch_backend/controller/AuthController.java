package com.exemple.SmartWatch_backend.controller;

import com.exemple.SmartWatch_backend.model.*;
import com.exemple.SmartWatch_backend.service.AuthService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public AuthenticationResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthenticationResponse login(@RequestBody AuthenticationRequest request) {
        return authService.authenticate(request);
    }

    @PostMapping("/refresh")
    public AuthenticationResponse refresh(@RequestBody RefreshTokenRequest request) {
        return authService.refresh(request.getRefreshToken());
    }
}

@Data
class RefreshTokenRequest {
    private String refreshToken;
}
