package com.farmerretailerwebapp.repository;

import com.farmerretailerwebapp.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByFarmerId(Long farmerId);
}