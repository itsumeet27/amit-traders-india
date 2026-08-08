package com.amittraders.leather.controller;

import com.amittraders.leather.dto.CompanyProfileResponse;
import com.amittraders.leather.service.CompanyProfileService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/company-profile")
public class CompanyProfileController {

    private final CompanyProfileService companyProfileService;

    public CompanyProfileController(CompanyProfileService companyProfileService) {
        this.companyProfileService = companyProfileService;
    }

    @GetMapping
    public CompanyProfileResponse get() {
        return companyProfileService.getProfile();
    }
}
