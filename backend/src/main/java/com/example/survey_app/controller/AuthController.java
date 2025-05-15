package com.example.survey_app.controller;

import com.example.survey_app.dto.LoginRequestDto;
import com.example.survey_app.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/admin")
    public ResponseEntity<?> loginAdmin(@RequestBody LoginRequestDto request) {
        return authService.login(request);
    }

    @GetMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String tokenHeader) {
        // Authorization: Bearer <token>
        String token = tokenHeader.replace("Bearer ", "");
        boolean isValid = authService.validateToken(token);
        if (isValid) {
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "valid", true
            ));
        }
        return null;
    }
}