package com.exemple.SmartWatch_backend.service;


import com.exemple.SmartWatch_backend.model.UtilisateurDto;

import java.util.List;

public interface UtilisateurService {

    UtilisateurDto createUtilisateur(UtilisateurDto dto);

    List<UtilisateurDto> getAllUtilisateurs();

    UtilisateurDto getUtilisateurById(Long id);

    UtilisateurDto updateUtilisateur(Long id, UtilisateurDto dto);

    void deleteUtilisateur(Long id);
}