package com.exemple.SmartWatch_backend.controller;

import com.exemple.SmartWatch_backend.model.ObjectifDto;
import com.exemple.SmartWatch_backend.service.ObjectifService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/objectifs")
@RequiredArgsConstructor
public class ObjectifController {

    private final ObjectifService objectifService;

    @GetMapping("/user/{userId}")
    public ObjectifDto getObjectif(@PathVariable Long userId) {
        return objectifService.getMyObjectif(userId);
    }

    @PutMapping("/user/{userId}")
    public ObjectifDto saveObjectif(@PathVariable Long userId,
                                    @RequestBody ObjectifDto dto) {
        return objectifService.saveMyObjectif(userId, dto);
    }
}