package com.example.wallet_dashboard.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}