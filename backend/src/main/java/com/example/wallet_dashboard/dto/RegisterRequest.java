package com.example.wallet_dashboard.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String role; // "USER" or "ADMIN"
}
