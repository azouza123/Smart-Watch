package com.exemple.SmartWatch_backend.serviceImpl;

import com.exemple.SmartWatch_backend.entity.*;
import com.exemple.SmartWatch_backend.model.DonneeConsommationDto;
import com.exemple.SmartWatch_backend.repository.*;
import com.exemple.SmartWatch_backend.service.DonneeConsommationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DonneeConsommationServiceImpl implements DonneeConsommationService {

    private final DonneeConsommationRepository consommationRepository;
    private final CapteurRepository capteurRepository;
    private final BatimentRepository batimentRepository;

    @Override
    public DonneeConsommationDto add(DonneeConsommationDto dto) {
        DonneeConsommation entity = new DonneeConsommation();

        if (dto.getCapteurId() != null) {
            capteurRepository.findById(dto.getCapteurId())
                    .ifPresent(entity::setCapteur);
        }
        if (dto.getBatimentId() != null) {
            batimentRepository.findById(dto.getBatimentId())
                    .ifPresent(entity::setBatiment);
        }

        entity.setTimestamp(dto.getTimestamp() != null ? dto.getTimestamp() : LocalDateTime.now());
        entity.setValeur(dto.getValeur());
        entity.setZone(dto.getZone());
        entity.setPeriode(dto.getPeriode() != null
                ? PeriodeType.valueOf(dto.getPeriode())
                : PeriodeType.DAY);

        DonneeConsommation saved = consommationRepository.save(entity);

        return DonneeConsommationDto.builder()
                .id(saved.getId())
                .capteurId(saved.getCapteur() != null ? saved.getCapteur().getId() : null)
                .batimentId(saved.getBatiment() != null ? saved.getBatiment().getId() : null)
                .timestamp(saved.getTimestamp())
                .valeur(saved.getValeur())
                .zone(saved.getZone())
                .periode(saved.getPeriode().name())
                .build();
    }

    @Override
    public List<Map<String, Object>> getChartData(String periode) {
        LocalDateTime[] range = getRange(periode);
        List<DonneeConsommation> data = consommationRepository
                .findByTimestampBetweenOrderByTimestampAsc(range[0], range[1]);
        return buildChartData(data, periode);
    }

    @Override
    public List<Map<String, Object>> getChartDataByBatiment(Long batimentId, String periode) {
        LocalDateTime[] range = getRange(periode);
        List<DonneeConsommation> data = consommationRepository
                .findByBatimentIdAndTimestampBetweenOrderByTimestampAsc(batimentId, range[0], range[1]);
        return buildChartData(data, periode);
    }

    @Override
    public List<Map<String, Object>> getComparisonData(String periode) {
        LocalDateTime[] range = getRange(periode);
        LocalDateTime[] prevRange = getPreviousRange(periode);

        List<Object[]> current = consommationRepository.sumByZoneBetween(range[0], range[1]);
        List<Object[]> previous = consommationRepository.sumByZoneBetween(prevRange[0], prevRange[1]);

        return buildComparisonData(current, previous);
    }

    @Override
    public List<Map<String, Object>> getComparisonDataByBatiment(Long batimentId, String periode) {
        LocalDateTime[] range = getRange(periode);
        LocalDateTime[] prevRange = getPreviousRange(periode);

        List<Object[]> current = consommationRepository
                .sumByZoneAndBatimentBetween(batimentId, range[0], range[1]);
        List<Object[]> previous = consommationRepository
                .sumByZoneAndBatimentBetween(batimentId, prevRange[0], prevRange[1]);

        return buildComparisonData(current, previous);
    }

    // ─── helpers ───────────────────────────────────────────

    private LocalDateTime[] getRange(String periode) {
        LocalDateTime now = LocalDateTime.now();
        return switch (periode.toUpperCase()) {
            case "DAY"   -> new LocalDateTime[]{ now.toLocalDate().atStartOfDay(), now };
            case "MONTH" -> new LocalDateTime[]{ now.withDayOfMonth(1).toLocalDate().atStartOfDay(), now };
            default      -> new LocalDateTime[]{ now.minusDays(7), now }; // WEEK
        };
    }

    private LocalDateTime[] getPreviousRange(String periode) {
        LocalDateTime now = LocalDateTime.now();
        return switch (periode.toUpperCase()) {
            case "DAY"   -> new LocalDateTime[]{ now.minusDays(1).toLocalDate().atStartOfDay(),
                    now.minusDays(1) };
            case "MONTH" -> new LocalDateTime[]{ now.minusMonths(1).withDayOfMonth(1).toLocalDate().atStartOfDay(),
                    now.minusMonths(1) };
            default      -> new LocalDateTime[]{ now.minusDays(14), now.minusDays(7) };
        };
    }

    private List<Map<String, Object>> buildChartData(
            List<DonneeConsommation> data, String periode) {

        Map<String, Double> grouped = new LinkedHashMap<>();

        DateTimeFormatter fmt = switch (periode.toUpperCase()) {
            case "DAY"   -> DateTimeFormatter.ofPattern("HH'h'");
            case "MONTH" -> DateTimeFormatter.ofPattern("dd/MM");
            default      -> DateTimeFormatter.ofPattern("EEE");
        };

        for (DonneeConsommation d : data) {
            String key = d.getTimestamp().format(fmt);
            grouped.merge(key, d.getValeur(), Double::sum);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        grouped.forEach((time, val) -> {
            Map<String, Object> point = new LinkedHashMap<>();
            point.put("time", time);
            point.put("consumption", Math.round(val * 10.0) / 10.0);
            result.add(point);
        });

        return result;
    }

    private List<Map<String, Object>> buildComparisonData(
            List<Object[]> current, List<Object[]> previous) {

        Map<String, Double> currentMap = new LinkedHashMap<>();
        Map<String, Double> previousMap = new LinkedHashMap<>();

        for (Object[] row : current)  currentMap.put((String) row[0], ((Number) row[1]).doubleValue());
        for (Object[] row : previous) previousMap.put((String) row[0], ((Number) row[1]).doubleValue());

        Set<String> zones = new LinkedHashSet<>();
        zones.addAll(currentMap.keySet());
        zones.addAll(previousMap.keySet());

        List<Map<String, Object>> result = new ArrayList<>();
        for (String zone : zones) {
            Map<String, Object> point = new LinkedHashMap<>();
            point.put("zone", zone);
            point.put("current",  Math.round(currentMap.getOrDefault(zone, 0.0)  * 10.0) / 10.0);
            point.put("previous", Math.round(previousMap.getOrDefault(zone, 0.0) * 10.0) / 10.0);
            result.add(point);
        }
        return result;
    }
}