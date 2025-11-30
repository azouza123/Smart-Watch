package com.exemple.SmartWatch_backend.controller;

import com.exemple.SmartWatch_backend.entity.Batiment;
import com.exemple.SmartWatch_backend.entity.Consumption;
import com.exemple.SmartWatch_backend.model.AlerteDto;
import com.exemple.SmartWatch_backend.repository.BatimentRepository;
import com.exemple.SmartWatch_backend.repository.ConsumptionRepository;
import com.exemple.SmartWatch_backend.service.AlerteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/occupant")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class OccupantController {

    private final ConsumptionRepository consumptionRepository;
    private final AlerteService alerteService;
    private final BatimentRepository batimentRepository;

    // Consulter consommation
    @GetMapping("/water")
    public List<Consumption> viewWaterConsumption() {
        return consumptionRepository.findAll();
    }

    @GetMapping("/water/batiment/{batimentId}")
    public List<Consumption> getWaterConsumptionByBatiment(@PathVariable Long batimentId) {
        Batiment batiment = batimentRepository.findById(batimentId)
                .orElseThrow(() -> new RuntimeException("Bâtiment introuvable"));
        return consumptionRepository.findByBatiment(batiment);
    }

    // Envoyer des alertes
    @PostMapping("/alerts")
    public AlerteDto sendAlert(@RequestBody AlerteDto alerteDto) {
        return alerteService.createAlerte(alerteDto);
    }

    @GetMapping("/alerts/{occupantId}")
    public List<AlerteDto> getMyAlerts(@PathVariable Long occupantId) {
        return alerteService.getAlertesByOccupant(occupantId);
    }

    // Recevoir des conseils
    @GetMapping("/advice")
    public List<Map<String, Object>> receiveAdvice() {
        // TODO: Implémenter la logique de conseils personnalisés
        return List.of(
            Map.of("title", "Conseil d'économie", "message", "Fermez les robinets lorsque vous ne les utilisez pas"),
            Map.of("title", "Détection de fuite", "message", "Vérifiez régulièrement vos installations")
        );
    }

    // Consulter les pages de comparaison
    @GetMapping("/comparison")
    public Map<String, Object> viewComparison() {
        // TODO: Implémenter la logique de comparaison
        return Map.of(
            "myConsumption", 150.5,
            "averageConsumption", 200.0,
            "neighborsAverage", 180.0
        );
    }

    @GetMapping("/comparison/batiment/{batimentId}")
    public Map<String, Object> getComparisonByBatiment(@PathVariable Long batimentId) {
        Batiment batiment = batimentRepository.findById(batimentId)
                .orElseThrow(() -> new RuntimeException("Bâtiment introuvable"));
        List<Consumption> consumptions = consumptionRepository.findByBatiment(batiment);
        double average = consumptions.stream()
            .mapToDouble(c -> c.getValue() != null ? c.getValue() : 0.0)
            .average()
            .orElse(0.0);
        
        return Map.of(
            "batimentId", batimentId,
            "averageConsumption", average,
            "totalConsumptions", consumptions.size()
        );
    }
}
