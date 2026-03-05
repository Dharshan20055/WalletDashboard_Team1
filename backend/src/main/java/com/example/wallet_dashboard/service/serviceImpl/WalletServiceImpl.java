package com.example.wallet_dashboard.service.serviceImpl;

import com.example.wallet_dashboard.dto.AddMoneyRequest;
import com.example.wallet_dashboard.dto.TransferRequest;
import com.example.wallet_dashboard.exception.InsufficientBalanceException;
import com.example.wallet_dashboard.exception.ResourceNotFoundException;
import com.example.wallet_dashboard.model.Transaction;
import com.example.wallet_dashboard.model.User;
import com.example.wallet_dashboard.model.WalletRequest;
import com.example.wallet_dashboard.repository.TransactionRepository;
import com.example.wallet_dashboard.repository.UserRepository;
import com.example.wallet_dashboard.repository.WalletRequestRepository;
import com.example.wallet_dashboard.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class WalletServiceImpl implements WalletService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private WalletRequestRepository walletRequestRepository;

    @Override
    @Transactional
    public WalletRequest createAddMoneyRequest(AddMoneyRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + request.getUserId()));

        if (user.isFrozen()) {
            throw new IllegalArgumentException("Account is frozen. Cannot request money.");
        }

        WalletRequest walletRequest = new WalletRequest();
        walletRequest.setUserId(user.getId());
        walletRequest.setUserName(user.getName());
        walletRequest.setAmount(request.getAmount());
        walletRequest.setStatus("PENDING");
        return walletRequestRepository.save(walletRequest);
    }

    @Override
    public List<WalletRequest> getPendingRequests() {
        return walletRequestRepository.findByStatus("PENDING");
    }

    @Override
    public List<WalletRequest> getUserRequests(Long userId) {
        return walletRequestRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    @Transactional
    public Transaction approveRequest(Long requestId) {
        WalletRequest request = walletRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found: " + requestId));

        if (!"PENDING".equals(request.getStatus())) {
            throw new IllegalArgumentException("Request is already " + request.getStatus());
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found for request"));

        // Update balance
        user.setWalletBalance(user.getWalletBalance() + request.getAmount());
        userRepository.save(user);

        // Update request status
        request.setStatus("APPROVED");
        walletRequestRepository.save(request);

        // Record transaction
        Transaction txn = new Transaction();
        txn.setFromUserId(null);
        txn.setToUserId(user.getId());
        txn.setAmount(request.getAmount());
        txn.setTransactionType("CREDIT");
        txn.setStatus("SUCCESS");
        txn.setDescription("Money added via Admin Approval");
        txn.setCreatedAt(LocalDateTime.now());

        return transactionRepository.save(txn);
    }

    @Override
    @Transactional
    public WalletRequest rejectRequest(Long requestId) {
        WalletRequest request = walletRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found: " + requestId));
        request.setStatus("REJECTED");
        return walletRequestRepository.save(request);
    }

    @Override
    @Transactional
    public Transaction addMoney(AddMoneyRequest request) {
        // Direct add money (can be used by Admin directly)
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setWalletBalance(user.getWalletBalance() + request.getAmount());
        userRepository.save(user);

        Transaction txn = new Transaction();
        txn.setToUserId(user.getId());
        txn.setAmount(request.getAmount());
        txn.setTransactionType("CREDIT");
        txn.setStatus("SUCCESS");
        txn.setDescription("Direct Credit by Admin");
        return transactionRepository.save(txn);
    }

    @Override
    @Transactional
    public Transaction transferMoney(TransferRequest request) {
        if (request.getAmount() == null || request.getAmount() <= 0) {
            throw new IllegalArgumentException("Transfer amount must be positive.");
        }
        if (request.getFromUserId().equals(request.getToUserId())) {
            throw new IllegalArgumentException("Cannot transfer money to yourself.");
        }

        User sender = userRepository.findById(request.getFromUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found: " + request.getFromUserId()));
        User receiver = userRepository.findById(request.getToUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found: " + request.getToUserId()));

        if (sender.isFrozen()) {
            throw new IllegalArgumentException("Sender account is frozen.");
        }
        if (receiver.isFrozen()) {
            throw new IllegalArgumentException("Receiver account is frozen.");
        }
        if (sender.getWalletBalance() < request.getAmount()) {
            throw new InsufficientBalanceException(
                    "Insufficient balance. Available: ₹" + sender.getWalletBalance()
                            + ", Required: ₹" + request.getAmount());
        }

        // Atomic update with @Transactional
        sender.setWalletBalance(sender.getWalletBalance() - request.getAmount());
        receiver.setWalletBalance(receiver.getWalletBalance() + request.getAmount());
        userRepository.save(sender);
        userRepository.save(receiver);

        String desc = request.getDescription() != null ? request.getDescription() : "Transfer";

        // Record TRANSFER transaction
        Transaction txn = new Transaction();
        txn.setFromUserId(request.getFromUserId());
        txn.setToUserId(request.getToUserId());
        txn.setAmount(request.getAmount());
        txn.setTransactionType("TRANSFER");
        txn.setStatus("SUCCESS");
        txn.setDescription(desc);
        txn.setCreatedAt(LocalDateTime.now());

        return transactionRepository.save(txn);
    }

    @Override
    public Double getBalance(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        return user.getWalletBalance();
    }

    @Override
    public List<Transaction> getTransactionHistory(Long userId) {
        return transactionRepository.findByFromUserIdOrToUserIdOrderByCreatedAtDesc(userId, userId);
    }

    @Override
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    @Override
    public Map<String, Object> getAggregationStats(Long userId) {
        List<Transaction> userTxns = getTransactionHistory(userId);

        double totalSent = userTxns.stream()
                .filter(t -> userId.equals(t.getFromUserId()))
                .mapToDouble(Transaction::getAmount)
                .sum();

        double totalReceived = userTxns.stream()
                .filter(t -> userId.equals(t.getToUserId()))
                .mapToDouble(Transaction::getAmount)
                .sum();

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("userId", userId);
        stats.put("totalTransactions", userTxns.size());
        stats.put("totalSent", totalSent);
        stats.put("totalReceived", totalReceived);
        stats.put("netFlow", totalReceived - totalSent);
        return stats;
    }

    @Override
    public Map<String, Object> getMonthlySummary() {
        List<Transaction> all = transactionRepository.findAll();

        // Group by year-month
        Map<String, DoubleSummaryStatistics> grouped = all.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getCreatedAt().getYear() + "-" +
                                String.format("%02d", t.getCreatedAt().getMonthValue()),
                        Collectors.summarizingDouble(Transaction::getAmount)
                ));

        Map<String, Object> summary = new LinkedHashMap<>();
        grouped.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .forEach(e -> {
                    Map<String, Object> monthData = new LinkedHashMap<>();
                    monthData.put("count", e.getValue().getCount());
                    monthData.put("totalAmount", e.getValue().getSum());
                    monthData.put("avgAmount", Math.round(e.getValue().getAverage() * 100.0) / 100.0);
                    summary.put(e.getKey(), monthData);
                });

        return summary;
    }
}
