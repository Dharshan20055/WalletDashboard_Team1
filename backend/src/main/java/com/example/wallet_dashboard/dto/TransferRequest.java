package com.example.wallet_dashboard.dto;

import lombok.Data;

@Data
public class TransferRequest {
    private Long fromUserId;
    private Long toUserId;
    private Double amount;
    private String description;
}
