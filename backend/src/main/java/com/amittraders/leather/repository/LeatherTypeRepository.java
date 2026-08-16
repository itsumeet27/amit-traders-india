package com.amittraders.leather.repository;

import com.amittraders.leather.entity.LeatherType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LeatherTypeRepository extends JpaRepository<LeatherType, Long> {

    List<LeatherType> findByActiveTrueOrderByDisplayOrderAscNameAsc();

    List<LeatherType> findAllByOrderByDisplayOrderAscNameAsc();

    Optional<LeatherType> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);
}
