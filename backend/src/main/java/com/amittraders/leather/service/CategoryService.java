package com.amittraders.leather.service;

import com.amittraders.leather.dto.BulkDeleteResponse;
import com.amittraders.leather.dto.CategoryRequest;
import com.amittraders.leather.dto.CategoryResponse;
import com.amittraders.leather.dto.ReorderRequest;
import com.amittraders.leather.entity.ProductCategory;
import com.amittraders.leather.exception.BadRequestException;
import com.amittraders.leather.exception.ResourceNotFoundException;
import com.amittraders.leather.mapper.EntityMapper;
import com.amittraders.leather.repository.ProductCategoryRepository;
import com.amittraders.leather.repository.ProductRepository;
import com.amittraders.leather.util.SlugUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {

    private final ProductCategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public CategoryService(ProductCategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> listActive() {
        return categoryRepository.findByActiveTrueOrderByDisplayOrderAsc().stream()
                .map(EntityMapper::toCategoryResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> listAll() {
        return categoryRepository.findAll().stream()
                .sorted((a, b) -> Integer.compare(a.getDisplayOrder(), b.getDisplayOrder()))
                .map(EntityMapper::toCategoryResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CategoryResponse getBySlug(String slug) {
        ProductCategory category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + slug));
        return EntityMapper.toCategoryResponse(category);
    }

    @Transactional(readOnly = true)
    public CategoryResponse getById(Long id) {
        return EntityMapper.toCategoryResponse(findById(id));
    }

    @Transactional
    public CategoryResponse create(CategoryRequest request) {
        String slug = resolveUniqueSlug(request.slug(), request.name(), null);
        ProductCategory category = ProductCategory.builder()
                .name(request.name().trim())
                .slug(slug)
                .description(request.description())
                .imageUrl(request.imageUrl())
                .displayOrder(request.displayOrder() != null ? request.displayOrder() : 0)
                .active(request.active() == null || request.active())
                .build();
        return EntityMapper.toCategoryResponse(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse update(Long id, CategoryRequest request) {
        ProductCategory category = findById(id);
        category.setName(request.name().trim());
        category.setSlug(resolveUniqueSlug(request.slug(), request.name(), id));
        category.setDescription(request.description());
        category.setImageUrl(request.imageUrl());
        if (request.displayOrder() != null) {
            category.setDisplayOrder(request.displayOrder());
        }
        if (request.active() != null) {
            category.setActive(request.active());
        }
        return EntityMapper.toCategoryResponse(categoryRepository.save(category));
    }

    @Transactional
    public void delete(Long id) {
        ProductCategory category = findById(id);
        if (productRepository.existsByCategoryId(id)) {
            throw new BadRequestException("Cannot delete category with linked products. Reassign or remove products first.");
        }
        categoryRepository.delete(category);
    }

    @Transactional
    public BulkDeleteResponse deleteBulk(List<Long> ids) {
        List<Long> deleted = new java.util.ArrayList<>();
        List<BulkDeleteResponse.FailedItem> failed = new java.util.ArrayList<>();
        for (Long id : ids) {
            try {
                if (!categoryRepository.existsById(id)) {
                    failed.add(new BulkDeleteResponse.FailedItem(id, "Category not found"));
                    continue;
                }
                if (productRepository.existsByCategoryId(id)) {
                    failed.add(new BulkDeleteResponse.FailedItem(
                            id, "Cannot delete category with linked products. Reassign or remove products first."));
                    continue;
                }
                categoryRepository.deleteById(id);
                deleted.add(id);
            } catch (Exception ex) {
                failed.add(new BulkDeleteResponse.FailedItem(
                        id, ex.getMessage() != null ? ex.getMessage() : "Delete failed"));
            }
        }
        return new BulkDeleteResponse(deleted.size(), deleted, failed);
    }

    @Transactional
    public void reorder(ReorderRequest request) {
        for (ReorderRequest.ReorderItem item : request.items()) {
            ProductCategory category = findById(item.id());
            category.setDisplayOrder(item.displayOrder());
            categoryRepository.save(category);
        }
    }

    private ProductCategory findById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));
    }

    private String resolveUniqueSlug(String requestedSlug, String name, Long excludeId) {
        String base = (requestedSlug != null && !requestedSlug.isBlank())
                ? SlugUtil.toSlug(requestedSlug)
                : SlugUtil.toSlug(name);
        if (base.isBlank()) {
            throw new BadRequestException("Unable to generate slug from name");
        }
        String candidate = base;
        int counter = 1;
        while (slugTaken(candidate, excludeId)) {
            candidate = base + "-" + counter++;
        }
        return candidate;
    }

    private boolean slugTaken(String slug, Long excludeId) {
        if (excludeId == null) {
            return categoryRepository.existsBySlug(slug);
        }
        return categoryRepository.existsBySlugAndIdNot(slug, excludeId);
    }
}
