package com.example.survey_app.controller;

import com.example.survey_app.dto.AdminOverviewDTO;
import com.example.survey_app.dto.SurveyAdminStatDTO;
import com.example.survey_app.service.AdminService;
import com.example.survey_app.service.SurveyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {
    private final AdminService adminService;
    private final SurveyService surveyService;

    public AdminController(AdminService adminService, SurveyService surveyService) {
        this.adminService = adminService;
        this.surveyService = surveyService;
    }

    @GetMapping("/overview")
    public AdminOverviewDTO overview() {
        return adminService.getOverview();
    }

    @GetMapping("/surveys")
    public Page<SurveyAdminStatDTO> getSurveys(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) Boolean isMultipleChoice,
            @RequestParam(required = false) Boolean isPublicResult,
            @RequestParam(required = false) String title,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ?
                Sort.by(sortBy).ascending() :
                Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        return adminService.getSurveyStats(pageable, isActive, isMultipleChoice, isPublicResult, title);
    }

    @PatchMapping("/surveys/{id}/deactivate")
    public ResponseEntity<?> deactivateSurvey(@PathVariable Long id) {
        surveyService.setSurveyActiveStatus(id, false);
        return ResponseEntity.ok().build();
    }
}