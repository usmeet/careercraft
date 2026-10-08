package com.careercraft.service;

import com.careercraft.dto.SignupRequest;
import com.careercraft.model.User;
import com.careercraft.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User signup(SignupRequest req) {
        String name = req.getName() != null ? req.getName().trim() : "Job Seeker";
        String email = req.getEmail() != null ? req.getEmail().trim().toLowerCase() : "";
        String rawPassword = req.getPassword() != null ? req.getPassword().trim() : "";

        if (email.isEmpty() || rawPassword.isEmpty()) {
            throw new IllegalArgumentException("Email and password cannot be empty.");
        }

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }

        String hashed = passwordEncoder.encode(rawPassword);
        User user = new User(name, email, hashed);
        return userRepository.save(user);
    }

    public Optional<User> login(String email, String password) {
        if (email == null || password == null) {
            return Optional.empty();
        }
        String normalizedEmail = email.trim().toLowerCase();
        String rawPassword = password.trim();

        return userRepository.findByEmail(normalizedEmail)
                .filter(u -> {
                    String stored = u.getPassword();
                    // Verify via BCrypt first, or plain-text as fallback
                    try {
                        if (passwordEncoder.matches(rawPassword, stored)) {
                            return true;
                        }
                    } catch (Exception ignored) {}
                    return stored != null && stored.equals(rawPassword);
                });
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
}
