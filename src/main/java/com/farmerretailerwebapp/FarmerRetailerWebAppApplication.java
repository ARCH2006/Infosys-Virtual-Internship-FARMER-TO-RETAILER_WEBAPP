package com.farmerretailerwebapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@SpringBootApplication
@RestController
public class FarmerRetailerWebAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(FarmerRetailerWebAppApplication.class, args);
    }
    @GetMapping
    public String helloworld(){
        return "helo webapp!!";
    }
}
