package com.exemple.SmartWatch_backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "administrateur")
@Data
@EqualsAndHashCode(callSuper = true)
public class Administrateur extends Utilisateur {
    // No specific fields in diagram, but inherits everything
}
