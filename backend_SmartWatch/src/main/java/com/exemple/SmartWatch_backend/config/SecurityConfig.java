package com.exemple.SmartWatch_backend.config;

import com.exemple.SmartWatch_backend.security.JwtAuthenticationFilter;
import com.exemple.SmartWatch_backend.serviceImpl.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // ✅ CORS added
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()

                        // Users — only admin can write, others can read
                        .requestMatchers(HttpMethod.GET, "/api/utilisateurs/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE")
                        .requestMatchers("/api/utilisateurs/**").hasRole("ADMINISTRATEUR")

                        // Buildings — only admin can write, manager/tech/occupant can read
                        .requestMatchers(HttpMethod.GET, "/api/batiments/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "TECHNICIEN", "OCCUPANT")
                        .requestMatchers("/api/batiments/**").hasRole("ADMINISTRATEUR")

                        // Capteurs — all roles can read
                        .requestMatchers(HttpMethod.GET, "/api/capteurs/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "TECHNICIEN", "OCCUPANT")
                        .requestMatchers("/api/capteurs/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "TECHNICIEN")

                        // Alertes — all roles can read, occupant read-only
                        .requestMatchers(HttpMethod.GET, "/api/alertes/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "TECHNICIEN", "OCCUPANT")
                        .requestMatchers("/api/alertes/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "TECHNICIEN")
                        .requestMatchers(HttpMethod.GET, "/api/consommation/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "TECHNICIEN", "OCCUPANT")
                        .requestMatchers("/api/consommation/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "TECHNICIEN")
                        .requestMatchers("/api/objectifs/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "TECHNICIEN", "OCCUPANT")
                        .requestMatchers("/api/actions/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE")
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // ✅ CORS configuration — allows React on port 3000
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}