package com.exemple.SmartWatch_backend.serviceImpl;

import com.exemple.SmartWatch_backend.entity.Administrateur;
import com.exemple.SmartWatch_backend.entity.Batiment;
import com.exemple.SmartWatch_backend.entity.Capteur;
import com.exemple.SmartWatch_backend.model.CapteurDto;
import com.exemple.SmartWatch_backend.repository.AdministrateurRepository;
import com.exemple.SmartWatch_backend.repository.BatimentRepository;
import com.exemple.SmartWatch_backend.repository.CapteurRepository;
import com.exemple.SmartWatch_backend.service.CapteurService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CapteurServiceImpl implements CapteurService {

    private final CapteurRepository capteurRepository;
    private final BatimentRepository batimentRepository;
    private final AdministrateurRepository administrateurRepository;

    @Override
    public CapteurDto createCapteur(CapteurDto dto) {
        Capteur capteur = mapToEntity(dto);
        capteur = capteurRepository.save(capteur);
        return mapToDto(capteur);
    }

    @Override
    public List<CapteurDto> getAllCapteurs() {
        return capteurRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public CapteurDto getCapteurById(Long id) {
        Capteur capteur = capteurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Capteur introuvable"));
        return mapToDto(capteur);
    }

    @Override
    public CapteurDto updateCapteur(Long id, CapteurDto dto) {
        Capteur capteur = capteurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Capteur introuvable"));

        capteur.setDebit(dto.getDebit());
        capteur.setEtat(dto.getEtat());
        capteur.setBatterie(dto.getBatterie());

        if (dto.getBatimentId() != null) {
            Batiment batiment = batimentRepository.findById(dto.getBatimentId())
                    .orElseThrow(() -> new RuntimeException("Bâtiment introuvable"));
            capteur.setBatiment(batiment);
        }

        if (dto.getAdministrateurId() != null) {
            Administrateur admin = administrateurRepository.findById(dto.getAdministrateurId())
                    .orElseThrow(() -> new RuntimeException("Administrateur introuvable"));
            capteur.setAdministrateur(admin);
        }

        capteur = capteurRepository.save(capteur);
        return mapToDto(capteur);
    }

    @Override
    public void deleteCapteur(Long id) {
        capteurRepository.deleteById(id);
    }

    @Override
    public List<CapteurDto> getCapteursByBatiment(Long batimentId) {
        return capteurRepository.findByBatimentId(batimentId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<CapteurDto> getCapteursByEtat(Boolean etat) {
        return capteurRepository.findByEtat(etat)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private CapteurDto mapToDto(Capteur c) {
        CapteurDto dto = new CapteurDto();
        dto.setIdcapteur(c.getIdcapteur());
        dto.setDebit(c.getDebit());
        dto.setEtat(c.getEtat());
        dto.setBatterie(c.getBatterie());
        dto.setBatimentId(c.getBatiment() != null ? c.getBatiment().getIdbatiment() : null);
        dto.setAdministrateurId(c.getAdministrateur() != null ? c.getAdministrateur().getId() : null);
        return dto;
    }

    private Capteur mapToEntity(CapteurDto dto) {
        Capteur capteur = new Capteur();
        capteur.setDebit(dto.getDebit());
        capteur.setEtat(dto.getEtat());
        capteur.setBatterie(dto.getBatterie());

        if (dto.getBatimentId() != null) {
            Batiment batiment = batimentRepository.findById(dto.getBatimentId())
                    .orElseThrow(() -> new RuntimeException("Bâtiment introuvable"));
            capteur.setBatiment(batiment);
        }

        if (dto.getAdministrateurId() != null) {
            Administrateur admin = administrateurRepository.findById(dto.getAdministrateurId())
                    .orElseThrow(() -> new RuntimeException("Administrateur introuvable"));
            capteur.setAdministrateur(admin);
        }

        return capteur;
    }
}

