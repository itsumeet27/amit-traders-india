package com.amittraders.leather.controller;

import com.amittraders.leather.dto.LookupOptionRequest;
import com.amittraders.leather.dto.LookupOptionResponse;
import com.amittraders.leather.service.MaterialService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/materials")
public class AdminMaterialController {

    private final MaterialService materialService;

    public AdminMaterialController(MaterialService materialService) {
        this.materialService = materialService;
    }

    @GetMapping
    public List<LookupOptionResponse> list() {
        return materialService.listAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LookupOptionResponse create(@Valid @RequestBody LookupOptionRequest request) {
        return materialService.create(request);
    }

    @DeleteMapping("/{id:\\d+}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        materialService.delete(id);
    }
}
