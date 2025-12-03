package com.exemple.SmartWatch_backend.service;

import com.exemple.SmartWatch_backend.model.*;

public interface AuthService {
    AuthenticationResponse register(RegisterRequest request);
    AuthenticationResponse authenticate(AuthenticationRequest request);
    AuthenticationResponse refresh(String refreshToken);
}
