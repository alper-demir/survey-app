package com.example.survey_app.repository;

import com.example.survey_app.entity.Survey;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface SurveyRepository extends JpaRepository<Survey, Long> {
    Optional<Survey> findBySlug(String slug);

    Optional<Survey> findBySlugAndIsActiveTrue(String slug);

    boolean existsBySlug(String slug);

    Page<Survey> findAll(Pageable pageable);

    Page<Survey> findByIsPublicResult(Boolean isPublicResult, Pageable pageable);

    Page<Survey> findByIsMultipleChoice(Boolean isMultipleChoice, Pageable pageable);

    @Query("""
                    SELECT s FROM Survey s
                    WHERE (:isActive IS NULL OR s.isActive = :isActive)
                      AND (:isMultipleChoice IS NULL OR s.isMultipleChoice = :isMultipleChoice)
                      AND (:isPublicResult IS NULL OR s.isPublicResult = :isPublicResult)
                      AND (:title IS NULL OR LOWER(CAST(s.title AS string)) LIKE LOWER(CONCAT('%', CAST(:title AS string), '%')))
                      AND (:isExpired IS NULL OR 
                           (:isExpired = true AND s.expiresAt < :now) OR 
                           (:isExpired = false AND s.expiresAt >= :now))
            """)
    Page<Survey> findWithFilters(@Param("isActive") Boolean isActive,
                                 @Param("isMultipleChoice") Boolean isMultipleChoice,
                                 @Param("isPublicResult") Boolean isPublicResult,
                                 @Param("title") String title,
                                 @Param("isExpired") Boolean isExpired,
                                 @Param("now") LocalDateTime now,
                                 Pageable pageable);

    // Admin istatistikleri için
    long countByExpiresAtAfter(LocalDateTime now);

    long countByExpiresAtBefore(LocalDateTime now);

    long countByIsPublicResultTrue();

    long countByIsMultipleChoiceTrue();

    // En son eklenen anket (opsiyonel)
    Optional<Survey> findFirstByOrderByCreatedAtDesc();
}