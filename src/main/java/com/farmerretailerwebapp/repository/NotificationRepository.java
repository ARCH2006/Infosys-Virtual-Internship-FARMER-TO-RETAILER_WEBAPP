package com.farmerretailerwebapp.repository;

import com.farmerretailerwebapp.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    /**
     * Finds all notifications for a specific user (Farmer or Admin)
     * ordered by the most recent first.
     */
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    /**
     * Useful for showing the "red dot" badge in the UI
     */
    long countByUserIdAndIsReadFalse(Long userId);

    /**
     * Useful for a "Mark all as read" feature
     */
    List<Notification> findByUserIdAndIsReadFalse(Long userId);
}