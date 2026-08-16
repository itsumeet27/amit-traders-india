package com.amittraders.leather.controller;

import com.amittraders.leather.dto.LookupOptionRequest;
import com.amittraders.leather.dto.LookupOptionResponse;
import com.amittraders.leather.service.LeatherTypeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/leather-types")
public class AdminLeatherTypeController {

    private final LeatherTypeService leatherTypeService;

    public AdminLeatherTypeController(LeatherTypeService leatherTypeService) {
        this.leatherTypeService = leatherTypeService;
    }

    @GetMapping
    public List<LookupOptionResponse> list() {
        return leatherTypeService.listAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LookupOptionResponse create(@Valid @RequestBody LookupOptionRequest request) {
        return leatherTypeService.create(request);
    }

    @DeleteMapping("/{id:\\d+}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        leatherTypeService.delete(id);
    }
}
