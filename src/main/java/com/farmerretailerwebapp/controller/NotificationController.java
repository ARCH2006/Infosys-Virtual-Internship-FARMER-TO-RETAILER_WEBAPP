package com.farmerretailerwebapp.controller;

import com.farmerretailerwebapp.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getNotifications(@PathVariable Long userId) {
        // Assuming your service has a method to find notifications by user
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }
}