package com.example.survey_app.controller;

import com.example.survey_app.dto.MultiVoteRequestDTO;
import com.example.survey_app.service.VoteService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/votes")
@CrossOrigin
public class VoteController {
    private final VoteService voteService;

    public VoteController(VoteService voteService) {
        this.voteService = voteService;
    }

    @PostMapping("/{optionId}")
    public ResponseEntity<?> vote(@PathVariable Long optionId, HttpServletRequest request) {
        String ipAddress = getClientIp(request);
        voteService.vote(optionId, ipAddress);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/multi")
    public ResponseEntity<?> voteMultiple(@RequestBody MultiVoteRequestDTO request, HttpServletRequest httpRequest) {
        String ip = getClientIp(httpRequest);
        voteService.voteMultiple(request.getOptionIds(), ip);
        return ResponseEntity.ok().build();
    }

    // Bu metodu sınıfa ekle:
    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        } else {
            // Virgül varsa ilk IP genelde gerçek istemci IP'sidir
            ip = ip.split(",")[0].trim();
        }
        return ip;
    }
}