package com.example.wallet_dashboard.controller;

import com.example.wallet_dashboard.dto.AddMoneyRequest;
import com.example.wallet_dashboard.dto.TransferRequest;
import com.example.wallet_dashboard.model.Transaction;
import com.example.wallet_dashboard.model.WalletRequest;
import com.example.wallet_dashboard.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    @Autowired
    private WalletService walletService;

    // --- New endpoints for Admin Approval flow ---

    @PostMapping("/request-add")
    public ResponseEntity<WalletRequest> requestAddMoney(@RequestBody AddMoneyRequest request) {
        return ResponseEntity.ok(walletService.createAddMoneyRequest(request));
    }

    @GetMapping("/pending-requests")
    public ResponseEntity<List<WalletRequest>> getPendingRequests() {
        return ResponseEntity.ok(walletService.getPendingRequests());
    }

    @GetMapping("/user-requests/{userId}")
    public ResponseEntity<List<WalletRequest>> getUserRequests(@PathVariable Long userId) {
        return ResponseEntity.ok(walletService.getUserRequests(userId));
    }

    @PatchMapping("/approve-request/{requestId}")
    public ResponseEntity<Transaction> approveRequest(@PathVariable Long requestId) {
        return ResponseEntity.ok(walletService.approveRequest(requestId));
    }

    @PatchMapping("/reject-request/{requestId}")
    public ResponseEntity<WalletRequest> rejectRequest(@PathVariable Long requestId) {
        return ResponseEntity.ok(walletService.rejectRequest(requestId));
    }

    // --- Existing endpoints ---

    @PostMapping("/add")
    public ResponseEntity<Transaction> addMoney(@RequestBody AddMoneyRequest request) {
        Transaction txn = walletService.addMoney(request);
        return ResponseEntity.ok(txn);
    }

    @PostMapping("/transfer")
    public ResponseEntity<Transaction> transfer(@RequestBody TransferRequest request) {
        Transaction txn = walletService.transferMoney(request);
        return ResponseEntity.ok(txn);
    }

    @GetMapping("/balance/{userId}")
    public ResponseEntity<Map<String, Object>> getBalance(@PathVariable Long userId) {
        Double balance = walletService.getBalance(userId);
        return ResponseEntity.ok(Map.of("userId", userId, "balance", balance));
    }

    @GetMapping("/transactions/{userId}")
    public ResponseEntity<List<Transaction>> getTransactions(@PathVariable Long userId) {
        return ResponseEntity.ok(walletService.getTransactionHistory(userId));
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        return ResponseEntity.ok(walletService.getAllTransactions());
    }

    @GetMapping("/stats/{userId}")
    public ResponseEntity<Map<String, Object>> getStats(@PathVariable Long userId) {
        return ResponseEntity.ok(walletService.getAggregationStats(userId));
    }

    @GetMapping("/monthly-summary")
    public ResponseEntity<Map<String, Object>> getMonthlySummary() {
        return ResponseEntity.ok(walletService.getMonthlySummary());
    }
}
