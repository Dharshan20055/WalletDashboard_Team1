package com.example.wallet_dashboard.service;

import com.example.wallet_dashboard.dto.AddMoneyRequest;
import com.example.wallet_dashboard.dto.TransferRequest;
import com.example.wallet_dashboard.model.Transaction;
import com.example.wallet_dashboard.model.WalletRequest;

import java.util.List;
import java.util.Map;

public interface WalletService {
    // New methods for admin approval flow
    WalletRequest createAddMoneyRequest(AddMoneyRequest request);
    List<WalletRequest> getPendingRequests();
    List<WalletRequest> getUserRequests(Long userId);
    Transaction approveRequest(Long requestId);
    WalletRequest rejectRequest(Long requestId);

    // Existing methods
    Transaction addMoney(AddMoneyRequest request); // Keep for direct admin actions if needed
    Transaction transferMoney(TransferRequest request);
    Double getBalance(Long userId);
    List<Transaction> getTransactionHistory(Long userId);
    List<Transaction> getAllTransactions();
    Map<String, Object> getAggregationStats(Long userId);
    Map<String, Object> getMonthlySummary();
}