package com.example.survey_app.dto;

import com.example.survey_app.entity.User;
import com.example.survey_app.enums.Role;
import lombok.Data;

@Data
public class LoginResponse {
    private UserResponseDto user;
    private String token;

    public LoginResponse(User user, String token) {
        this.user = new UserResponseDto(user);
        this.token = token;
    }
}
