package com.amittraders.leather.service;

import com.amittraders.leather.dto.LookupOptionRequest;
import com.amittraders.leather.dto.LookupOptionResponse;
import com.amittraders.leather.entity.Material;
import com.amittraders.leather.exception.BadRequestException;
import com.amittraders.leather.exception.ResourceNotFoundException;
import com.amittraders.leather.mapper.EntityMapper;
import com.amittraders.leather.repository.MaterialRepository;
import com.amittraders.leather.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final ProductRepository productRepository;

    public MaterialService(MaterialRepository materialRepository, ProductRepository productRepository) {
        this.materialRepository = materialRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<LookupOptionResponse> listActive() {
        return materialRepository.findByActiveTrueOrderByDisplayOrderAscNameAsc().stream()
                .map(EntityMapper::toLookupOptionResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<LookupOptionResponse> listAll() {
        return materialRepository.findAllByOrderByDisplayOrderAscNameAsc().stream()
                .map(EntityMapper::toLookupOptionResponse)
                .toList();
    }

    @Transactional
    public LookupOptionResponse create(LookupOptionRequest request) {
        String name = normalizeName(request.name());
        if (materialRepository.existsByNameIgnoreCase(name)) {
            throw new BadRequestException("Material already exists: " + name);
        }
        int order = request.displayOrder() != null
                ? request.displayOrder()
                : (int) materialRepository.count();
        Material material = Material.builder()
                .name(name)
                .displayOrder(order)
                .active(request.active() == null || request.active())
                .build();
        return EntityMapper.toLookupOptionResponse(materialRepository.save(material));
    }

    @Transactional
    public void delete(Long id) {
        Material material = findById(id);
        if (productRepository.countByMaterialIgnoreCase(material.getName()) > 0) {
            throw new BadRequestException("Cannot delete material used by products. Reassign products first.");
        }
        materialRepository.delete(material);
    }

    private Material findById(Long id) {
        return materialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Material not found: " + id));
    }

    private String normalizeName(String name) {
        if (name == null || name.isBlank()) {
            throw new BadRequestException("Name is required");
        }
        return name.trim();
    }
}
