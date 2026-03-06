package com.exemple.SmartWatch_backend.controller;

import com.exemple.SmartWatch_backend.model.AlerteDto;
import com.exemple.SmartWatch_backend.model.AlerteReadingDto;
import com.exemple.SmartWatch_backend.model.AlerteStatsDto;
import com.exemple.SmartWatch_backend.service.AlerteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alertes")
@RequiredArgsConstructor
public class AlerteController {

    private final AlerteService alerteService;

    @GetMapping
    public List<AlerteDto> getAll() { return alerteService.getAll(); }

    @GetMapping("/stats")
    public AlerteStatsDto getStats() { return alerteService.getStats(); }

    @GetMapping("/status/{status}")
    public List<AlerteDto> getByStatus(@PathVariable String status) { return alerteService.getByStatus(status); }

    @GetMapping("/{id}")
    public AlerteDto getById(@PathVariable Long id) { return alerteService.getById(id); }

    @PostMapping
    public AlerteDto create(@RequestBody AlerteDto dto) { return alerteService.create(dto); }

    @PutMapping("/{id}/statut")
    public AlerteDto updateStatut(@PathVariable Long id, @RequestParam String statut) { return alerteService.updateStatut(id, statut); }

    @PutMapping("/{id}/assignee")
    public AlerteDto updateAssignee(@PathVariable Long id, @RequestParam String assignee) { return alerteService.updateAssignee(id, assignee); }

    @PostMapping("/{id}/notes")
    public AlerteDto addNote(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return alerteService.addNote(id, body.get("author"), body.get("text"));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { alerteService.delete(id); }

    @GetMapping("/{id}/readings") // ✅ NEW
    public List<AlerteReadingDto> getReadings(@PathVariable Long id) { return alerteService.getReadings(id); }
}