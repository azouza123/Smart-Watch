package com.exemple.SmartWatch_backend.model;

import com.exemple.SmartWatch_backend.entity.*;
import lombok.*;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActionCorrectiveDto {
    private Long id;
    private String title;
    private TypeAction type;
    private StatutAction status;
    private PrioriteAction priority;
    private String assignee;
    private LocalDate dueDate;
    private Integer relatedAlerts;
    private String description;
}