package com.exemple.SmartWatch_backend.serviceImpl;

import com.exemple.SmartWatch_backend.entity.*;
import com.exemple.SmartWatch_backend.model.ActionCorrectiveDto;
import com.exemple.SmartWatch_backend.repository.ActionCorrectiveRepository;
import com.exemple.SmartWatch_backend.service.ActionCorrectiveService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActionCorrectiveServiceImpl implements ActionCorrectiveService {

    private final ActionCorrectiveRepository repository;

    @Override
    public List<ActionCorrectiveDto> getAll() {
        return repository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public ActionCorrectiveDto create(ActionCorrectiveDto dto) {
        return toDto(repository.save(toEntity(dto)));
    }

    @Override
    public ActionCorrectiveDto update(Long id, ActionCorrectiveDto dto) {
        ActionCorrective entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Action non trouvée"));
        entity.setTitle(dto.getTitle());
        entity.setType(dto.getType());
        entity.setStatus(dto.getStatus());
        entity.setPriority(dto.getPriority());
        entity.setAssignee(dto.getAssignee());
        entity.setDueDate(dto.getDueDate());
        entity.setRelatedAlerts(dto.getRelatedAlerts());
        entity.setDescription(dto.getDescription());
        return toDto(repository.save(entity));
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    private ActionCorrectiveDto toDto(ActionCorrective e) {
        return ActionCorrectiveDto.builder()
                .id(e.getId()).title(e.getTitle()).type(e.getType())
                .status(e.getStatus()).priority(e.getPriority())
                .assignee(e.getAssignee()).dueDate(e.getDueDate())
                .relatedAlerts(e.getRelatedAlerts()).description(e.getDescription())
                .build();
    }

    private ActionCorrective toEntity(ActionCorrectiveDto dto) {
        return ActionCorrective.builder()
                .id(dto.getId()).title(dto.getTitle()).type(dto.getType())
                .status(dto.getStatus()).priority(dto.getPriority())
                .assignee(dto.getAssignee()).dueDate(dto.getDueDate())
                .relatedAlerts(dto.getRelatedAlerts() != null ? dto.getRelatedAlerts() : 0)
                .description(dto.getDescription())
                .build();
    }
}