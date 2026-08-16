package com.amittraders.leather.service;

import com.amittraders.leather.dto.LookupOptionRequest;
import com.amittraders.leather.dto.LookupOptionResponse;
import com.amittraders.leather.entity.LeatherType;
import com.amittraders.leather.exception.BadRequestException;
import com.amittraders.leather.exception.ResourceNotFoundException;
import com.amittraders.leather.mapper.EntityMapper;
import com.amittraders.leather.repository.LeatherTypeRepository;
import com.amittraders.leather.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LeatherTypeService {

    private final LeatherTypeRepository leatherTypeRepository;
    private final ProductRepository productRepository;

    public LeatherTypeService(LeatherTypeRepository leatherTypeRepository, ProductRepository productRepository) {
        this.leatherTypeRepository = leatherTypeRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<LookupOptionResponse> listActive() {
        return leatherTypeRepository.findByActiveTrueOrderByDisplayOrderAscNameAsc().stream()
                .map(EntityMapper::toLookupOptionResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<LookupOptionResponse> listAll() {
        return leatherTypeRepository.findAllByOrderByDisplayOrderAscNameAsc().stream()
                .map(EntityMapper::toLookupOptionResponse)
                .toList();
    }

    @Transactional
    public LookupOptionResponse create(LookupOptionRequest request) {
        String name = normalizeName(request.name());
        if (leatherTypeRepository.existsByNameIgnoreCase(name)) {
            throw new BadRequestException("Leather type already exists: " + name);
        }
        int order = request.displayOrder() != null
                ? request.displayOrder()
                : (int) leatherTypeRepository.count();
        LeatherType leatherType = LeatherType.builder()
                .name(name)
                .displayOrder(order)
                .active(request.active() == null || request.active())
                .build();
        return EntityMapper.toLookupOptionResponse(leatherTypeRepository.save(leatherType));
    }

    @Transactional
    public void delete(Long id) {
        LeatherType leatherType = findById(id);
        if (productRepository.countByLeatherTypeIgnoreCase(leatherType.getName()) > 0) {
            throw new BadRequestException(
                    "Cannot delete leather type used by products. Reassign products first.");
        }
        leatherTypeRepository.delete(leatherType);
    }

    private LeatherType findById(Long id) {
        return leatherTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leather type not found: " + id));
    }

    private String normalizeName(String name) {
        if (name == null || name.isBlank()) {
            throw new BadRequestException("Name is required");
        }
        return name.trim();
    }
}
