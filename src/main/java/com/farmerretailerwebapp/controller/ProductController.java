package com.farmerretailerwebapp.controller;

import com.farmerretailerwebapp.entity.Product;
import com.farmerretailerwebapp.entity.User;
import com.farmerretailerwebapp.repository.ProductRepository;
import com.farmerretailerwebapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.util.*;


@RestController
@RequestMapping("/api/products")
// Global config in WebConfig handles CORS now
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    // Use a path relative to project root
    private static final String UPLOAD_DIR = "uploads/products";

    @PostMapping(
            value = "/add",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE // This tells Spring to expect FormData
    )
    public ResponseEntity<?> addProduct(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") Double price,
            @RequestParam("stock") Integer stock,
            @RequestParam("category") String category,
            @RequestParam("unit") String unit,
            @RequestParam("farmerId") Long farmerId,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {


        try {
            User farmer = userRepository.findById(farmerId)
                    .orElseThrow(() -> new RuntimeException("Farmer not found"));

            Product product = new Product();
            product.setName(name);
            product.setDescription(description);
            product.setPrice(price);
            product.setStock(stock);
            product.setCategory(category);
            product.setUnit(unit);
            product.setFarmer(farmer);


            if (image != null && !image.isEmpty()) {
                // Ensure directories exist
                Path uploadPath = Paths.get(UPLOAD_DIR);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                product.setImagePath("/uploads/products/" + fileName);
            }

            Product savedProduct = productRepository.save(product);
            return ResponseEntity.ok(savedProduct);

        } catch (Exception e) {
            e.printStackTrace(); // Log the actual error to your IDE console
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
    @GetMapping("/browse")
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    @GetMapping("/retailer-stats/{retailerId}")
    public ResponseEntity<Map<String, Object>> getRetailerStats(@PathVariable Long retailerId) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("ordersPlaced", 5); // Placeholder
        stats.put("pendingDeliveries", 2); // Placeholder
        stats.put("totalSpend", 12500.50); // Placeholder
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/my-inventory/{farmerId}")
    public List<Product> getMyInventory(@PathVariable Long farmerId) {
        return productRepository.findByFarmerId(farmerId);
    }

    @GetMapping("/stats/{farmerId}")
    public ResponseEntity<Map<String, Object>> getStats(@PathVariable Long farmerId) {
        List<Product> products = productRepository.findByFarmerId(farmerId);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", products.size());
        stats.put("lowStockCount", products.stream().filter(p -> p.getStock() < 10).count());
        stats.put("activeOrders", 0);
        stats.put("earnings", 0);

        return ResponseEntity.ok(stats);
    }

}
