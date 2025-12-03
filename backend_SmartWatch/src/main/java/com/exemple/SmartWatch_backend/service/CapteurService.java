package com.exemple.SmartWatch_backend.service;

import com.exemple.SmartWatch_backend.model.CapteurDto;
import com.exemple.SmartWatch_backend.model.CapteurStatsDto;

import java.util.List;

public interface CapteurService {

    CapteurDto createCapteur(CapteurDto dto);

    List<CapteurDto> getAllCapteurs();

    List<CapteurDto> getCapteursByBatiment(Long batimentId);

    CapteurDto getCapteurById(Long id);

    CapteurDto updateCapteur(Long id, CapteurDto dto);

    void deleteCapteur(Long id);

    // bouton En ligne / Hors ligne
    CapteurDto changeEtat(Long id, boolean actif);

    // stats pour les cartes (total, en ligne, hors ligne, batterie faible)
    CapteurStatsDto getStats();
}
