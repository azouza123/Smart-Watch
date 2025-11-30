package com.exemple.SmartWatch_backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "gestionnaire")
@Data
@EqualsAndHashCode(callSuper = true)
public class Gestionnaire extends Utilisateur {
    // No specific fields in diagram
}
