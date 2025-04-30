package com.example.survey_app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;

@Data
@AllArgsConstructor
public class AdminOverviewDTO {
    private long totalSurveys;           // Toplam anket sayısı
    private long activeSurveys;          // ExpiresAt > now
    private long closedSurveys;          // ExpiresAt < now
    private long totalVotes;             // Tüm oyların toplamı
    private long distinctVoters;         // Farklı oy veren sayısı
    private long publicSurveys;          // Public result = true
    private long multipleChoiceSurveys;  // multipleChoice = true
    private Map<String, Long> dailyVotes;// "YYYY-MM-DD" → oy sayısı
}