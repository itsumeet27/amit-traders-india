package com.amittraders.leather.config;

import com.amittraders.leather.entity.LeatherType;
import com.amittraders.leather.entity.Material;
import com.amittraders.leather.entity.Product;
import com.amittraders.leather.repository.LeatherTypeRepository;
import com.amittraders.leather.repository.MaterialRepository;
import com.amittraders.leather.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Component
public class LookupOptionBootstrap implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(LookupOptionBootstrap.class);

    private final LeatherTypeRepository leatherTypeRepository;
    private final MaterialRepository materialRepository;
    private final ProductRepository productRepository;

    public LookupOptionBootstrap(
            LeatherTypeRepository leatherTypeRepository,
            MaterialRepository materialRepository,
            ProductRepository productRepository) {
        this.leatherTypeRepository = leatherTypeRepository;
        this.materialRepository = materialRepository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        bootstrapLeatherTypes();
        bootstrapMaterials();
    }

    private void bootstrapLeatherTypes() {
        if (leatherTypeRepository.count() > 0) {
            return;
        }
        Set<String> names = new LinkedHashSet<>(List.of("NDM", "Sheep Napa", "Full-grain", "Top-grain"));
        for (Product product : productRepository.findAll()) {
            if (product.getLeatherType() != null && !product.getLeatherType().isBlank()) {
                names.add(product.getLeatherType().trim());
            }
        }
        int order = 0;
        for (String name : names) {
            leatherTypeRepository.save(LeatherType.builder()
                    .name(name)
                    .displayOrder(order++)
                    .active(true)
                    .build());
        }
        log.info("Bootstrapped {} leather types", names.size());
    }

    private void bootstrapMaterials() {
        if (materialRepository.count() > 0) {
            return;
        }
        Set<String> names = new LinkedHashSet<>(List.of("Leather", "Genuine Leather"));
        for (Product product : productRepository.findAll()) {
            if (product.getMaterial() != null && !product.getMaterial().isBlank()) {
                names.add(product.getMaterial().trim());
            }
        }
        int order = 0;
        for (String name : names) {
            materialRepository.save(Material.builder()
                    .name(name)
                    .displayOrder(order++)
                    .active(true)
                    .build());
        }
        log.info("Bootstrapped {} materials", names.size());
    }
}
