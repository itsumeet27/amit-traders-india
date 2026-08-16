package com.amittraders.leather.repository;

import com.amittraders.leather.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MaterialRepository extends JpaRepository<Material, Long> {

    List<Material> findByActiveTrueOrderByDisplayOrderAscNameAsc();

    List<Material> findAllByOrderByDisplayOrderAscNameAsc();

    Optional<Material> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);
}
