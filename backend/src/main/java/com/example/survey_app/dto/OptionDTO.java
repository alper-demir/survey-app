package com.example.survey_app.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OptionDTO {
    private String text;
    private int voteCount;
    private int position;
}