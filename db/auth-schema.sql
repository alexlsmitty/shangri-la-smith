-- Authentication Schema for Shangri-La Beach Resort

-- Users Table (for authentication)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster email lookup
CREATE INDEX IF NOT EXISTS idx_users_email 
ON users (email);

-- Create index for faster username lookup
CREATE INDEX IF NOT EXISTS idx_users_username 
ON users (username);

-- Add user_id to bookings table
ALTER TABLE bookings ADD COLUMN user_id INTEGER;
ALTER TABLE bookings ADD FOREIGN KEY (user_id) REFERENCES users (id);

-- Add user_id to spa_appointments table
ALTER TABLE spa_appointments ADD COLUMN user_id INTEGER;
ALTER TABLE spa_appointments ADD FOREIGN KEY (user_id) REFERENCES users (id);

-- Create authentication tokens table for session management
CREATE TABLE IF NOT EXISTS auth_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Create index for faster token lookup
CREATE INDEX IF NOT EXISTS idx_auth_tokens_token 
ON auth_tokens (token);
