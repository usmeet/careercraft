package com.careercraft.controller;

import com.careercraft.dto.AuthResponse;
import com.careercraft.dto.LoginRequest;
import com.careercraft.dto.SignupRequest;
import com.careercraft.model.User;
import com.careercraft.service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest req,
                                                HttpSession session) {
        try {
            User user = userService.signup(req);
            session.setAttribute("userId", user.getId());
            session.setAttribute("userName", user.getName());
            return ResponseEntity.ok(new AuthResponse(true, "Account created", user.getName(), user.getEmail()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req,
                                               HttpSession session) {
        return userService.login(req.getEmail(), req.getPassword())
                .map(user -> {
                    session.setAttribute("userId", user.getId());
                    session.setAttribute("userName", user.getName());
                    return ResponseEntity.ok(new AuthResponse(true, "Logged in", user.getName(), user.getEmail()));
                })
                .orElse(ResponseEntity.status(401)
                        .body(new AuthResponse(false, "Invalid email or password.")));
    }

    @PostMapping("/logout")
    public ResponseEntity<AuthResponse> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(new AuthResponse(true, "Logged out"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body(new AuthResponse(false, "Not logged in"));
        }
        String name = (String) session.getAttribute("userName");
        return ResponseEntity.ok(Map.of("loggedIn", true, "name", name, "userId", userId));
    }
}
