package com.exemple.SmartWatch_backend.service;

import com.exemple.SmartWatch_backend.model.DonneeConsommationDto;
import java.util.List;
import java.util.Map;

public interface DonneeConsommationService {
    DonneeConsommationDto add(DonneeConsommationDto dto);
    List<Map<String, Object>> getChartData(String periode);
    List<Map<String, Object>> getChartDataByBatiment(Long batimentId, String periode);
    List<Map<String, Object>> getComparisonData(String periode);
    List<Map<String, Object>> getComparisonDataByBatiment(Long batimentId, String periode);
}