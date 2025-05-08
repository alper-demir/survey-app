package com.example.survey_app.service;

import com.example.survey_app.dto.ErrorResponse;
import com.example.survey_app.dto.LoginRequestDto;
import com.example.survey_app.dto.LoginResponse;
import com.example.survey_app.entity.User;
import com.example.survey_app.repository.UserRepository;
import com.example.survey_app.utils.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
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

        String token = jwtUtil.generateToken(user.get().getEmail(), String.valueOf(user.get().getId()));

        System.out.println(user + token);

        return ResponseEntity.ok(new LoginResponse(user.get(), token));
    }
}
