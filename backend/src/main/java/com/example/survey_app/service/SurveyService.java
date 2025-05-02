package com.example.survey_app.service;

import com.example.survey_app.dto.OptionDTO;
import com.example.survey_app.dto.SurveyRequestDTO;
import com.example.survey_app.dto.SurveyResponseDTO;
import com.example.survey_app.entity.Survey;
import com.example.survey_app.entity.SurveyOption;
import com.example.survey_app.repository.SurveyOptionRepository;
import com.example.survey_app.repository.SurveyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SurveyService {

    private final SurveyRepository surveyRepository;
    private final SurveyOptionRepository optionRepository;

    public SurveyResponseDTO createSurvey(SurveyRequestDTO request) {
        // 1. Survey nesnesini oluştur
        Survey survey = new Survey();
        survey.setTitle(request.getTitle());
        survey.setDescription(request.getDescription());
        survey.setCreatedAt(LocalDateTime.now());
        survey.setExpiresAt(request.getExpiresAt());
        survey.setPublicResult(request.isPublicResult());
        survey.setMultipleChoice(request.isMultipleChoice());

        // 2. Slug üret ve ata
        String slug = generateSlug(request.getTitle());
        survey.setSlug(slug);

        // 3. Survey'i kaydet (ID elde etmek için)
        Survey savedSurvey = surveyRepository.save(survey);

        // 4. Seçenekleri oluştur ve ilişkilendir
        List<SurveyOption> options = request.getOptions().stream()
                .map(text -> {
                    SurveyOption opt = new SurveyOption();
                    opt.setText(text);
                    opt.setVoteCount(0);
                    opt.setSurvey(savedSurvey); // Survey'i ilişkilendir
                    return opt;
                })
                .collect(Collectors.toList());

        for (int i = 0; i < options.size(); i++) {
            options.get(i).setPosition(i + 1);
        }

        // Seçenekleri kaydet
        optionRepository.saveAll(options);

        // 5. DTO'ya dönüştür ve döndür
        return toDto(savedSurvey, options);
    }

    // ---------- yardımcı metodlar ----------
    private String generateSlug(String title) {
        String baseSlug = title.toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-|-$", "");

        String slug = baseSlug;
        int count = 1;

        while (surveyRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + count++;
        }
        return slug;
    }

    private SurveyResponseDTO toDto(Survey survey, List<SurveyOption> options) {
        List<OptionDTO> opts = options.stream()
                .map(o -> OptionDTO.builder()
                        .text(o.getText())
                        .voteCount(o.getVoteCount())
                        .build())
                .collect(Collectors.toList());

        // Survey'yi DTO'ya dönüştür
        return SurveyResponseDTO.builder()
                .id(survey.getId())
                .title(survey.getTitle())
                .description(survey.getDescription())
                .slug(survey.getSlug())
                .createdAt(survey.getCreatedAt())
                .expiresAt(survey.getExpiresAt())
                .publicResult(survey.isPublicResult())
                .isMultipleChoice(survey.isMultipleChoice())
                .options(opts)
                .build();
    }

    public List<Survey> getAllSurveys() {
        return surveyRepository.findAll();
    }

    public Survey getSurveyBySlug(String slug) {
        return surveyRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Anket bulunamadı: " + slug));
    }

    public void setSurveyActiveStatus(Long surveyId, boolean active) {
        Survey survey = surveyRepository.findById(surveyId)
                .orElseThrow(() -> new RuntimeException("Survey not found with id: " + surveyId));
        survey.setActive(active);
        surveyRepository.save(survey);
    }

    public void toggleSurveyActiveStatus(Long id) {
        Survey survey = surveyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Anket bulunamadı: " + id));
        survey.setActive(!survey.isActive());
        surveyRepository.save(survey);
    }

}