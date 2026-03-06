package com.exemple.SmartWatch_backend.model;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ObjectifDto {
    private Long id;
    private Integer objectifHebdo;
    private Integer objectifMensuel;
}