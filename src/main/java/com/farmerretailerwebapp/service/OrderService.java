package com.farmerretailerwebapp.service;

import com.farmerretailerwebapp.entity.*;
import com.farmerretailerwebapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Random;

@Service
public class OrderService {
    @Autowired private OrderRepository orderRepository;
    @Autowired private ProductRepository productRepository;

    @Transactional
    public Order placeOrder(Order order) {

        order.setDeliveryPin(String.format("%04d", new Random().nextInt(10000)));

        User farmer = null;

        for (OrderItem item : order.getOrderItems()) {
            item.setOrder(order);

            Product product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            if (farmer == null) {
                farmer = product.getFarmer();
                order.setFarmer(farmer);
            }

            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for: " + product.getName());
            }

            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);

            item.setPriceAtPurchase(product.getPrice());
        }

        return orderRepository.save(order);
    }

}