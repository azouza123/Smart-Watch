package com.exemple.SmartWatch_backend.service;

import com.exemple.SmartWatch_backend.model.AlerteDto;
import java.util.List;

public interface AlerteService {
    AlerteDto createAlerte(AlerteDto dto);
    List<AlerteDto> getAllAlertes();
    AlerteDto getAlerteById(Long id);
    AlerteDto updateAlerte(Long id, AlerteDto dto);
    void deleteAlerte(Long id);
    List<AlerteDto> getAlertesByGestionnaire(Long gestionnaireId);
    List<AlerteDto> getAlertesByOccupant(Long occupantId);
    List<AlerteDto> getAlertesByTechnicien(Long technicienId);
    List<AlerteDto> getAlertesByCapteur(Long capteurId);
}

