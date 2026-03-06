package com.exemple.SmartWatch_backend.serviceImpl;

import com.exemple.SmartWatch_backend.entity.Objectif;
import com.exemple.SmartWatch_backend.entity.Utilisateur;
import com.exemple.SmartWatch_backend.model.ObjectifDto;
import com.exemple.SmartWatch_backend.repository.ObjectifRepository;
import com.exemple.SmartWatch_backend.repository.UtilisateurRepository;
import com.exemple.SmartWatch_backend.service.ObjectifService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ObjectifServiceImpl implements ObjectifService {

    private final ObjectifRepository objectifRepository;
    private final UtilisateurRepository utilisateurRepository;

    @Override
    public ObjectifDto getMyObjectif(Long utilisateurId) {
        return objectifRepository.findByUtilisateurId(utilisateurId)
                .map(o -> ObjectifDto.builder()
                        .id(o.getId())
                        .objectifHebdo(o.getObjectifHebdo())
                        .objectifMensuel(o.getObjectifMensuel())
                        .build())
                .orElse(ObjectifDto.builder()
                        .objectifHebdo(315)
                        .objectifMensuel(1260)
                        .build());
    }

    @Override
    public ObjectifDto saveMyObjectif(Long utilisateurId, ObjectifDto dto) {
        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Objectif objectif = objectifRepository
                .findByUtilisateurId(utilisateurId)
                .orElse(Objectif.builder().utilisateur(utilisateur).build());

        objectif.setObjectifHebdo(dto.getObjectifHebdo());
        objectif.setObjectifMensuel(dto.getObjectifMensuel());
        objectif.setUpdatedAt(LocalDateTime.now());

        Objectif saved = objectifRepository.save(objectif);

        return ObjectifDto.builder()
                .id(saved.getId())
                .objectifHebdo(saved.getObjectifHebdo())
                .objectifMensuel(saved.getObjectifMensuel())
                .build();
    }
}