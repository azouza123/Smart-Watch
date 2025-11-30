package com.exemple.SmartWatch_backend.service;

import com.exemple.SmartWatch_backend.model.BatimentDto;

import java.util.List;

public interface BatimentService {

    BatimentDto createBatiment(BatimentDto dto);

    List<BatimentDto> getAllBatiments();

    BatimentDto getBatimentById(Long id);

    BatimentDto updateBatiment(Long id, BatimentDto dto);

    void deleteBatiment(Long id);
}
