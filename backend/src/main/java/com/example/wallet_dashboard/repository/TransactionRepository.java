package com.example.wallet_dashboard.repository;

import com.example.wallet_dashboard.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // All transactions involving a user (sent or received)
    List<Transaction> findByFromUserIdOrToUserIdOrderByCreatedAtDesc(Long fromUserId, Long toUserId);

    // Transactions in a date range for monthly summary
    List<Transaction> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    // All transactions by type
    List<Transaction> findByTransactionType(String type);
}