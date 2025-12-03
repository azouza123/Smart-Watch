package com.exemple.SmartWatch_backend.controller;

import com.exemple.SmartWatch_backend.model.UtilisateurDto;
import com.exemple.SmartWatch_backend.model.UtilisateurStatsDto;
import com.exemple.SmartWatch_backend.service.UtilisateurService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UtilisateurController {

    private final UtilisateurService utilisateurService;

    @GetMapping
    public List<UtilisateurDto> getAll() {
        return utilisateurService.getAllUtilisateurs();
    }

    @GetMapping("/{id}")
    public UtilisateurDto getById(@PathVariable Long id) {
        return utilisateurService.getUtilisateurById(id);
    }

    @PostMapping
    public UtilisateurDto create(@RequestBody UtilisateurDto dto) {
        return utilisateurService.createUtilisateur(dto);
    }

    @PutMapping("/{id}")
    public UtilisateurDto update(@PathVariable Long id, @RequestBody UtilisateurDto dto) {
        return utilisateurService.updateUtilisateur(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        utilisateurService.deleteUtilisateur(id);
    }

    // 🔹 stats pour le dashboard
    @GetMapping("/stats")
    public UtilisateurStatsDto getStats() {
        return utilisateurService.getStats();
    }

    // 🔹 bloquer / débloquer un utilisateur
    @PutMapping("/{id}/status")
    public UtilisateurDto changeStatus(@PathVariable Long id,
                                       @RequestParam("actif") boolean actif) {
        return utilisateurService.changeStatut(id, actif);
    }
}
