package com.example.survey_app.controller;

import com.example.survey_app.dto.SurveyRequestDTO;
import com.example.survey_app.dto.SurveyResponseDTO;
import com.example.survey_app.entity.Survey;
import com.example.survey_app.service.SurveyService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/surveys")
@CrossOrigin
public class SurveyController {
    private final SurveyService surveyService;

    public SurveyController(SurveyService surveyService) {
        this.surveyService = surveyService;
    }

    @PostMapping
    public ResponseEntity<SurveyResponseDTO> createSurvey(@RequestBody SurveyRequestDTO request) {
        SurveyResponseDTO surveyResponse = surveyService.createSurvey(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(surveyResponse);
    }

    @GetMapping
    public Page<Survey> getAllSurveys(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "30") int size) {
        return surveyService.getAllSurveys(page, size);
    }

    @GetMapping("/{slug}")
    public Survey getSurveyBySlug(@PathVariable String slug) {
        return surveyService.getSurveyBySlug(slug);
    }

}