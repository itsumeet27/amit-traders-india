package com.amittraders.leather.controller;

import com.amittraders.leather.dto.PageResponse;
import com.amittraders.leather.dto.ProductResponse;
import com.amittraders.leather.service.ProductService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public PageResponse<ProductResponse> list(
            @RequestParam(required = false) Long category,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return productService.searchPublic(category, featured, null, null, search, page, size);
    }

    @GetMapping("/{slugOrId}")
    public ProductResponse get(@PathVariable String slugOrId) {
        return productService.getBySlugOrId(slugOrId);
    }
}
