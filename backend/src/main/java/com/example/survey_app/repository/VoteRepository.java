package com.example.survey_app.repository;

import com.example.survey_app.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    List<Vote> findBySurveyId(Long surveyId);

    boolean existsBySurveyIdAndVoterIdentifier(Long surveyId, String voterIdentifier);

    boolean existsByOptionIdAndVoterIdentifier(Long optionId, String voterIdentifier);

    // Tarihe göre oy sayıları → [ [ "2025-04-30", 15 ], [ "2025-05-01", 34 ], ... ]
    @Query("SELECT FUNCTION('TO_CHAR', v.votedAt, 'YYYY-MM-DD') AS d, COUNT(v) AS c " +
            "FROM Vote v GROUP BY FUNCTION('TO_CHAR', v.votedAt, 'YYYY-MM-DD') " +
            "ORDER BY d")
    List<Object[]> countVotesGroupedByDate();

    // Farklı IP/user identifier sayısı
    @Query("SELECT COUNT(DISTINCT v.voterIdentifier) FROM Vote v")
    long countDistinctVoterIdentifier();
}