package com.exemple.SmartWatch_backend.service;

import com.exemple.SmartWatch_backend.model.AlerteDto;
import com.exemple.SmartWatch_backend.model.AlerteReadingDto;
import com.exemple.SmartWatch_backend.model.AlerteStatsDto;
import java.util.List;

public interface AlerteService {
    List<AlerteDto> getAll();
    List<AlerteDto> getByStatus(String status);
    AlerteDto getById(Long id);
    AlerteDto create(AlerteDto dto);
    AlerteDto updateStatut(Long id, String statut);
    AlerteDto updateAssignee(Long id, String assignee);
    AlerteDto addNote(Long id, String author, String text);
    void delete(Long id);
    AlerteStatsDto getStats();
    List<AlerteReadingDto> getReadings(Long alerteId); // ✅ NEW
}