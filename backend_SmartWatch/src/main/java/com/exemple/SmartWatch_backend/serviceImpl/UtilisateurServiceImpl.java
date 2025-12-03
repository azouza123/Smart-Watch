package com.exemple.SmartWatch_backend.serviceImpl;

import com.exemple.SmartWatch_backend.entity.Utilisateur;
import com.exemple.SmartWatch_backend.model.UtilisateurDto;
import com.exemple.SmartWatch_backend.entity.StatutUtilisateur;
import com.exemple.SmartWatch_backend.model.UtilisateurStatsDto;
import com.exemple.SmartWatch_backend.repository.UtilisateurRepository;
import com.exemple.SmartWatch_backend.entity.Role;
import com.exemple.SmartWatch_backend.service.UtilisateurService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UtilisateurServiceImpl implements UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;

    @Override
    public UtilisateurDto createUtilisateur(UtilisateurDto dto) {
        if (dto.getStatut() == null) {
            dto.setStatut(StatutUtilisateur.ACTIF);
        }

        Utilisateur utilisateur = mapToEntity(dto);
        utilisateur = utilisateurRepository.save(utilisateur);
        return mapToDto(utilisateur);
    }

    @Override
    public List<UtilisateurDto> getAllUtilisateurs() {
        return utilisateurRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public UtilisateurDto getUtilisateurById(Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        return mapToDto(utilisateur);
    }

    @Override
    public UtilisateurDto updateUtilisateur(Long id, UtilisateurDto dto) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        utilisateur.setNom(dto.getNom());
        utilisateur.setPrenom(dto.getPrenom());
        utilisateur.setEmail(dto.getEmail());
        utilisateur.setMotDePasse(dto.getMotDePasse());
        utilisateur.setRole(dto.getRole());
        utilisateur.setStatut(dto.getStatut());   // 🔹
        utilisateur = utilisateurRepository.save(utilisateur);
        return mapToDto(utilisateur);
    }

    @Override
    public void deleteUtilisateur(Long id) {
        utilisateurRepository.deleteById(id);
    }

    @Override
    public UtilisateurStatsDto getStats() {
        long total = utilisateurRepository.count();
        long admins = utilisateurRepository.countByRole(Role.ADMINISTRATEUR);
        long gests = utilisateurRepository.countByRole(Role.GESTIONNAIRE);
        long occs  = utilisateurRepository.countByRole(Role.OCCUPANT);
        long techs = utilisateurRepository.countByRole(Role.TECHNICIEN);

        return new UtilisateurStatsDto(total, admins, gests, occs, techs);
    }

    @Override
    public UtilisateurDto changeStatut(Long id, boolean actif) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        utilisateur.setStatut(actif ? StatutUtilisateur.ACTIF : StatutUtilisateur.BLOQUE);

        utilisateur = utilisateurRepository.save(utilisateur);
        return mapToDto(utilisateur);
    }

    // --------- mapping ---------

    private UtilisateurDto mapToDto(Utilisateur u) {
        UtilisateurDto dto = new UtilisateurDto();
        dto.setId(u.getId());
        dto.setNom(u.getNom());
        dto.setPrenom(u.getPrenom());
        dto.setEmail(u.getEmail());
        dto.setMotDePasse(u.getMotDePasse());
        dto.setRole(u.getRole());
        dto.setStatut(u.getStatut());      // 🔹 nouveau
        return dto;
    }

    private Utilisateur mapToEntity(UtilisateurDto dto) {
        return Utilisateur.builder()
                .id(dto.getId())
                .nom(dto.getNom())
                .prenom(dto.getPrenom())
                .email(dto.getEmail())
                .motDePasse(dto.getMotDePasse())
                .role(dto.getRole())
                .statut(dto.getStatut())   // 🔹 nouveau
                .build();
    }

}
