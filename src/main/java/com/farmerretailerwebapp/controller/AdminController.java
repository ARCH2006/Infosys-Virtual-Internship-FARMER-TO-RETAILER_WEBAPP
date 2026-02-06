package com.farmerretailerwebapp.controller;

import com.farmerretailerwebapp.entity.Order;
import com.farmerretailerwebapp.entity.Product;
import com.farmerretailerwebapp.entity.User;
import com.farmerretailerwebapp.repository.OrderRepository;
import com.farmerretailerwebapp.repository.ProductRepository;
import com.farmerretailerwebapp.repository.UserRepository;
import com.farmerretailerwebapp.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired
    private EmailService emailService;
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 2. Update user (Username and Role)
    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, String> updates) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setUsername(updates.get("username"));
        user.setRole(updates.get("role"));

        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    // 3. Delete user
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // DASHBOARD STATS
    @GetMapping("/stats")
    public Map<String, Object> getSystemStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalFarmers", userRepository.countByRole("FARMER"));
        stats.put("totalRetailers", userRepository.countByRole("RETAILER"));
        stats.put("totalProducts", productRepository.count());
        stats.put("totalOrders", orderRepository.count());
        return stats;
    }

    // PRODUCT MANAGEMENT (Approval/Deletion)
    @GetMapping("/products")
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            // 1. Check if product exists
            if (!productRepository.existsById(id)) {
                return ResponseEntity.status(404).body("Product not found");
            }

            productRepository.deleteById(id);
            return ResponseEntity.ok().build();

        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            // This catches the Foreign Key error specifically
            return ResponseEntity.status(409).body("Cannot delete: Product is linked to existing orders.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Server Error: " + e.getMessage());
        }
    }

    // ORDER MANAGEMENT
    @GetMapping("/orders")
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Inside AdminController.java

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<?> updateAdminOrderStatus(@PathVariable Long id, @RequestParam String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Auto-generate PIN when Admin sets order to OUT_FOR_DELIVERY
        if ("OUT_FOR_DELIVERY".equals(status)) {
            String randomPin = String.valueOf((int)(Math.random() * 9000) + 1000);
            order.setDeliveryPin(randomPin);
        }

        order.setStatus(status);
        orderRepository.save(order);
        return ResponseEntity.ok("Admin updated status to " + status);
    }

    @PutMapping("/orders/{id}/verify-delivery")
    public ResponseEntity<?> verifyPinAndDeliver(@PathVariable Long id, @RequestParam String otp) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getDeliveryPin() != null && order.getDeliveryPin().equals(otp)) {
            order.setStatus("DELIVERED");
            orderRepository.save(order);
            return ResponseEntity.ok("OTP Verified. Order is now DELIVERED.");
        } else {
            return ResponseEntity.status(400).body("Invalid OTP. Handover failed.");
        }
    }

//    @PutMapping("/orders/{id}/settle")
//    public ResponseEntity<?> releaseFunds(@PathVariable Long id) {
//        Order order = orderRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Order not found"));
//
//        // Safety check: Only DELIVERED orders can be settled
//        if (!"DELIVERED".equals(order.getStatus())) {
//            return ResponseEntity.badRequest().body("Order must be DELIVERED before releasing funds.");
//        }
//
//        order.setStatus("COMPLETED");
//        orderRepository.save(order);
//        return ResponseEntity.ok("Funds released to farmer and order completed.");
//    }
//    @PutMapping("/orders/{id}/settle")
//    public ResponseEntity<?> releaseFunds(@PathVariable Long id) {
//        Order order = orderRepository.findById(id).orElseThrow();
//
//        if (!"DELIVERED".equals(order.getStatus())) {
//            return ResponseEntity.badRequest().body("Order must be DELIVERED first.");
//        }
//
//        order.setStatus("COMPLETED");
//        orderRepository.save(order);
//
//        // Notify the Farmer of payment release
//        emailService.sendNotification(order.getFarmer().getEmail(),
//                "Payment Released!",
//                "Funds for Order #" + id + " have been released. Please check your wallet.");
//
//        return ResponseEntity.ok("Funds released and order completed.");
//    }
@PutMapping("/orders/{id}/settle")
public ResponseEntity<?> releaseFunds(@PathVariable Long id) {
    Order order = orderRepository.findById(id).orElseThrow();
    // ... logic to update status to COMPLETED ...

    // Generate the HTML content for payment confirmation
    String farmerEarnings = String.valueOf(order.getTotalAmount() * 0.9);
    String htmlContent = emailService.getOrderTemplate(
            "Payment Released",
            "Your share for this order has been successfully disbursed to your wallet.",
            order.getId().toString(),
            farmerEarnings,
            "COMPLETED"
    );

    // Send the receipt to the Farmer
    emailService.sendHtmlNotification(order.getFarmer().getEmail(), "Payment Receipt for Order #" + id, htmlContent);

    return ResponseEntity.ok("Funds released.");
}
}