package com.example.wallet_dashboard.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long fromUserId;   // null for CREDIT (add money)
    private Long toUserId;     // null for DEBIT (withdrawal)

    private Double amount;

    private String transactionType; // "CREDIT" | "DEBIT" | "TRANSFER"

    private String status; // "SUCCESS" | "FAILED"

    private String description;

    private LocalDateTime createdAt = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
