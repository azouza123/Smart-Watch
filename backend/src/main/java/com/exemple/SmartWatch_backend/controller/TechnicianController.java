package com.exemple.SmartWatch_backend.controller;

import com.exemple.SmartWatch_backend.model.AlerteDto;
import com.exemple.SmartWatch_backend.model.CapteurDto;
import com.exemple.SmartWatch_backend.service.AlerteService;
import com.exemple.SmartWatch_backend.service.CapteurService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/technician")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class TechnicianController {

    private final AlerteService alerteService;
    private final CapteurService capteurService;

    // Intervenir en cas d'anomalie
    @PostMapping("/interventions")
    public Map<String, Object> intervene(@RequestBody Map<String, Object> intervention) {
        // TODO: Implémenter la logique d'intervention
        return Map.of(
            "message", "Intervention enregistrée avec succès",
            "interventionId", 1,
            "status", "en_cours"
        );
    }

    @GetMapping("/interventions")
    public List<Map<String, Object>> getAllInterventions() {
        // TODO: Implémenter la récupération des interventions
        return List.of(
            Map.of("id", 1, "type", "Maintenance", "status", "en_cours"),
            Map.of("id", 2, "type", "Réparation", "status", "terminée")
        );
    }

    // Recevoir les tâches à réaliser
    @GetMapping("/tasks")
    public List<Map<String, Object>> viewTasks() {
        // TODO: Implémenter la récupération des tâches
        return List.of(
            Map.of("id", 1, "description", "Vérifier capteur SEN-001", "priority", "haute"),
            Map.of("id", 2, "description", "Remplacer batterie capteur SEN-003", "priority", "moyenne")
        );
    }

    @GetMapping("/tasks/{technicienId}")
    public List<Map<String, Object>> getTasksByTechnicien(@PathVariable Long technicienId) {
        // TODO: Implémenter la récupération des tâches par technicien
        return viewTasks();
    }

    // Consulter les états des capteurs
    @GetMapping("/sensor-stats")
    public List<CapteurDto> viewSensorStats() {
        return capteurService.getAllCapteurs();
    }

    @GetMapping("/sensor-stats/{capteurId}")
    public CapteurDto getSensorStatsById(@PathVariable Long capteurId) {
        return capteurService.getCapteurById(capteurId);
    }

    @GetMapping("/sensor-stats/etat/{etat}")
    public List<CapteurDto> getSensorsByEtat(@PathVariable Boolean etat) {
        return capteurService.getCapteursByEtat(etat);
    }

    // Consulter les alertes
    @GetMapping("/alerts")
    public List<AlerteDto> viewAlerts() {
        return alerteService.getAllAlertes();
    }

    @GetMapping("/alerts/{technicienId}")
    public List<AlerteDto> getAlertsByTechnicien(@PathVariable Long technicienId) {
        return alerteService.getAlertesByTechnicien(technicienId);
    }

    @GetMapping("/alerts/capteur/{capteurId}")
    public List<AlerteDto> getAlertsByCapteur(@PathVariable Long capteurId) {
        return alerteService.getAlertesByCapteur(capteurId);
    }
}
