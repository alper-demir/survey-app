package com.example.survey_app.service;

import com.example.survey_app.dto.MultiVoteRequestDTO;
import com.example.survey_app.entity.Survey;
import com.example.survey_app.entity.SurveyOption;
import com.example.survey_app.entity.Vote;
import com.example.survey_app.repository.SurveyOptionRepository;
import com.example.survey_app.repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VoteService {
    private final VoteRepository voteRepository;
    private final SurveyOptionRepository optionRepository;

    public void vote(Long optionId, String voterIp) {
        SurveyOption option = optionRepository.findById(optionId)
                .orElseThrow(() -> new RuntimeException("Seçenek bulunamadı"));

        Long surveyId = option.getSurvey().getId();

        boolean alreadyVoted = voteRepository.existsBySurveyIdAndVoterIdentifier(surveyId, voterIp);
        if (alreadyVoted) {
            throw new RuntimeException("Bu IP adresiyle zaten oy verdiniz.");
        }

        // Oy kaydet
        Vote vote = new Vote();
        vote.setSurvey(option.getSurvey());
        vote.setOption(option);
        vote.setVoterIdentifier(voterIp); // IP adresini burada tutuyorsun
        vote.setVotedAt(LocalDateTime.now());

        voteRepository.save(vote);

        // Oy sayısını güncelle
        option.setVoteCount(option.getVoteCount() + 1);
        optionRepository.save(option);
    }

    public void voteMultiple(List<Long> optionIds, String voterIp) {
        if (optionIds == null || optionIds.isEmpty()) {
            throw new IllegalArgumentException("En az bir seçenek seçilmelidir.");
        }

        // İlk optionId ile ilgili Survey alınır
        Long firstOptionId = optionIds.get(0);
        Survey survey = optionRepository.findById(firstOptionId)
                .map(SurveyOption::getSurvey)
                .orElseThrow(() -> new RuntimeException("Anket bulunamadı"));

        if (!survey.isMultipleChoice()) {
            throw new IllegalStateException("Bu anket çoklu oylamaya izin vermiyor.");
        }

        for (Long optionId : optionIds) {
            if (voteRepository.existsByOptionIdAndVoterIdentifier(optionId, voterIp)) {
                throw new IllegalStateException("Bu IP adresi zaten bu seçeneğe oy verdi.");
            }

            SurveyOption option = optionRepository.findById(optionId)
                    .orElseThrow(() -> new RuntimeException("Seçenek bulunamadı"));

            option.setVoteCount(option.getVoteCount() + 1);
            optionRepository.save(option);

            Vote vote = new Vote();
            vote.setSurvey(option.getSurvey());
            vote.setOption(option);
            vote.setVoterIdentifier(voterIp);
            vote.setVotedAt(LocalDateTime.now());
            voteRepository.save(vote);
        }
    }


}
