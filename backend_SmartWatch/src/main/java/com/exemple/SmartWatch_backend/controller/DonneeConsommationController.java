package com.exemple.SmartWatch_backend.controller;

import com.exemple.SmartWatch_backend.model.DonneeConsommationDto;
import com.exemple.SmartWatch_backend.service.DonneeConsommationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/consommation")
@RequiredArgsConstructor
public class DonneeConsommationController {

    private final DonneeConsommationService service;

    // Add a reading
    @PostMapping
    public DonneeConsommationDto add(@RequestBody DonneeConsommationDto dto) {
        return service.add(dto);
    }

    // Chart data — global
    @GetMapping("/chart")
    public List<Map<String, Object>> getChart(@RequestParam(defaultValue = "week") String periode) {
        return service.getChartData(periode);
    }

    // Chart data — by building
    @GetMapping("/chart/batiment/{id}")
    public List<Map<String, Object>> getChartByBatiment(
            @PathVariable Long id,
            @RequestParam(defaultValue = "week") String periode) {
        return service.getChartDataByBatiment(id, periode);
    }

    // Comparison data — global
    @GetMapping("/comparison")
    public List<Map<String, Object>> getComparison(
            @RequestParam(defaultValue = "week") String periode) {
        return service.getComparisonData(periode);
    }

    // Comparison data — by building
    @GetMapping("/comparison/batiment/{id}")
    public List<Map<String, Object>> getComparisonByBatiment(
            @PathVariable Long id,
            @RequestParam(defaultValue = "week") String periode) {
        return service.getComparisonDataByBatiment(id, periode);
    }
}