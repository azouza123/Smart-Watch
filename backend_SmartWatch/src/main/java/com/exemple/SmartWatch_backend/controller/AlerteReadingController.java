package com.exemple.SmartWatch_backend.controller;

import com.exemple.SmartWatch_backend.model.AlerteReadingDto;
import com.exemple.SmartWatch_backend.service.AlerteReadingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alertes")
@RequiredArgsConstructor
public class AlerteReadingController {

    private final AlerteReadingService alerteReadingService;

    @GetMapping("/{alerteId}/readings")
    public List<AlerteReadingDto> getReadings(@PathVariable Long alerteId) {
        return alerteReadingService.getReadingsByAlerte(alerteId);
    }

    @PostMapping("/{alerteId}/readings")
    public AlerteReadingDto addReading(@PathVariable Long alerteId,
                                       @RequestBody AlerteReadingDto dto) {
        return alerteReadingService.addReading(alerteId, dto);
    }
}