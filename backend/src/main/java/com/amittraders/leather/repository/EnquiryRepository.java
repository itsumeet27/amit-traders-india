package com.amittraders.leather.repository;

import com.amittraders.leather.entity.Enquiry;
import com.amittraders.leather.entity.EnquiryStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {

    Page<Enquiry> findByStatus(EnquiryStatus status, Pageable pageable);

    @Query("""
            SELECT e FROM Enquiry e
            WHERE (:status IS NULL OR e.status = :status)
              AND (
                    :search IS NULL OR :search = ''
                    OR LOWER(e.fullName) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(e.companyName) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(e.email) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(e.productName) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(e.productCategory) LIKE LOWER(CONCAT('%', :search, '%'))
                  )
            """)
    Page<Enquiry> search(
            @Param("status") EnquiryStatus status,
            @Param("search") String search,
            Pageable pageable);

    long countByStatus(EnquiryStatus status);
}
