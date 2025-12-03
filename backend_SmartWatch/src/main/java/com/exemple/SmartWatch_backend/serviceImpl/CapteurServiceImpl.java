package com.exemple.SmartWatch_backend.serviceImpl;

import com.exemple.SmartWatch_backend.entity.Batiment;
import com.exemple.SmartWatch_backend.entity.Capteur;
import com.exemple.SmartWatch_backend.model.CapteurDto;
import com.exemple.SmartWatch_backend.model.CapteurStatsDto;
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
    public List<CapteurDto> getCapteursByBatiment(Long batimentId) {
        Batiment batiment = batimentRepository.findById(batimentId)
                .orElseThrow(() -> new RuntimeException("Bâtiment introuvable"));

        return capteurRepository.findByBatiment(batiment)
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

        capteur.setReference(dto.getReference());
        capteur.setEmplacement(dto.getEmplacement());
        capteur.setType(dto.getType());
        capteur.setZone(dto.getZone());
        capteur.setLogement(dto.getLogement());
        capteur.setBatterie(dto.getBatterie());
        capteur.setDebitActuel(dto.getDebitActuel());
        capteur.setActif(dto.getActif());
        capteur.setDerniereDonnee(dto.getDerniereDonnee());

        if (dto.getBatimentId() != null) {
            Batiment batiment = batimentRepository.findById(dto.getBatimentId())
                    .orElseThrow(() -> new RuntimeException("Bâtiment introuvable"));
            capteur.setBatiment(batiment);
        } else {
            capteur.setBatiment(null);
        }

        capteur = capteurRepository.save(capteur);
        return mapToDto(capteur);
    }

    @Override
    public void deleteCapteur(Long id) {
        capteurRepository.deleteById(id);
    }

    @Override
    public CapteurDto changeEtat(Long id, boolean actif) {
        Capteur capteur = capteurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Capteur introuvable"));

        capteur.setActif(actif);
        capteur = capteurRepository.save(capteur);
        return mapToDto(capteur);
    }

    @Override
    public CapteurStatsDto getStats() {
        long total = capteurRepository.count();
        long enLigne = capteurRepository.countByActif(true);
        long horsLigne = capteurRepository.countByActif(false);
        long batterieFaible = capteurRepository.countByBatterieLessThan(20.0); // seuil 20%

        return new CapteurStatsDto(total, enLigne, horsLigne, batterieFaible);
    }

    // ---------- mapping ----------

    private CapteurDto mapToDto(Capteur c) {
        CapteurDto dto = new CapteurDto();
        dto.setId(c.getId());
        dto.setReference(c.getReference());
        dto.setEmplacement(c.getEmplacement());
        dto.setType(c.getType());
        dto.setBatimentId(c.getBatiment() != null ? c.getBatiment().getId() : null);
        dto.setZone(c.getZone());
        dto.setLogement(c.getLogement());
        dto.setBatterie(c.getBatterie());
        dto.setDebitActuel(c.getDebitActuel());
        dto.setActif(c.getActif());
        dto.setDerniereDonnee(c.getDerniereDonnee());
        return dto;
    }

    private Capteur mapToEntity(CapteurDto dto) {
        Capteur.CapteurBuilder builder = Capteur.builder()
                .id(dto.getId())
                .reference(dto.getReference())
                .emplacement(dto.getEmplacement())
                .type(dto.getType())
                .zone(dto.getZone())
                .logement(dto.getLogement())
                .batterie(dto.getBatterie())
                .debitActuel(dto.getDebitActuel())
                .actif(dto.getActif())
                .derniereDonnee(dto.getDerniereDonnee());

        if (dto.getBatimentId() != null) {
            Batiment batiment = batimentRepository.findById(dto.getBatimentId())
                    .orElseThrow(() -> new RuntimeException("Bâtiment introuvable"));
            builder.batiment(batiment);
        }

        return builder.build();
    }
}
