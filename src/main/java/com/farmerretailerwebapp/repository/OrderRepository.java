package com.farmerretailerwebapp.repository;

import com.farmerretailerwebapp.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    // Find orders placed by a specific retailer
    List<Order> findByRetailerId(Long retailerId);

    // Find orders that contain products belonging to a specific farmer
    @Query("SELECT DISTINCT o FROM Order o JOIN o.orderItems oi WHERE oi.product.farmer.id = :farmerId")
    List<Order> findOrdersByFarmerId(@Param("farmerId") Long farmerId);
}