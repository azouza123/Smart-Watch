package com.exemple.SmartWatch_backend.controller;

import com.exemple.SmartWatch_backend.model.UtilisateurDto;
import com.exemple.SmartWatch_backend.service.UtilisateurService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") // pour ton front React
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
}
