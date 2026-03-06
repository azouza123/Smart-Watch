package com.exemple.SmartWatch_backend.serviceImpl;

import com.exemple.SmartWatch_backend.entity.*;
import com.exemple.SmartWatch_backend.model.AlerteDto;
import com.exemple.SmartWatch_backend.model.AlerteReadingDto;
import com.exemple.SmartWatch_backend.model.AlerteStatsDto;
import com.exemple.SmartWatch_backend.repository.AlerteReadingRepository;
import com.exemple.SmartWatch_backend.repository.AlerteRepository;
import com.exemple.SmartWatch_backend.repository.BatimentRepository;
import com.exemple.SmartWatch_backend.repository.CapteurRepository;
import com.exemple.SmartWatch_backend.service.AlerteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlerteServiceImpl implements AlerteService {

    private final AlerteRepository alerteRepository;
    private final BatimentRepository batimentRepository;
    private final CapteurRepository capteurRepository;
    private final AlerteReadingRepository alerteReadingRepository; // ✅ NEW

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
        LocalDateTime triggeredAt = dto.getTriggeredAt() != null ? dto.getTriggeredAt() : LocalDateTime.now();

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
                .triggeredAt(triggeredAt)
                .build();

        if (dto.getBatimentId() != null) {
            batimentRepository.findById(dto.getBatimentId())
                    .ifPresent(alerte::setBatiment);
        }
        if (dto.getCapteurId() != null) {
            capteurRepository.findById(dto.getCapteurId())
                    .ifPresent(alerte::setCapteur);
        }

        Alerte saved = alerteRepository.save(alerte);

        // ✅ Auto-generate realistic readings around the trigger time
        generateReadings(saved, triggeredAt, dto.getThreshold(), dto.getActual());

        return toDto(saved);
    }

    // ✅ NEW — generates 12 readings: normal → spike at trigger → recovery
    private void generateReadings(Alerte alerte, LocalDateTime triggeredAt, Double threshold, Double actual) {
        if (threshold == null || actual == null) return;

        List<AlerteReading> readings = new ArrayList<>();
        double base = threshold * 0.6; // normal consumption ~60% of threshold
        double spike = actual;         // peak = the actual detected value

        for (int i = -6; i <= 5; i++) {
            LocalDateTime time = triggeredAt.plusMinutes(i * 30L);
            double value;
            if (i < -2) {
                // normal range before event
                value = base + (Math.random() * threshold * 0.1);
            } else if (i == -1 || i == 0) {
                // rising toward spike
                value = base + (spike - base) * (i == -1 ? 0.6 : 1.0);
            } else if (i == 1) {
                // peak
                value = spike;
            } else {
                // gradual recovery
                value = spike - ((spike - base) * (i - 1) * 0.25);
                value = Math.max(value, base);
            }

            readings.add(AlerteReading.builder()
                    .alerte(alerte)
                    .time(time)
                    .value(Math.round(value * 100.0) / 100.0)
                    .build());
        }

        alerteReadingRepository.saveAll(readings);
    }

    @Override
    public List<AlerteReadingDto> getReadings(Long alerteId) {
        return alerteReadingRepository.findByAlerteIdOrderByTimeAsc(alerteId)
                .stream()
                .map(r -> AlerteReadingDto.builder()
                        .time(r.getTime())
                        .value(r.getValue())
                        .build())
                .collect(Collectors.toList());
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