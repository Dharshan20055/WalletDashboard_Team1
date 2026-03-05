package com.example.wallet_dashboard.controller;

import com.example.wallet_dashboard.dto.LoginRequest;
import com.example.wallet_dashboard.dto.RegisterRequest;
import com.example.wallet_dashboard.model.User;
import com.example.wallet_dashboard.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest request) {
        User user = userService.register(request);
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody LoginRequest request) {
        User user = userService.login(request);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUser(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PatchMapping("/{userId}/freeze")
    public ResponseEntity<User> freezeUser(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.freezeUser(userId));
    }

    @PatchMapping("/{userId}/unfreeze")
    public ResponseEntity<User> unfreezeUser(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.unfreezeUser(userId));
    }
}
usercontroler