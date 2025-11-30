package com.exemple.SmartWatch_backend.controller;

import com.exemple.SmartWatch_backend.entity.Batiment;
import com.exemple.SmartWatch_backend.entity.Consumption;
import com.exemple.SmartWatch_backend.model.AlerteDto;
import com.exemple.SmartWatch_backend.model.BatimentDto;
import com.exemple.SmartWatch_backend.repository.BatimentRepository;
import com.exemple.SmartWatch_backend.repository.ConsumptionRepository;
import com.exemple.SmartWatch_backend.service.AlerteService;
import com.exemple.SmartWatch_backend.service.BatimentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ManagerController {

    private final ConsumptionRepository consumptionRepository;
    private final AlerteService alerteService;
    private final BatimentService batimentService;
    private final BatimentRepository batimentRepository;

    // Suivre les consommations
    @GetMapping("/consumption")
    public List<Consumption> trackConsumption() {
        return consumptionRepository.findAll();
    }

    @GetMapping("/consumption/batiment/{batimentId}")
    public List<Consumption> getConsumptionByBatiment(@PathVariable Long batimentId) {
        Batiment batiment = batimentRepository.findById(batimentId)
                .orElseThrow(() -> new RuntimeException("Bâtiment introuvable"));
        return consumptionRepository.findByBatiment(batiment);
    }

    // Consulter les objectifs
    @GetMapping("/targets")
    public List<BatimentDto> viewTargets() {
        return batimentService.getAllBatiments();
    }

    @GetMapping("/targets/{batimentId}")
    public BatimentDto getTargetByBatiment(@PathVariable Long batimentId) {
        BatimentDto batiment = batimentService.getBatimentById(batimentId);
        return batiment; // L'objectif est dans le champ objectif du bâtiment
    }

    // Recevoir des alertes
    @GetMapping("/alerts")
    public List<AlerteDto> receiveAlerts() {
        return alerteService.getAllAlertes();
    }

    @GetMapping("/alerts/{gestionnaireId}")
    public List<AlerteDto> getAlertsByGestionnaire(@PathVariable Long gestionnaireId) {
        return alerteService.getAlertesByGestionnaire(gestionnaireId);
    }

    // Gérer les actions
    @PostMapping("/actions")
    public Map<String, String> manageActions(@RequestBody Map<String, Object> action) {
        // TODO: Implémenter la logique de gestion des actions
        return Map.of("message", "Action gérée avec succès", "actionId", "1");
    }

    @GetMapping("/actions")
    public List<Map<String, Object>> getAllActions() {
        // TODO: Implémenter la récupération des actions
        return List.of(Map.of("id", 1, "description", "Action exemple"));
    }

    // Consulter les détails
    @GetMapping("/details/batiment/{batimentId}")
    public BatimentDto consultDetails(@PathVariable Long batimentId) {
        return batimentService.getBatimentById(batimentId);
    }
}
