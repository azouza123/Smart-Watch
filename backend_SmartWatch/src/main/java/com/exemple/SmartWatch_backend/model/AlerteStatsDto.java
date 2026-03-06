package com.exemple.SmartWatch_backend.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlerteStatsDto {
    private long total;
    private long nbOpen;
    private long nbInProgress;
    private long nbResolved;
}