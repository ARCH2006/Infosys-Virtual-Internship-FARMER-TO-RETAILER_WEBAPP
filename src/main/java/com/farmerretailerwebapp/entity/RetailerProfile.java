package com.farmerretailerwebapp.entity;

import jakarta.persistence.*;

@Entity
public class RetailerProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String retailerName;
    private String contactNumber;

    @OneToOne
    private User user;
}
