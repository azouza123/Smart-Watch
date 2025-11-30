package com.exemple.SmartWatch_backend.controller;

import com.exemple.SmartWatch_backend.model.BatimentDto;
import com.exemple.SmartWatch_backend.service.BatimentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/batiments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class BatimentController {

    private final BatimentService batimentService;

    @GetMapping
    public List<BatimentDto> getAll() {
        return batimentService.getAllBatiments();
    }

    @GetMapping("/{id}")
    public BatimentDto getById(@PathVariable Long id) {
        return batimentService.getBatimentById(id);
    }

    @PostMapping
    public BatimentDto create(@RequestBody BatimentDto dto) {
        return batimentService.createBatiment(dto);
    }

    @PutMapping("/{id}")
    public BatimentDto update(@PathVariable Long id, @RequestBody BatimentDto dto) {
        return batimentService.updateBatiment(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        batimentService.deleteBatiment(id);
    }
}
