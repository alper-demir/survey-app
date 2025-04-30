package com.example.survey_app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SurveyAdminStatDTO {
    private Long id;
    private String title;
    private String slug;
    private long totalVotes;
    private boolean isPublicResult;
    private boolean isMultipleChoice;
    private boolean isActive;
    private String createdAt;
    private String expiresAt;
}