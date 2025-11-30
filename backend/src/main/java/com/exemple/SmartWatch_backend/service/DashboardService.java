package com.exemple.SmartWatch_backend.service;

import com.exemple.SmartWatch_backend.entity.Alert;
import com.exemple.SmartWatch_backend.entity.Consumption;
import com.exemple.SmartWatch_backend.entity.SensorData;
import com.exemple.SmartWatch_backend.repository.AlertRepository;
import com.exemple.SmartWatch_backend.repository.ConsumptionRepository;
import com.exemple.SmartWatch_backend.repository.SensorDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final AlertRepository alertRepository;
    private final ConsumptionRepository consumptionRepository;
    private final SensorDataRepository sensorDataRepository;

    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("activeAlerts", alertRepository.findByResolvedFalse().size());
        stats.put("totalSensors", sensorDataRepository.count());
        // Add more stats as needed
        return stats;
    }

    public List<Alert> getActiveAlerts() {
        return alertRepository.findByResolvedFalse();
    }

    public List<Consumption> getRecentConsumption() {
        return consumptionRepository.findTop10ByOrderByTimestampDesc();
    }

    public List<SensorData> getRecentSensorData() {
        return sensorDataRepository.findTop10ByOrderByTimestampDesc();
    }
}
