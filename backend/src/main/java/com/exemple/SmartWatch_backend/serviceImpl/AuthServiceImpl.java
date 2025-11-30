package com.exemple.SmartWatch_backend.serviceImpl;

import com.exemple.SmartWatch_backend.entity.Utilisateur;
import com.exemple.SmartWatch_backend.model.*;
import com.exemple.SmartWatch_backend.repository.UtilisateurRepository;
import com.exemple.SmartWatch_backend.security.JwtService;
import com.exemple.SmartWatch_backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthenticationResponse register(RegisterRequest request) {
        Utilisateur utilisateur = Utilisateur.builder()
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .email(request.getEmail())
                .motDePasse(passwordEncoder.encode(request.getMotDePasse()))
                .role(request.getRole())
                .build();

        utilisateurRepository.save(utilisateur);

        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                utilisateur.getEmail(),
                utilisateur.getMotDePasse(),
                new CustomUserDetailsService(utilisateurRepository)
                        .loadUserByUsername(utilisateur.getEmail()).getAuthorities()
        );

        String accessToken = jwtService.generateAccessToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        return new AuthenticationResponse(accessToken, refreshToken);
    }

    @Override
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getMotDePasse()
                )
        );

        UserDetails userDetails = new CustomUserDetailsService(utilisateurRepository)
                .loadUserByUsername(request.getEmail());

        String accessToken = jwtService.generateAccessToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        return new AuthenticationResponse(accessToken, refreshToken);
    }

    @Override
    public AuthenticationResponse refresh(String refreshToken) {
        String username = jwtService.extractUsername(refreshToken);
        UserDetails userDetails = new CustomUserDetailsService(utilisateurRepository)
                .loadUserByUsername(username);

        if (!jwtService.isTokenValid(refreshToken, userDetails)) {
            throw new RuntimeException("Refresh token invalide");
        }

        String newAccessToken = jwtService.generateAccessToken(userDetails);
        return new AuthenticationResponse(newAccessToken, refreshToken);
    }
}
