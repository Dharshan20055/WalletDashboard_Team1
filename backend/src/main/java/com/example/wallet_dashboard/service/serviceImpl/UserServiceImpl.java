package com.example.wallet_dashboard.service.serviceImpl;

import com.example.wallet_dashboard.dto.LoginRequest;
import com.example.wallet_dashboard.dto.RegisterRequest;
import com.example.wallet_dashboard.exception.ResourceNotFoundException;
import com.example.wallet_dashboard.model.User;
import com.example.wallet_dashboard.repository.UserRepository;
import com.example.wallet_dashboard.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + request.getEmail());
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // plain text for hackathon demo
        user.setRole(request.getRole() != null ? request.getRole().toUpperCase() : "USER");
        user.setWalletBalance(0.0);
        user.setFrozen(false);
        return userRepository.save(user);
    }

    @Override
    public User login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));
        if (!user.getPassword().equals(request.getPassword())) {
            throw new IllegalArgumentException("Invalid password.");
        }
        if (user.isFrozen()) {
            throw new IllegalArgumentException("Account is frozen. Please contact admin.");
        }
        return user;
    }

    @Override
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User freezeUser(Long userId) {
        User user = getUserById(userId);
        user.setFrozen(true);
        return userRepository.save(user);
    }

    @Override
    public User unfreezeUser(Long userId) {
        User user = getUserById(userId);
        user.setFrozen(false);
        return userRepository.save(user);
    }
}