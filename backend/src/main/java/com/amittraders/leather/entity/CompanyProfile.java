package com.amittraders.leather.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@Entity
@Table(name = "company_profiles")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;
    private String tagline;

    @Column(length = 5000)
    private String description;

    @Column(columnDefinition = "TEXT")
    private String history;

    private String storyHeadline;

    private String missionHeadline;

    @Column(columnDefinition = "TEXT")
    private String mission;

    @Column(columnDefinition = "TEXT")
    private String missionCommitmentsJson;

    @Column(columnDefinition = "TEXT")
    private String missionClosing;

    private String visionHeadline;

    @Column(columnDefinition = "TEXT")
    private String vision;

    private String aboutHeroTitle;

    private String aboutHeroSubtitle;

    @Column(columnDefinition = "TEXT")
    private String aboutValuesJson;

    private String aboutPromiseHeadline;

    @Column(columnDefinition = "TEXT")
    private String aboutPromiseBody;

    @Column(columnDefinition = "TEXT")
    private String aboutPromiseClosing;

    private String phone;
    private String email;
    private String address;
    private String city;
    private String state;
    private String country;
    private String website;
    private String linkedin;
    private String instagram;

    private String heroTitle;
    private String heroSubtitle;
    private String heroImageUrl;
    private String heroCtaPrimary;
    private String heroCtaSecondary;
    private String aboutImageUrl;

    @Column(columnDefinition = "TEXT")
    private String whyChooseUsJson;

    @Column(columnDefinition = "TEXT")
    private String manufacturingStepsJson;

    private String customManufacturingTitle;

    @Column(length = 2000)
    private String customManufacturingDescription;

    @Column(columnDefinition = "TEXT")
    private String customManufacturingFeaturesJson;

    private String ctaTitle;
    private String ctaSubtitle;

    @LastModifiedDate
    @Column(nullable = false)
    private Instant updatedAt;
}
