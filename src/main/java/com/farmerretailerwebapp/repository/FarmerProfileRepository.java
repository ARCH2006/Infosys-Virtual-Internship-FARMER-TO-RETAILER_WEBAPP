package com.farmerretailerwebapp.repository;

import com.farmerretailerwebapp.entity.FarmerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FarmerProfileRepository extends JpaRepository<FarmerProfile, Long> {
    FarmerProfile findByUserId(Long userId);
    // You can add custom queries here later if needed
}