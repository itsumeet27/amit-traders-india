package com.amittraders.leather.repository;

import com.amittraders.leather.entity.CompanyProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompanyProfileRepository extends JpaRepository<CompanyProfile, Long> {
    Optional<CompanyProfile> findFirstByOrderByIdAsc();
}
