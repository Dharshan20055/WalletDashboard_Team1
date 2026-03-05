package com.example.wallet_dashboard.service;

import com.example.wallet_dashboard.dto.LoginRequest;
import com.example.wallet_dashboard.dto.RegisterRequest;
import com.example.wallet_dashboard.model.User;

import java.util.List;

public interface UserService {
    User register(RegisterRequest request);
    User login(LoginRequest request);
    User getUserById(Long userId);
    List<User> getAllUsers();
    User freezeUser(Long userId);
    User unfreezeUser(Long userId);
}