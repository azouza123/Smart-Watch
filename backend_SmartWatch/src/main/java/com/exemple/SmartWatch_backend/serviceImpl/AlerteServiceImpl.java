package com.exemple.SmartWatch_backend.serviceImpl;

import com.exemple.SmartWatch_backend.entity.*;
import com.exemple.SmartWatch_backend.model.AlerteDto;
import com.exemple.SmartWatch_backend.model.AlerteStatsDto;
import com.exemple.SmartWatch_backend.repository.AlerteRepository;
import com.exemple.SmartWatch_backend.repository.BatimentRepository;
import com.exemple.SmartWatch_backend.repository.CapteurRepository;
import com.exemple.SmartWatch_backend.service.AlerteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlerteServiceImpl implements AlerteService {

    private final AlerteRepository alerteRepository;
    private final BatimentRepository batimentRepository;
    private final CapteurRepository capteurRepository;

    @Override
    public List<AlerteDto> getAll() {
        return alerteRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AlerteDto> getByStatus(String status) {
        StatutAlerte statut = StatutAlerte.valueOf(status.toUpperCase());
        return alerteRepository.findByStatus(statut).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public AlerteDto getById(Long id) {
        return toDto(alerteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alerte non trouvée")));
    }

    @Override
    public AlerteDto create(AlerteDto dto) {
        Alerte alerte = Alerte.builder()
                .title(dto.getTitle())
                .type(dto.getType())
                .severity(dto.getSeverity())
                .status(dto.getStatus() != null ? dto.getStatus() : StatutAlerte.OPEN)
                .zone(dto.getZone())
                .unit(dto.getUnit())
                .threshold(dto.getThreshold())
                .actual(dto.getActual())
                .assignee(dto.getAssignee())
                .triggeredAt(dto.getTriggeredAt() != null ? dto.getTriggeredAt() : LocalDateTime.now())
                .build();

        if (dto.getBatimentId() != null) {
            batimentRepository.findById(dto.getBatimentId())
                    .ifPresent(alerte::setBatiment);
        }
        if (dto.getCapteurId() != null) {
            capteurRepository.findById(dto.getCapteurId())
                    .ifPresent(alerte::setCapteur);
        }

        return toDto(alerteRepository.save(alerte));
    }

    @Override
    public AlerteDto updateStatut(Long id, String statut) {
        Alerte alerte = alerteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alerte non trouvée"));
        alerte.setStatus(StatutAlerte.valueOf(statut.toUpperCase()));
        return toDto(alerteRepository.save(alerte));
    }

    @Override
    public AlerteDto updateAssignee(Long id, String assignee) {
        Alerte alerte = alerteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alerte non trouvée"));
        alerte.setAssignee(assignee);
        return toDto(alerteRepository.save(alerte));
    }

    @Override
    public AlerteDto addNote(Long id, String author, String text) {
        Alerte alerte = alerteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alerte non trouvée"));

        AlerteNote note = AlerteNote.builder()
                .author(author)
                .text(text)
                .time(LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm")))
                .build();

        alerte.getNotes().add(note);
        return toDto(alerteRepository.save(alerte));
    }

    @Override
    public void delete(Long id) {
        alerteRepository.deleteById(id);
    }

    @Override
    public AlerteStatsDto getStats() {
        return AlerteStatsDto.builder()
                .total(alerteRepository.count())
                .nbOpen(alerteRepository.countByStatus(StatutAlerte.OPEN))
                .nbInProgress(alerteRepository.countByStatus(StatutAlerte.IN_PROGRESS))
                .nbResolved(alerteRepository.countByStatus(StatutAlerte.RESOLVED))
                .build();
    }

    private AlerteDto toDto(Alerte a) {
        return AlerteDto.builder()
                .id(a.getId())
                .title(a.getTitle())
                .type(a.getType())
                .severity(a.getSeverity())
                .status(a.getStatus())
                .batimentId(a.getBatiment() != null ? a.getBatiment().getId() : null)
                .batimentNom(a.getBatiment() != null ? a.getBatiment().getNom() : null)
                .capteurId(a.getCapteur() != null ? a.getCapteur().getId() : null)
                .capteurReference(a.getCapteur() != null ? a.getCapteur().getReference() : null)
                .zone(a.getZone())
                .unit(a.getUnit())
                .threshold(a.getThreshold())
                .actual(a.getActual())
                .assignee(a.getAssignee())
                .triggeredAt(a.getTriggeredAt())
                .notes(a.getNotes())
                .build();
    }
}