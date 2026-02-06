package com.farmerretailerwebapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private Long id;
    private String email;
    private String username;
    private String role;
    private boolean verified;
    private String redirectPath;
    private boolean hasUploadedDocs;
}