package com.exemple.SmartWatch_backend.controller;

import com.exemple.SmartWatch_backend.model.CapteurDto;
import com.exemple.SmartWatch_backend.model.CapteurStatsDto;
import com.exemple.SmartWatch_backend.service.CapteurService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/capteurs")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CapteurController {

    private final CapteurService capteurService;

    // liste de tous les capteurs (pour les cartes)
    @GetMapping
    public List<CapteurDto> getAll() {
        return capteurService.getAllCapteurs();
    }

    // stats pour les cartes en haut
    @GetMapping("/stats")
    public CapteurStatsDto getStats() {
        return capteurService.getStats();
    }

    // capteurs d'un bâtiment
    @GetMapping("/batiment/{batimentId}")
    public List<CapteurDto> getByBatiment(@PathVariable Long batimentId) {
        return capteurService.getCapteursByBatiment(batimentId);
    }

    @GetMapping("/{id}")
    public CapteurDto getById(@PathVariable Long id) {
        return capteurService.getCapteurById(id);
    }

    @PostMapping
    public CapteurDto create(@RequestBody CapteurDto dto) {
        return capteurService.createCapteur(dto);
    }

    @PutMapping("/{id}")
    public CapteurDto update(@PathVariable Long id, @RequestBody CapteurDto dto) {
        return capteurService.updateCapteur(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        capteurService.deleteCapteur(id);
    }

    // bouton En ligne / Hors ligne
    @PutMapping("/{id}/etat")
    public CapteurDto changeEtat(@PathVariable Long id,
                                 @RequestParam("actif") boolean actif) {
        return capteurService.changeEtat(id, actif);
    }
}
