package com.example.wallet_dashboard.repository;


import com.example.wallet_dashboard.model.WalletRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WalletRequestRepository extends JpaRepository<WalletRequest, Long> {
    List<WalletRequest> findByStatus(String status);
    List<WalletRequest> findByUserIdOrderByCreatedAtDesc(Long userId);
}
