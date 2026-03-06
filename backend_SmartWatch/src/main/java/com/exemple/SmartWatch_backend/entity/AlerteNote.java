package com.exemple.SmartWatch_backend.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlerteNote {
    private String author;
    private String text;
    private String time;
}