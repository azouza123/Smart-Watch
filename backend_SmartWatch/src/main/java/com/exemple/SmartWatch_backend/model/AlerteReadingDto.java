package com.exemple.SmartWatch_backend.model;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlerteReadingDto {
    private LocalDateTime time;
    private Double value;
}