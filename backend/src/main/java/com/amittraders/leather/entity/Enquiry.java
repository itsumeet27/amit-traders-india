package com.amittraders.leather.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@Entity
@Table(name = "enquiries")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    private String companyName;

    @Column(nullable = false)
    private String email;

    private String phone;
    private String country;
    private String city;
    private String website;

    /** EXISTING or CUSTOM */
    @Column(nullable = false)
    private String productType;

    private String productCategory;
    private String productName;

    @Column(nullable = false)
    private int quantity;

    private String leatherType;
    private String preferredColor;

    @Column(length = 2000)
    private String customizationRequirements;

    @Column(length = 2000)
    private String brandingRequirements;

    @Column(length = 2000)
    private String additionalRequirements;

    @Column(length = 5000)
    private String message;

    private String attachmentUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EnquiryStatus status = EnquiryStatus.NEW;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private Instant updatedAt;
}
