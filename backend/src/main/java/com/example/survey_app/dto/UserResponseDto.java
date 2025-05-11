package com.example.survey_app.dto;

import com.example.survey_app.entity.User;
import lombok.Data;

@Data
public class UserResponseDto {
    private Long id;
    private String email;
    private String role;

    public UserResponseDto(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.role = String.valueOf(user.getRole());
    }
}
