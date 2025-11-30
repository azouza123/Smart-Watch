package com.exemple.SmartWatch_backend.controller;

import com.exemple.SmartWatch_backend.entity.Alert;
import com.exemple.SmartWatch_backend.entity.Consumption;
import com.exemple.SmartWatch_backend.entity.SensorData;
import com.exemple.SmartWatch_backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        return dashboardService.getStats();
    }

    @GetMapping("/alerts")
    public List<Alert> getAlerts() {
        return dashboardService.getActiveAlerts();
    }

    @GetMapping("/consumption")
    public List<Consumption> getConsumption() {
        return dashboardService.getRecentConsumption();
    }

    @GetMapping("/sensors")
    public List<SensorData> getSensorData() {
        return dashboardService.getRecentSensorData();
    }
}
