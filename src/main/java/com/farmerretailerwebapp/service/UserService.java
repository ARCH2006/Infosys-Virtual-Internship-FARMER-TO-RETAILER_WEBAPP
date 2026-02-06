package com.farmerretailerwebapp.service;

import com.farmerretailerwebapp.entity.User;
import com.farmerretailerwebapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void updateUser(Long id, User updatedUser) {
        User user = getUserById(id);
        user.setUsername(updatedUser.getUsername());
        user.setPhoneNumber(updatedUser.getPhoneNumber());

        userRepository.save(user);
    }

    public void updatePassword(Long id, String newPassword) {
        User user = getUserById(id);
        user.setPassword(newPassword); // Ideally use a PasswordEncoder here
        userRepository.save(user);
    }
}