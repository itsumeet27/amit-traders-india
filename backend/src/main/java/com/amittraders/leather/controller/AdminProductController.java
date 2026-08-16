package com.amittraders.leather.controller;

import com.amittraders.leather.dto.BulkDeleteResponse;
import com.amittraders.leather.dto.BulkIdsRequest;
import com.amittraders.leather.dto.PageResponse;
import com.amittraders.leather.dto.ProductImageRequest;
import com.amittraders.leather.dto.ProductPatchRequest;
import com.amittraders.leather.dto.ProductRequest;
import com.amittraders.leather.dto.ProductResponse;
import com.amittraders.leather.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {

    private final ProductService productService;

    public AdminProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public PageResponse<ProductResponse> list(
            @RequestParam(required = false) Long category,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) String leatherType,
            @RequestParam(required = false) String material,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return productService.searchAdmin(category, featured, active, leatherType, material, search, page, size);
    }

    @GetMapping("/{id}")
    public ProductResponse get(@PathVariable Long id) {
        return productService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponse create(@Valid @RequestBody ProductRequest request) {
        return productService.create(request);
    }

    @PutMapping("/{id}")
    public ProductResponse update(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return productService.update(id, request);
    }

    @PatchMapping("/{id}")
    public ProductResponse patch(@PathVariable Long id, @Valid @RequestBody ProductPatchRequest request) {
        return productService.patch(id, request);
    }

    @PutMapping("/{id}/images")
    public ProductResponse replaceImages(
            @PathVariable Long id,
            @Valid @RequestBody List<ProductImageRequest> images) {
        return productService.replaceImages(id, images);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        productService.delete(id);
    }

    @PostMapping("/bulk-delete")
    public BulkDeleteResponse bulkDelete(@Valid @RequestBody BulkIdsRequest request) {
        return productService.deleteBulk(request.ids());
    }
}
