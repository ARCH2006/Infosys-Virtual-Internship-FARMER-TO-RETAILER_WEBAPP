package com.farmerretailerwebapp.controller;

import com.farmerretailerwebapp.dto.AuthRequest;
import com.farmerretailerwebapp.dto.LoginResponse;
import com.farmerretailerwebapp.entity.User;
import com.farmerretailerwebapp.repository.UserRepository;
import com.farmerretailerwebapp.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest auth) {
        User user = userRepository.findByEmail(auth.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (!user.getPassword().equals(auth.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        String role = user.getRole().toUpperCase();
        String redirectPath;

        // Simplified logic: Direct dashboard access based on role
        switch (role) {
            case "FARMER":
                redirectPath = "/farmer/dashboard";
                break;
            case "ADMIN":
                redirectPath = "/admin/dashboard";
                break;
            case "RETAILER":
                redirectPath = "/retailer/dashboard";
                break;
            default:
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown role");
        }

        return ResponseEntity.ok(new LoginResponse(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                role,
                true,          // verified is now always true for login
                redirectPath,
                true           // hasUploadedDocs is ignored but kept for DTO compatibility
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(
                    Map.of("success", false, "message", "Email already exists")
            );
        }

        // Auto-verify user on registration
        user.setVerified(true);
        User savedUser = userRepository.save(user);

        // Send Simple Welcome Email
        try {
            emailService.sendEmail(
                    savedUser.getEmail(),
                    "Welcome to Agri-Hub!",
                    "Hello " + savedUser.getUsername() + ",\nYour account as a " +
                            savedUser.getRole() + " has been created. You can now log in."
            );
        } catch (Exception e) {
            System.err.println("Email failed: " + e.getMessage());
        }

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Registration successful",
                "userId", savedUser.getId(),
                "role", savedUser.getRole()
        ));
    }

    @GetMapping("/check-email/{email}")
    public ResponseEntity<?> checkEmail(@PathVariable String email) {
        boolean exists = userRepository.findByEmail(email).isPresent();
        return ResponseEntity.ok(Map.of("exists", exists));
    }
}