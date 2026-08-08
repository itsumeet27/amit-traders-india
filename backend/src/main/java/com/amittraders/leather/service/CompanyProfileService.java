package com.amittraders.leather.service;

import com.amittraders.leather.dto.CompanyProfileRequest;
import com.amittraders.leather.dto.CompanyProfileResponse;
import com.amittraders.leather.entity.CompanyProfile;
import com.amittraders.leather.exception.ResourceNotFoundException;
import com.amittraders.leather.mapper.EntityMapper;
import com.amittraders.leather.repository.CompanyProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CompanyProfileService {

    private final CompanyProfileRepository companyProfileRepository;

    public CompanyProfileService(CompanyProfileRepository companyProfileRepository) {
        this.companyProfileRepository = companyProfileRepository;
    }

    @Transactional(readOnly = true)
    public CompanyProfileResponse getProfile() {
        CompanyProfile profile = companyProfileRepository.findFirstByOrderByIdAsc()
                .orElseThrow(() -> new ResourceNotFoundException("Company profile not configured"));
        return EntityMapper.toCompanyProfileResponse(profile);
    }

    @Transactional
    public CompanyProfileResponse upsert(CompanyProfileRequest request) {
        CompanyProfile profile = companyProfileRepository.findFirstByOrderByIdAsc()
                .orElseGet(CompanyProfile::new);

        profile.setCompanyName(request.companyName());
        profile.setTagline(request.tagline());
        profile.setDescription(request.description());
        profile.setHistory(request.history());
        profile.setMission(request.mission());
        profile.setVision(request.vision());
        profile.setPhone(request.phone());
        profile.setEmail(request.email());
        profile.setAddress(request.address());
        profile.setCity(request.city());
        profile.setState(request.state());
        profile.setCountry(request.country());
        profile.setWebsite(request.website());
        profile.setLinkedin(request.linkedin());
        profile.setInstagram(request.instagram());
        profile.setHeroTitle(request.heroTitle());
        profile.setHeroSubtitle(request.heroSubtitle());
        profile.setHeroImageUrl(request.heroImageUrl());
        profile.setHeroCtaPrimary(request.heroCtaPrimary());
        profile.setHeroCtaSecondary(request.heroCtaSecondary());
        profile.setAboutImageUrl(request.aboutImageUrl());
        profile.setWhyChooseUsJson(request.whyChooseUsJson());
        profile.setManufacturingStepsJson(request.manufacturingStepsJson());
        profile.setCustomManufacturingTitle(request.customManufacturingTitle());
        profile.setCustomManufacturingDescription(request.customManufacturingDescription());
        profile.setCustomManufacturingFeaturesJson(request.customManufacturingFeaturesJson());
        profile.setCtaTitle(request.ctaTitle());
        profile.setCtaSubtitle(request.ctaSubtitle());

        return EntityMapper.toCompanyProfileResponse(companyProfileRepository.save(profile));
    }
}
