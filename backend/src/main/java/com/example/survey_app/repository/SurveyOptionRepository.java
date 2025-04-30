package com.example.survey_app.repository;

import com.example.survey_app.entity.SurveyOption;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SurveyOptionRepository extends JpaRepository<SurveyOption, Long> {
    List<SurveyOption> findBySurveyId(Long surveyId);
}