package com.exemple.SmartWatch_backend.service;

import com.exemple.SmartWatch_backend.model.ObjectifDto;

public interface ObjectifService {
    ObjectifDto getMyObjectif(Long utilisateurId);
    ObjectifDto saveMyObjectif(Long utilisateurId, ObjectifDto dto);
}