package com.farmerretailerwebapp.controller;

import com.farmerretailerwebapp.entity.Feedback;
import com.farmerretailerwebapp.entity.Order;
import com.farmerretailerwebapp.entity.Product;
import com.farmerretailerwebapp.repository.FeedbackRepository;
import com.farmerretailerwebapp.repository.OrderRepository;
import com.farmerretailerwebapp.repository.ProductRepository;
import com.farmerretailerwebapp.entity.User;
import com.farmerretailerwebapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "http://localhost:3000")
public class FeedbackController {
    @Autowired
    private FeedbackRepository feedbackRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserRepository userRepository;
    @PostMapping("/submit")
    public ResponseEntity<?> submitFeedback(@RequestBody Map<String, Object> payload) {
        try {
            // 1. Extract IDs safely
            Long orderId = Long.valueOf(payload.get("orderId").toString());
            Long productId = Long.valueOf(payload.get("productId").toString());
            Long retailerId = Long.valueOf(payload.get("retailerId").toString());
            int ratingValue = Integer.parseInt(payload.get("rating").toString());
            String comment = (String) payload.get("comment");

            // 2. Check if feedback for this order already exists (The Fix)
            Optional<Feedback> existingFeedbackOpt = feedbackRepository.findByOrderId(orderId);

            Feedback feedback;
            if (existingFeedbackOpt.isPresent()) {
                // UPDATE existing
                feedback = existingFeedbackOpt.get();
            } else {
                // INSERT new - Fetch related entities
                feedback = new Feedback();
                feedback.setOrder(orderRepository.findById(orderId).orElseThrow());
                feedback.setProduct(productRepository.findById(productId).orElseThrow());
                feedback.setRetailer(userRepository.findById(retailerId).orElseThrow());
            }

            // 3. Set/Update common values
            feedback.setRating(ratingValue);
            feedback.setComment(comment);
            feedbackRepository.save(feedback);

            // 4. Update Marketplace Average Rating for the Product
            Product product = productRepository.findById(productId).orElseThrow();
            List<Feedback> allReviews = feedbackRepository.findByProductId(productId);

            double newAvg = allReviews.stream()
                    .mapToInt(Feedback::getRating)
                    .average()
                    .orElse(0.0);

            product.setAverageRating(newAvg);
            product.setTotalReviews(allReviews.size());
            productRepository.save(product);

            return ResponseEntity.ok(existingFeedbackOpt.isPresent() ? "Review updated!" : "Feedback submitted!");

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/product/{productId}")
    public List<Feedback> getProductFeedback(@PathVariable Long productId) {
        return feedbackRepository.findByProductId(productId);
    }
}