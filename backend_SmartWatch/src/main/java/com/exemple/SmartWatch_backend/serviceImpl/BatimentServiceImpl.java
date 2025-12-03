package com.exemple.SmartWatch_backend.serviceImpl;

import com.exemple.SmartWatch_backend.entity.Batiment;
import com.exemple.SmartWatch_backend.entity.Utilisateur;
import com.exemple.SmartWatch_backend.model.BatimentDto;
import com.exemple.SmartWatch_backend.repository.BatimentRepository;
import com.exemple.SmartWatch_backend.repository.UtilisateurRepository;
import com.exemple.SmartWatch_backend.service.BatimentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BatimentServiceImpl implements BatimentService {

    private final BatimentRepository batimentRepository;
    private final UtilisateurRepository utilisateurRepository;

    @Override
    public BatimentDto createBatiment(BatimentDto dto) {
        Batiment batiment = mapToEntity(dto);
        batiment = batimentRepository.save(batiment);
        return mapToDto(batiment);
    }

    @Override
    public List<BatimentDto> getAllBatiments() {
        return batimentRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public BatimentDto getBatimentById(Long id) {
        Batiment batiment = batimentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bâtiment introuvable"));
        return mapToDto(batiment);
    }

    @Override
    public BatimentDto updateBatiment(Long id, BatimentDto dto) {
        Batiment batiment = batimentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bâtiment introuvable"));

        batiment.setNom(dto.getNom());
        batiment.setAdresse(dto.getAdresse());
        batiment.setType(dto.getType());

        if (dto.getGestionnaireId() != null) {
            Utilisateur gestionnaire = utilisateurRepository.findById(dto.getGestionnaireId())
                    .orElseThrow(() -> new RuntimeException("Gestionnaire introuvable"));
            batiment.setGestionnaire(gestionnaire);
        } else {
            batiment.setGestionnaire(null);
        }

        batiment = batimentRepository.save(batiment);
        return mapToDto(batiment);
    }

    @Override
    public void deleteBatiment(Long id) {
        batimentRepository.deleteById(id);
    }

    private BatimentDto mapToDto(Batiment b) {
        BatimentDto dto = new BatimentDto();
        dto.setId(b.getId());
        dto.setNom(b.getNom());
        dto.setAdresse(b.getAdresse());
        dto.setType(b.getType());
        dto.setGestionnaireId(
                b.getGestionnaire() != null ? b.getGestionnaire().getId() : null
        );
        return dto;
    }

    private Batiment mapToEntity(BatimentDto dto) {
        Batiment.BatimentBuilder builder = Batiment.builder()
                .id(dto.getId())
                .nom(dto.getNom())
                .adresse(dto.getAdresse())
                .type(dto.getType());

        if (dto.getGestionnaireId() != null) {
            Utilisateur gestionnaire = utilisateurRepository.findById(dto.getGestionnaireId())
                    .orElseThrow(() -> new RuntimeException("Gestionnaire introuvable"));
            builder.gestionnaire(gestionnaire);
        }

        return builder.build();
    }
}
