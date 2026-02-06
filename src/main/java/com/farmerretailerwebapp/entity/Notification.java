package com.farmerretailerwebapp.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId; // Farmer or Admin ID
    private String title;
    private String message;
    private String type; // e.g., "ORDER", "FEEDBACK"
    private boolean isRead = false;
    private LocalDateTime createdAt = LocalDateTime.now();
    // Getters and Setters
}