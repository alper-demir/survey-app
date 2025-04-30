package com.example.survey_app.dto;

import lombok.Data;

import java.util.List;

@Data
public class MultiVoteRequestDTO {
    private List<Long> optionIds;
}