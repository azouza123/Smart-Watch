package com.exemple.SmartWatch_backend.service;


import com.exemple.SmartWatch_backend.model.UtilisateurDto;
import com.exemple.SmartWatch_backend.model.UtilisateurStatsDto;

import java.util.List;

public interface UtilisateurService {

    UtilisateurDto createUtilisateur(UtilisateurDto dto);

    List<UtilisateurDto> getAllUtilisateurs();

    UtilisateurDto getUtilisateurById(Long id);

    UtilisateurDto updateUtilisateur(Long id, UtilisateurDto dto);

    void deleteUtilisateur(Long id);
    // 🔹 stats pour le dashboard
    UtilisateurStatsDto getStats();

    // 🔹 changer statut actif/bloqué
    UtilisateurDto changeStatut(Long id, boolean actif);
}