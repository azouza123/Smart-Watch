package com.exemple.SmartWatch_backend.serviceImpl;

import com.exemple.SmartWatch_backend.entity.Role;
import com.exemple.SmartWatch_backend.entity.Utilisateur;
import com.exemple.SmartWatch_backend.model.AuthenticationRequest;
import com.exemple.SmartWatch_backend.model.AuthenticationResponse;
import com.exemple.SmartWatch_backend.model.RegisterRequest;
import com.exemple.SmartWatch_backend.repository.UtilisateurRepository;
import com.exemple.SmartWatch_backend.security.JwtService;
import com.exemple.SmartWatch_backend.service.AuthService;
import com.exemple.SmartWatch_backend.entity.StatutUtilisateur;

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
    private final CustomUserDetailsService userDetailsService;

    @Override
    public AuthenticationResponse register(RegisterRequest request) {

        // 🔒 Empêcher deux admins
        if (request.getRole() == Role.ADMINISTRATEUR &&
                utilisateurRepository.existsByRole(Role.ADMINISTRATEUR)) {
            throw new IllegalStateException("Il existe déjà un administrateur dans le système.");
        }

        // 🔒 Empêcher deux gestionnaires
        if (request.getRole() == Role.GESTIONNAIRE &&
                utilisateurRepository.existsByRole(Role.GESTIONNAIRE)) {
            throw new IllegalStateException("Il existe déjà un gestionnaire dans le système.");
        }

        // 🔒 Empêcher deux utilisateurs avec le même email
        if (utilisateurRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalStateException("Un utilisateur avec cet email existe déjà.");
        }

        // ✅ Création de l'utilisateur
        Utilisateur utilisateur = Utilisateur.builder()
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .email(request.getEmail())
                .motDePasse(passwordEncoder.encode(request.getMotDePasse()))
                .role(request.getRole())
                .statut(StatutUtilisateur.ACTIF)
                .build();

        utilisateurRepository.save(utilisateur);

        // Génération des tokens
        UserDetails userDetails = userDetailsService.loadUserByUsername(utilisateur.getEmail());
        String accessToken = jwtService.generateAccessToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        // ✅ Return with role + name
        return new AuthenticationResponse(
                accessToken,
                refreshToken,
                utilisateur.getRole(),
                utilisateur.getNom(),
                utilisateur.getPrenom(),
                utilisateur.getEmail()
        );
    }

    @Override
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getMotDePasse()
                )
        );

        // ✅ Load full user from DB to get role + name
        Utilisateur utilisateur = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String accessToken = jwtService.generateAccessToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        // ✅ Return with role + name
        return new AuthenticationResponse(
                accessToken,
                refreshToken,
                utilisateur.getRole(),
                utilisateur.getNom(),
                utilisateur.getPrenom(),
                utilisateur.getEmail()
        );
    }

    @Override
    public AuthenticationResponse refresh(String refreshToken) {
        String username = jwtService.extractUsername(refreshToken);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        if (!jwtService.isTokenValid(refreshToken, userDetails)) {
            throw new RuntimeException("Refresh token invalide");
        }

        // ✅ Load full user to return updated response
        Utilisateur utilisateur = utilisateurRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        String newAccessToken = jwtService.generateAccessToken(userDetails);

        return new AuthenticationResponse(
                newAccessToken,
                refreshToken,
                utilisateur.getRole(),
                utilisateur.getNom(),
                utilisateur.getPrenom(),
                utilisateur.getEmail()
        );
    }
}