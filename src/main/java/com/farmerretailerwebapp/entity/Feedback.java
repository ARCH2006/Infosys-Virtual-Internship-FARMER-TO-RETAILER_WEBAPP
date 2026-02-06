package com.farmerretailerwebapp.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private Order order; // One rating per order

    @ManyToOne
    private Product product;

    @ManyToOne
    private User retailer;

    private int rating; // 1 to 5
    private String comment;
    private LocalDateTime createdDate = LocalDateTime.now();

    // Getters and Setters
}