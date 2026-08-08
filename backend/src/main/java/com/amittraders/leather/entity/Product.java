package com.amittraders.leather.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private ProductCategory category;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(length = 500)
    private String shortDescription;

    @Column(length = 5000)
    private String description;

    private String material;
    private String leatherType;
    private String colors;
    private String dimensions;
    private String customization;
    private String branding;
    private String manufacturingInfo;

    @Builder.Default
    private int minimumOrderQuantity = 50;

    @Builder.Default
    private boolean featured = false;

    @Builder.Default
    private boolean active = true;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC")
    @Builder.Default
    private List<ProductImage> images = new ArrayList<>();

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private Instant updatedAt;

    public void addImage(ProductImage image) {
        images.add(image);
        image.setProduct(this);
    }

    public void clearImages() {
        images.forEach(img -> img.setProduct(null));
        images.clear();
    }
}
