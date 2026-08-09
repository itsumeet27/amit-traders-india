package com.amittraders.leather.repository;

import com.amittraders.leather.entity.Product;
import com.amittraders.leather.entity.ProductCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySlug(String slug);

    List<Product> findByFeaturedTrueAndActiveTrueOrderByUpdatedAtDesc();

    Page<Product> findByActiveTrue(Pageable pageable);

    Page<Product> findByActiveTrueAndFeaturedTrue(Pageable pageable);

    Page<Product> findByActiveTrueAndCategory(ProductCategory category, Pageable pageable);

    Page<Product> findByActiveTrueAndCategoryAndFeaturedTrue(ProductCategory category, Pageable pageable);

    @Query("""
            SELECT p FROM Product p
            WHERE p.active = true
              AND (:categoryId IS NULL OR p.category.id = :categoryId)
              AND (:featured IS NULL OR p.featured = :featured)
              AND (
                    :search IS NULL OR :search = ''
                    OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(p.shortDescription) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(p.leatherType) LIKE LOWER(CONCAT('%', :search, '%'))
                  )
            """)
    Page<Product> searchActive(
            @Param("categoryId") Long categoryId,
            @Param("featured") Boolean featured,
            @Param("search") String search,
            Pageable pageable);

    @Query("""
            SELECT p FROM Product p
            WHERE (:categoryId IS NULL OR p.category.id = :categoryId)
              AND (:featured IS NULL OR p.featured = :featured)
              AND (:active IS NULL OR p.active = :active)
              AND (
                    :search IS NULL OR :search = ''
                    OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(p.shortDescription) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(p.leatherType) LIKE LOWER(CONCAT('%', :search, '%'))
                  )
            """)
    Page<Product> searchAdmin(
            @Param("categoryId") Long categoryId,
            @Param("featured") Boolean featured,
            @Param("active") Boolean active,
            @Param("search") String search,
            Pageable pageable);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);

    long countByCategoryId(Long categoryId);

    boolean existsByCategoryId(Long categoryId);

    long countByActiveTrue();

    long countByFeaturedTrueAndActiveTrue();
}
