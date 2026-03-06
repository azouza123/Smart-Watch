package com.exemple.SmartWatch_backend.service;

import com.exemple.SmartWatch_backend.model.ActionCorrectiveDto;
import java.util.List;

public interface ActionCorrectiveService {
    List<ActionCorrectiveDto> getAll();
    ActionCorrectiveDto create(ActionCorrectiveDto dto);
    ActionCorrectiveDto update(Long id, ActionCorrectiveDto dto);
    void delete(Long id);
}