package com.example.survey_app.dto;

import com.example.survey_app.entity.User;
import com.example.survey_app.enums.Role;
import lombok.Data;

@Data
public class LoginResponse {
    private UserResponseDto user;
    private String jwt;

    public LoginResponse(User user) {
        this.user = new UserResponseDto(user);
        this.jwt = "token";
    }
}
