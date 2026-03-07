-- SQL Schema for Wallet Dashboard

-- Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    role VARCHAR(255),
    wallet_balance DOUBLE DEFAULT 100.0,
    frozen BOOLEAN DEFAULT FALSE
);

-- Transactions Table
CREATE TABLE transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    from_user_id BIGINT,
    to_user_id BIGINT,
    amount DOUBLE,
    transaction_type VARCHAR(255), -- 'CREDIT', 'DEBIT', 'TRANSFER'
    status VARCHAR(255), -- 'SUCCESS', 'FAILED'
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wallet Requests Table
CREATE TABLE wallet_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    user_name VARCHAR(255),
    amount DOUBLE,
    status VARCHAR(255) DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
