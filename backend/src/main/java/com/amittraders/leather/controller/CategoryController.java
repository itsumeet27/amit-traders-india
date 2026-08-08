package com.amittraders.leather.controller;

import com.amittraders.leather.dto.CategoryResponse;
import com.amittraders.leather.service.CategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<CategoryResponse> list() {
        return categoryService.listActive();
    }

    @GetMapping("/{slug}")
    public CategoryResponse get(@PathVariable String slug) {
        return categoryService.getBySlug(slug);
    }
}
