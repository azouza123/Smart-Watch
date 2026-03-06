package com.exemple.SmartWatch_backend.serviceImpl;

import com.exemple.SmartWatch_backend.entity.Alerte;
import com.exemple.SmartWatch_backend.entity.AlerteReading;
import com.exemple.SmartWatch_backend.model.AlerteReadingDto;
import com.exemple.SmartWatch_backend.repository.AlerteReadingRepository;
import com.exemple.SmartWatch_backend.repository.AlerteRepository;
import com.exemple.SmartWatch_backend.service.AlerteReadingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlerteReadingServiceImpl implements AlerteReadingService {

    private final AlerteReadingRepository alerteReadingRepository;
    private final AlerteRepository alerteRepository;

    @Override
    public List<AlerteReadingDto> getReadingsByAlerte(Long alerteId) {
        return alerteReadingRepository.findByAlerteIdOrderByTimeAsc(alerteId)
                .stream()
                .map(r -> AlerteReadingDto.builder()
                        .time(r.getTime())
                        .value(r.getValue())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public AlerteReadingDto addReading(Long alerteId, AlerteReadingDto dto) {
        Alerte alerte = alerteRepository.findById(alerteId)
                .orElseThrow(() -> new RuntimeException("Alerte non trouvée"));

        AlerteReading reading = AlerteReading.builder()
                .alerte(alerte)
                .time(dto.getTime() != null ? dto.getTime() : java.time.LocalDateTime.now())
                .value(dto.getValue())
                .build();

        AlerteReading saved = alerteReadingRepository.save(reading);

        return AlerteReadingDto.builder()
                .time(saved.getTime())
                .value(saved.getValue())
                .build();
    }
}