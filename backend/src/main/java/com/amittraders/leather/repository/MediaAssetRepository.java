package com.amittraders.leather.repository;

import com.amittraders.leather.entity.MediaAsset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MediaAssetRepository extends JpaRepository<MediaAsset, Long> {
    List<MediaAsset> findAllByOrderByCreatedAtDesc();
    Optional<MediaAsset> findByFilename(String filename);
    Optional<MediaAsset> findByUrl(String url);
}
