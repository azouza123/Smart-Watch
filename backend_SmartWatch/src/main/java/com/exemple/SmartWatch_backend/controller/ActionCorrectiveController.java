package com.exemple.SmartWatch_backend.controller;

import com.exemple.SmartWatch_backend.model.ActionCorrectiveDto;
import com.exemple.SmartWatch_backend.service.ActionCorrectiveService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/actions")
@RequiredArgsConstructor
public class ActionCorrectiveController {

    private final ActionCorrectiveService service;

    @GetMapping
    public List<ActionCorrectiveDto> getAll() { return service.getAll(); }

    @PostMapping
    public ActionCorrectiveDto create(@RequestBody ActionCorrectiveDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public ActionCorrectiveDto update(@PathVariable Long id,
                                      @RequestBody ActionCorrectiveDto dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }
}