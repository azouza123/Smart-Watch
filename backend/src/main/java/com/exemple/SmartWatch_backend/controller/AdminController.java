package com.exemple.SmartWatch_backend.controller;

import com.exemple.SmartWatch_backend.model.*;
import com.exemple.SmartWatch_backend.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final UtilisateurService utilisateurService;
    private final BatimentService batimentService;
    private final CapteurService capteurService;

    // Gestion des comptes utilisateurs
    @GetMapping("/accounts")
    public List<UtilisateurDto> getAllAccounts() {
        return utilisateurService.getAllUtilisateurs();
    }

    @GetMapping("/accounts/{id}")
    public UtilisateurDto getAccountById(@PathVariable Long id) {
        return utilisateurService.getUtilisateurById(id);
    }

    @PostMapping("/accounts")
    public UtilisateurDto createAccount(@RequestBody UtilisateurDto dto) {
        return utilisateurService.createUtilisateur(dto);
    }

    @PutMapping("/accounts/{id}")
    public UtilisateurDto updateAccount(@PathVariable Long id, @RequestBody UtilisateurDto dto) {
        return utilisateurService.updateUtilisateur(id, dto);
    }

    @DeleteMapping("/accounts/{id}")
    public void deleteAccount(@PathVariable Long id) {
        utilisateurService.deleteUtilisateur(id);
    }

    // Gestion des bâtiments
    @GetMapping("/buildings")
    public List<BatimentDto> getAllBuildings() {
        return batimentService.getAllBatiments();
    }

    @GetMapping("/buildings/{id}")
    public BatimentDto getBuildingById(@PathVariable Long id) {
        return batimentService.getBatimentById(id);
    }

    @PostMapping("/buildings")
    public BatimentDto createBuilding(@RequestBody BatimentDto dto) {
        return batimentService.createBatiment(dto);
    }

    @PutMapping("/buildings/{id}")
    public BatimentDto updateBuilding(@PathVariable Long id, @RequestBody BatimentDto dto) {
        return batimentService.updateBatiment(id, dto);
    }

    @DeleteMapping("/buildings/{id}")
    public void deleteBuilding(@PathVariable Long id) {
        batimentService.deleteBatiment(id);
    }

    // Gestion des capteurs
    @GetMapping("/sensors")
    public List<CapteurDto> getAllSensors() {
        return capteurService.getAllCapteurs();
    }

    @GetMapping("/sensors/{id}")
    public CapteurDto getSensorById(@PathVariable Long id) {
        return capteurService.getCapteurById(id);
    }

    @PostMapping("/sensors")
    public CapteurDto createSensor(@RequestBody CapteurDto dto) {
        return capteurService.createCapteur(dto);
    }

    @PutMapping("/sensors/{id}")
    public CapteurDto updateSensor(@PathVariable Long id, @RequestBody CapteurDto dto) {
        return capteurService.updateCapteur(id, dto);
    }

    @DeleteMapping("/sensors/{id}")
    public void deleteSensor(@PathVariable Long id) {
        capteurService.deleteCapteur(id);
    }

    @GetMapping("/sensors/batiment/{batimentId}")
    public List<CapteurDto> getSensorsByBatiment(@PathVariable Long batimentId) {
        return capteurService.getCapteursByBatiment(batimentId);
    }

    // Configuration des seuils
    @PostMapping("/thresholds")
    public Map<String, String> configureThresholds(@RequestBody Map<String, Object> thresholds) {
        // TODO: Implémenter la logique de configuration des seuils
        return Map.of("message", "Seuils configurés avec succès");
    }

    @GetMapping("/thresholds")
    public Map<String, Object> getThresholds() {
        // TODO: Implémenter la récupération des seuils
        return Map.of("thresholds", "Configuration actuelle");
    }
}
