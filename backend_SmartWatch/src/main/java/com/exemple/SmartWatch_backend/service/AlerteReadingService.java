package com.exemple.SmartWatch_backend.service;

import com.exemple.SmartWatch_backend.model.AlerteReadingDto;
import java.util.List;

public interface AlerteReadingService {
    List<AlerteReadingDto> getReadingsByAlerte(Long alerteId);
    AlerteReadingDto addReading(Long alerteId, AlerteReadingDto dto);
}