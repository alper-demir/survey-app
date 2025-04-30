package com.example.survey_app.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class SurveyResponseDTO {
    private Long id;
    private String title;
    private String description;
    private String slug;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private boolean publicResult;
    private List<OptionDTO> options;
    private boolean isMultipleChoice;
}