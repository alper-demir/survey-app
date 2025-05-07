package com.example.survey_app.service;

import com.example.survey_app.dto.ErrorResponse;
import com.example.survey_app.dto.LoginRequestDto;
import com.example.survey_app.dto.LoginResponse;
import com.example.survey_app.entity.User;
import com.example.survey_app.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public ResponseEntity<?> login(LoginRequestDto request) {

        Optional<User> user = userRepository.findByEmail(request.getEmail());

        if (user.isEmpty()) {
            return ResponseEntity.status(401).body(new ErrorResponse("Kullanıcı kaydı bulunamadı", 401));
        }

        // Compare passwords

        if (!user.get().getPassword().matches(request.getPassword())) {
            // Password compare valid
            return ResponseEntity.status(401).body(new ErrorResponse("Şifre yanlış", 401));
        }

        System.out.println(user);

        return ResponseEntity.ok(new LoginResponse(user.get()));
    }
}
