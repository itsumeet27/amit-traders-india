package com.amittraders.leather.service;

import com.amittraders.leather.dto.PageResponse;
import com.amittraders.leather.dto.ProductImageRequest;
import com.amittraders.leather.dto.ProductPatchRequest;
import com.amittraders.leather.dto.ProductRequest;
import com.amittraders.leather.dto.ProductResponse;
import com.amittraders.leather.dto.BulkDeleteResponse;
import com.amittraders.leather.entity.Product;
import com.amittraders.leather.entity.ProductCategory;
import com.amittraders.leather.entity.ProductImage;
import com.amittraders.leather.exception.BadRequestException;
import com.amittraders.leather.exception.ResourceNotFoundException;
import com.amittraders.leather.mapper.EntityMapper;
import com.amittraders.leather.repository.ProductCategoryRepository;
import com.amittraders.leather.repository.ProductRepository;
import com.amittraders.leather.util.SlugUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductCategoryRepository categoryRepository;
    private final int minQuantity;

    public ProductService(
            ProductRepository productRepository,
            ProductCategoryRepository categoryRepository,
            @Value("${app.enquiry.min-quantity:50}") int minQuantity) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.minQuantity = minQuantity;
    }

    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> searchPublic(
            Long categoryId, Boolean featured, String leatherType, String material, String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "name"));
        Page<ProductResponse> result = productRepository
                .searchActive(categoryId, featured, blankToNull(leatherType), blankToNull(material), blankToNull(search), pageable)
                .map(EntityMapper::toProductResponse);
        return PageResponse.from(result);
    }

    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> searchAdmin(
            Long categoryId,
            Boolean featured,
            Boolean active,
            String leatherType,
            String material,
            String search,
            int page,
            int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "updatedAt"));
        Page<ProductResponse> result = productRepository
                .searchAdmin(
                        categoryId,
                        featured,
                        active,
                        blankToNull(leatherType),
                        blankToNull(material),
                        blankToNull(search),
                        pageable)
                .map(EntityMapper::toProductResponse);
        return PageResponse.from(result);
    }

    @Transactional(readOnly = true)
    public ProductResponse getBySlugOrId(String slugOrId) {
        Product product;
        if (slugOrId.matches("\\d+")) {
            product = productRepository.findById(Long.parseLong(slugOrId))
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + slugOrId));
        } else {
            product = productRepository.findBySlug(slugOrId)
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + slugOrId));
        }
        return EntityMapper.toProductResponse(product);
    }

    @Transactional(readOnly = true)
    public ProductResponse getById(Long id) {
        return EntityMapper.toProductResponse(findById(id));
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        int moq = request.minimumOrderQuantity() != null ? request.minimumOrderQuantity() : minQuantity;
        enforceMoq(moq);

        ProductCategory category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + request.categoryId()));

        Product product = Product.builder()
                .category(category)
                .name(request.name().trim())
                .slug(resolveUniqueSlug(request.slug(), request.name(), null))
                .shortDescription(request.shortDescription())
                .description(request.description())
                .material(request.material())
                .leatherType(request.leatherType())
                .colors(request.colors())
                .dimensions(request.dimensions())
                .customization(request.customization())
                .branding(request.branding())
                .manufacturingInfo(request.manufacturingInfo())
                .minimumOrderQuantity(moq)
                .featured(Boolean.TRUE.equals(request.featured()))
                .active(request.active() == null || request.active())
                .build();

        applyImages(product, request.images());
        return EntityMapper.toProductResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = findById(id);
        int moq = request.minimumOrderQuantity() != null ? request.minimumOrderQuantity() : product.getMinimumOrderQuantity();
        enforceMoq(moq);

        ProductCategory category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + request.categoryId()));

        product.setCategory(category);
        product.setName(request.name().trim());
        product.setSlug(resolveUniqueSlug(request.slug(), request.name(), id));
        product.setShortDescription(request.shortDescription());
        product.setDescription(request.description());
        product.setMaterial(request.material());
        product.setLeatherType(request.leatherType());
        product.setColors(request.colors());
        product.setDimensions(request.dimensions());
        product.setCustomization(request.customization());
        product.setBranding(request.branding());
        product.setManufacturingInfo(request.manufacturingInfo());
        product.setMinimumOrderQuantity(moq);
        if (request.featured() != null) {
            product.setFeatured(request.featured());
        }
        if (request.active() != null) {
            product.setActive(request.active());
        }
        if (request.images() != null) {
            product.clearImages();
            applyImages(product, request.images());
        }

        return EntityMapper.toProductResponse(productRepository.save(product));
    }

    @Transactional
    public void delete(Long id) {
        productRepository.delete(findById(id));
    }

    @Transactional
    public BulkDeleteResponse deleteBulk(List<Long> ids) {
        List<Long> deleted = new java.util.ArrayList<>();
        List<BulkDeleteResponse.FailedItem> failed = new java.util.ArrayList<>();
        for (Long id : ids) {
            try {
                if (!productRepository.existsById(id)) {
                    failed.add(new BulkDeleteResponse.FailedItem(id, "Product not found"));
                    continue;
                }
                productRepository.deleteById(id);
                deleted.add(id);
            } catch (Exception ex) {
                failed.add(new BulkDeleteResponse.FailedItem(id, ex.getMessage() != null ? ex.getMessage() : "Delete failed"));
            }
        }
        return new BulkDeleteResponse(deleted.size(), deleted, failed);
    }

    @Transactional
    public ProductResponse replaceImages(Long id, List<ProductImageRequest> images) {
        Product product = findById(id);
        product.clearImages();
        applyImages(product, images);
        return EntityMapper.toProductResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse patch(Long id, ProductPatchRequest request) {
        Product product = findById(id);
        if (request.featured() != null) {
            product.setFeatured(request.featured());
        }
        if (request.active() != null) {
            product.setActive(request.active());
        }
        return EntityMapper.toProductResponse(productRepository.save(product));
    }

    private void applyImages(Product product, List<ProductImageRequest> images) {
        if (images == null) {
            return;
        }
        int order = 0;
        for (ProductImageRequest imageRequest : images) {
            ProductImage image = ProductImage.builder()
                    .imageUrl(imageRequest.imageUrl())
                    .altText(imageRequest.altText())
                    .displayOrder(imageRequest.displayOrder() != null ? imageRequest.displayOrder() : order)
                    .build();
            product.addImage(image);
            order++;
        }
    }

    private void enforceMoq(int moq) {
        if (moq < minQuantity) {
            throw new BadRequestException("Minimum order quantity must be at least " + minQuantity);
        }
    }

    private Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
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
            return productRepository.existsBySlug(slug);
        }
        return productRepository.existsBySlugAndIdNot(slug, excludeId);
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
