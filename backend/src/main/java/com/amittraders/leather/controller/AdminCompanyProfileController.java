package com.amittraders.leather.controller;

import com.amittraders.leather.dto.CompanyProfileRequest;
import com.amittraders.leather.dto.CompanyProfileResponse;
import com.amittraders.leather.service.CompanyProfileService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/company-profile")
public class AdminCompanyProfileController {

    private final CompanyProfileService companyProfileService;

    public AdminCompanyProfileController(CompanyProfileService companyProfileService) {
        this.companyProfileService = companyProfileService;
    }

    @GetMapping
    public CompanyProfileResponse get() {
        return companyProfileService.getProfile();
    }

    @PutMapping
    public CompanyProfileResponse update(@Valid @RequestBody CompanyProfileRequest request) {
        return companyProfileService.upsert(request);
    }
}
