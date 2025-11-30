package com.exemple.SmartWatch_backend.service;

import com.exemple.SmartWatch_backend.model.CapteurDto;
import java.util.List;

public interface CapteurService {
    CapteurDto createCapteur(CapteurDto dto);
    List<CapteurDto> getAllCapteurs();
    CapteurDto getCapteurById(Long id);
    CapteurDto updateCapteur(Long id, CapteurDto dto);
    void deleteCapteur(Long id);
    List<CapteurDto> getCapteursByBatiment(Long batimentId);
    List<CapteurDto> getCapteursByEtat(Boolean etat);
}

