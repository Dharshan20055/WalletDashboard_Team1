package com.example.wallet_dashboard.dto;

import lombok.Data;

@Data
public class AddMoneyRequest {
    private Long userId;
    private Double amount;
}
