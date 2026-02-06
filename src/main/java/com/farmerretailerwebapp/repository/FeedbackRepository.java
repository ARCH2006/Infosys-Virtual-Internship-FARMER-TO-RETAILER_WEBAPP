package com.farmerretailerwebapp.repository;

import com.farmerretailerwebapp.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    // Find all reviews for a specific product
    List<Feedback> findByProductId(Long productId);
    Optional<Feedback> findByOrderId(Long orderId);

    // Optional: Check if a retailer has already rated a specific order
    boolean existsByOrderId(Long orderId);
    Optional<Feedback> findByOrderIdAndProductId(Long orderId, Long productId);
}