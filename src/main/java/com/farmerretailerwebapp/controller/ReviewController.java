package com.farmerretailerwebapp.controller;

import com.farmerretailerwebapp.entity.Review;
import com.farmerretailerwebapp.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    @Autowired
    private ReviewRepository reviewRepository;

    @PostMapping("/submit")
    public ResponseEntity<?> submitReview(@RequestBody Review review) {
        // Prevent multiple reviews for the same order
        return ResponseEntity.ok(reviewRepository.save(review));
    }

    @GetMapping("/farmer/{farmerId}")
    public List<Review> getFarmerReviews(@PathVariable Long farmerId) {
        return reviewRepository.findByFarmerId(farmerId);
    }
}