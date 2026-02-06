package com.farmerretailerwebapp.repository;

import com.farmerretailerwebapp.entity.RetailerProfile;
import com.farmerretailerwebapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RetailerProfileRepository extends JpaRepository<RetailerProfile, Long> {
    Optional<RetailerProfile> findByUser(User user);
}