package com.example.survey_app.service;

import com.example.survey_app.dto.AdminOverviewDTO;
import com.example.survey_app.dto.SurveyAdminStatDTO;
import com.example.survey_app.entity.Survey;
import com.example.survey_app.entity.SurveyOption;
import com.example.survey_app.repository.SurveyRepository;
import com.example.survey_app.repository.VoteRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {
    private final SurveyRepository surveyRepo;
    private final VoteRepository voteRepo;

    public AdminService(SurveyRepository surveyRepo, VoteRepository voteRepo) {
        this.surveyRepo = surveyRepo;
        this.voteRepo = voteRepo;
    }

    public AdminOverviewDTO getOverview() {
        LocalDateTime now = LocalDateTime.now();

        long totalSurveys = surveyRepo.count();
        long activeSurveys = surveyRepo.countByExpiresAtAfter(now);
        long closedSurveys = surveyRepo.countByExpiresAtBefore(now);
        long totalVotes = voteRepo.count();
        long distinctVoters = voteRepo.countDistinctVoterIdentifier();
        long publicSurveys = surveyRepo.countByIsPublicResultTrue();
        long multipleChoiceSurveys = surveyRepo.countByIsMultipleChoiceTrue();

        List<Object[]> rows = voteRepo.countVotesGroupedByDate();
        Map<String, Long> dailyVotes = rows.stream()
                .collect(Collectors.toMap(
                        r -> (String) r[0],
                        r -> ((Number) r[1]).longValue()
                ));

        return new AdminOverviewDTO(
                totalSurveys,
                activeSurveys,
                closedSurveys,
                totalVotes,
                distinctVoters,
                publicSurveys,
                multipleChoiceSurveys,
                dailyVotes
        );
    }

    public Page<SurveyAdminStatDTO> getSurveyStats(Pageable pageable,
                                                   Boolean isActive,
                                                   Boolean isExpired,
                                                   Boolean isMultipleChoice,
                                                   Boolean isPublicResult,
                                                   String title) {
        if (title == null || title.trim().isEmpty()) {
            title = null;
        }

        LocalDateTime now = LocalDateTime.now();

        Page<Survey> surveyPage = surveyRepo.findWithFilters(isActive, isMultipleChoice, isPublicResult, title, isExpired, now, pageable);

        // Anketleri SurveyAdminStatDTO'ya dönüştür
        List<SurveyAdminStatDTO> surveyStats = surveyPage.getContent().stream()
                .filter(s -> s.getExpiresAt() != null) // expiresAt null olanları filtrele
                .map(s -> {
                    long votes = s.getOptions().stream()
                            .mapToLong(SurveyOption::getVoteCount)
                            .sum();

                    return new SurveyAdminStatDTO(
                            s.getId(),
                            s.getTitle(),
                            s.getSlug(),
                            votes,
                            s.isPublicResult(),
                            s.isMultipleChoice(),
                            s.isActive(),
                            s.getCreatedAt().toString(),
                            s.getExpiresAt() != null ? s.getExpiresAt().toString() : null
                    );
                })
                .collect(Collectors.toList());

        return new PageImpl<>(surveyStats, pageable, surveyPage.getTotalElements());
    }
}