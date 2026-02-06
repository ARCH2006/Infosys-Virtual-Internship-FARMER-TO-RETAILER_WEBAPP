package com.farmerretailerwebapp.controller;

import com.farmerretailerwebapp.entity.Order;
import com.farmerretailerwebapp.repository.OrderRepository;
import com.farmerretailerwebapp.service.EmailService;
import com.farmerretailerwebapp.service.NotificationService;
import com.farmerretailerwebapp.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired private OrderService orderService;
    @Autowired private OrderRepository orderRepository;
    @Autowired
    private EmailService emailService;
    @Autowired
    private NotificationService notificationService;


    //    @PostMapping("/place")
//    public ResponseEntity<?> placeOrder(@RequestBody Order order) {
//        try {
//            Order savedOrder = orderService.placeOrder(order);
//            return ResponseEntity.ok(savedOrder);
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }
//    @PostMapping("/place")
//    public ResponseEntity<?> placeOrder(@RequestBody Order order) {
//        try {
//            Order savedOrder = orderService.placeOrder(order);
//
//            // Notify Farmer
//            emailService.sendEmail(
//                    savedOrder.getFarmer().getEmail(),
//                    "New Order Received!",
//                    "You have received a new order #" + savedOrder.getId() + ". Please check your dashboard to process it."
//            );
//
//            return ResponseEntity.ok(savedOrder);
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }
    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(@RequestBody Order order) {
        try {
            Order savedOrder = orderService.placeOrder(order);

            // Generate the HTML content using the new template
            String htmlContent = emailService.getOrderTemplate(
                    "New Order Received",
                    "A retailer has placed a new order with you. Here are the details:",
                    savedOrder.getId().toString(),
                    savedOrder.getTotalAmount().toString(),
                    "PENDING"
            );

            // Send the HTML email to the Farmer
            emailService.sendHtmlNotification(savedOrder.getFarmer().getEmail(), "New Order #" + savedOrder.getId(), htmlContent);

            notificationService.createNotification(
                    savedOrder.getFarmer().getId(),
                    "New Order Received",
                    "Order #" + savedOrder.getId() + " has been placed for ₹" + savedOrder.getTotalAmount(),
                    "ORDER"
            );

            // 3. Optional: Notify Admin
            notificationService.createNotification(1L, "System Alert", "New order placed across platform", "ADMIN");

            return ResponseEntity.ok(savedOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/retailer/{retailerId}")
    public List<Order> getRetailerOrders(@PathVariable Long retailerId) {
        return orderRepository.findByRetailerId(retailerId);
    }

    @GetMapping("/farmer/{farmerId}")
    public List<Order> getFarmerOrders(@PathVariable Long farmerId) {
        return orderRepository.findOrdersByFarmerId(farmerId);
    }

    // OrderController.java

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id,
                                          @RequestParam String status,
                                          @RequestParam(required = false) String pickupAddress,
                                          @RequestParam(required = false) String pin) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        if (pickupAddress != null) {
            order.setPickupAddress(pickupAddress);
        }

        switch (status) {
            case "ACCEPTED":
            case "PROCESSING":      // Add this
            case "READY_FOR_PICKUP": // Add this
            case "SHIPPED":
            case "IN_TRANSIT":      // Add this for Admin
            case "OUT_FOR_DELIVERY": // Add this for Admin
                order.setStatus(status);
                break;

            case "DELIVERED":
                // PIN verification
                if (order.getDeliveryPin() != null && order.getDeliveryPin().equals(pin)) {
                    order.setStatus(status);
                } else {
                    return ResponseEntity.status(400).body("Incorrect Delivery PIN");
                }
                break;

            case "CANCELLED":
                order.setStatus(status);
                break;

            default:
                return ResponseEntity.badRequest().body("Invalid status transition: " + status);
        }

        orderRepository.save(order);
        return ResponseEntity.ok("Status updated to " + status);
    }
    // Inside your OrderController
//    @PutMapping("/{orderId}/status")
//    public ResponseEntity<?> updateStatus(
//            @PathVariable Long orderId,
//            @RequestParam String status,
//             // Add this
//    ) {
//        Order order = orderRepository.findById(orderId).orElseThrow();
//
//        return ResponseEntity.ok(orderRepository.save(order));
//    }
}