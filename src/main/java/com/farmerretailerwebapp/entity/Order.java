package com.farmerretailerwebapp.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
@Entity
@Table(name = "orders")
@Data
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "retailer_id", nullable = false)
    private User retailer;

    @ManyToOne
    @JoinColumn(name = "farmer_id", nullable = false)
    private User farmer;

    private Double totalAmount;
    private String shippingAddress;
    private String contactNumber;
    private LocalDateTime orderDate = LocalDateTime.now();
    private String status;
    private String paymentId;
    private String deliveryPin;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems;

    @Column(name = "pickup_address")
    private String pickupAddress;
}
