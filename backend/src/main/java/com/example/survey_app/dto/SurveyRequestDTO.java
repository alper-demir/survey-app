package com.example.survey_app.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class SurveyRequestDTO {
    private String title;
    private String description;
    private LocalDateTime expiresAt;
    private boolean publicResult;
    private List<String> options;
    private boolean isMultipleChoice;
}