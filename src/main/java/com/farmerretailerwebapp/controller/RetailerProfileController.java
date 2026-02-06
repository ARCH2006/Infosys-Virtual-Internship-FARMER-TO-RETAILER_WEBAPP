package com.farmerretailerwebapp.controller;

import com.farmerretailerwebapp.entity.User;
import com.farmerretailerwebapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/retailer")
public class RetailerProfileController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile/{id}")
    public ResponseEntity<User> getProfile(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/profile/update")
    public ResponseEntity<?> updateProfile(@RequestBody User user) {
        userService.updateUser(user.getId(), user);
        return ResponseEntity.ok("Profile updated");
    }
    // Inside RetailersController.java
    @PutMapping("/settings/password")
    public ResponseEntity<?> changePassword(@RequestParam Long userId, @RequestParam String newPassword) {
        try {
            userService.updatePassword(userId, newPassword);
            return ResponseEntity.ok("Password updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating password: " + e.getMessage());
        }
    }
}