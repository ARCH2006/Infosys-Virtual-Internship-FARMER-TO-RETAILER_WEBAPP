package com.farmerretailerwebapp.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private Double price;

    // Maps Java 'stock' to DB column 'stock_quantity'
    @Column(nullable = false)
    private Integer stock;

    private String category;

    private String unit; // e.g., KG, Bunch, Liter



    // New field to store the uploaded image's file path or URL
    @Column(name = "image_path")
    private String imagePath;

    // Inside Product.java
    // Inside Product.java
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "farmer_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore // THIS PREVENTS THE SERIALIZATION LOOP
    private User farmer;

    // Add these fields to your Product entity
    private Double averageRating = 0.0;
    private Integer totalReviews = 0;

// Getters and Setters
    /**
     * Helper methods to maintain compatibility if your frontend
     * or controller still uses 'stockQuantity'.
     */
    public Integer getStockQuantity() {
        return this.stock;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stock = stockQuantity;
    }
}