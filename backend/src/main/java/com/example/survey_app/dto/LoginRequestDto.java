package com.example.survey_app.dto;

import lombok.Data;

@Data
public class LoginRequestDto {
    private String email;
    private String password;
}
