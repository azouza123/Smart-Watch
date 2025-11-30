package com.exemple.SmartWatch_backend.serviceImpl;

import com.exemple.SmartWatch_backend.entity.*;
import com.exemple.SmartWatch_backend.model.AlerteDto;
import com.exemple.SmartWatch_backend.repository.*;
import com.exemple.SmartWatch_backend.service.AlerteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlerteServiceImpl implements AlerteService {

    private final AlerteRepository alerteRepository;
    private final CapteurRepository capteurRepository;
    private final GestionnaireRepository gestionnaireRepository;
    private final OccupantRepository occupantRepository;
    private final TechnicienRepository technicienRepository;

    @Override
    public AlerteDto createAlerte(AlerteDto dto) {
        Alerte alerte = mapToEntity(dto);
        alerte = alerteRepository.save(alerte);
        return mapToDto(alerte);
    }

    @Override
    public List<AlerteDto> getAllAlertes() {
        return alerteRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public AlerteDto getAlerteById(Long id) {
        Alerte alerte = alerteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alerte introuvable"));
        return mapToDto(alerte);
    }

    @Override
    public AlerteDto updateAlerte(Long id, AlerteDto dto) {
        Alerte alerte = alerteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alerte introuvable"));

        alerte.setTypeAlerte(dto.getTypeAlerte());
        alerte.setDate(dto.getDate());
        alerte.setMessage(dto.getMessage());
        alerte.setTime(dto.getTime());

        if (dto.getCapteurId() != null) {
            Capteur capteur = capteurRepository.findById(dto.getCapteurId())
                    .orElseThrow(() -> new RuntimeException("Capteur introuvable"));
            alerte.setCapteur(capteur);
        }

        if (dto.getGestionnaireId() != null) {
            Gestionnaire gestionnaire = gestionnaireRepository.findById(dto.getGestionnaireId())
                    .orElseThrow(() -> new RuntimeException("Gestionnaire introuvable"));
            alerte.setGestionnaire(gestionnaire);
        }

        if (dto.getOccupantId() != null) {
            Occupant occupant = occupantRepository.findById(dto.getOccupantId())
                    .orElseThrow(() -> new RuntimeException("Occupant introuvable"));
            alerte.setOccupant(occupant);
        }

        if (dto.getTechnicienId() != null) {
            Technicien technicien = technicienRepository.findById(dto.getTechnicienId())
                    .orElseThrow(() -> new RuntimeException("Technicien introuvable"));
            alerte.setTechnicien(technicien);
        }

        alerte = alerteRepository.save(alerte);
        return mapToDto(alerte);
    }

    @Override
    public void deleteAlerte(Long id) {
        alerteRepository.deleteById(id);
    }

    @Override
    public List<AlerteDto> getAlertesByGestionnaire(Long gestionnaireId) {
        return alerteRepository.findByGestionnaireId(gestionnaireId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AlerteDto> getAlertesByOccupant(Long occupantId) {
        return alerteRepository.findByOccupantId(occupantId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AlerteDto> getAlertesByTechnicien(Long technicienId) {
        return alerteRepository.findByTechnicienId(technicienId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AlerteDto> getAlertesByCapteur(Long capteurId) {
        return alerteRepository.findByCapteurId(capteurId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private AlerteDto mapToDto(Alerte a) {
        AlerteDto dto = new AlerteDto();
        dto.setIdalerte(a.getIdalerte());
        dto.setTypeAlerte(a.getTypeAlerte());
        dto.setDate(a.getDate());
        dto.setMessage(a.getMessage());
        dto.setTime(a.getTime());
        dto.setCapteurId(a.getCapteur() != null ? a.getCapteur().getIdcapteur() : null);
        dto.setGestionnaireId(a.getGestionnaire() != null ? a.getGestionnaire().getId() : null);
        dto.setOccupantId(a.getOccupant() != null ? a.getOccupant().getId() : null);
        dto.setTechnicienId(a.getTechnicien() != null ? a.getTechnicien().getId() : null);
        return dto;
    }

    private Alerte mapToEntity(AlerteDto dto) {
        Alerte alerte = new Alerte();
        alerte.setTypeAlerte(dto.getTypeAlerte());
        alerte.setDate(dto.getDate());
        alerte.setMessage(dto.getMessage());
        alerte.setTime(dto.getTime());

        if (dto.getCapteurId() != null) {
            Capteur capteur = capteurRepository.findById(dto.getCapteurId())
                    .orElseThrow(() -> new RuntimeException("Capteur introuvable"));
            alerte.setCapteur(capteur);
        }

        if (dto.getGestionnaireId() != null) {
            Gestionnaire gestionnaire = gestionnaireRepository.findById(dto.getGestionnaireId())
                    .orElseThrow(() -> new RuntimeException("Gestionnaire introuvable"));
            alerte.setGestionnaire(gestionnaire);
        }

        if (dto.getOccupantId() != null) {
            Occupant occupant = occupantRepository.findById(dto.getOccupantId())
                    .orElseThrow(() -> new RuntimeException("Occupant introuvable"));
            alerte.setOccupant(occupant);
        }

        if (dto.getTechnicienId() != null) {
            Technicien technicien = technicienRepository.findById(dto.getTechnicienId())
                    .orElseThrow(() -> new RuntimeException("Technicien introuvable"));
            alerte.setTechnicien(technicien);
        }

        return alerte;
    }
}

