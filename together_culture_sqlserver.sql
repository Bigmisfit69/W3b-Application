-- CREATE DATABASE CommunityPlatform;
-- USE CommunityPlatform;

-- Users Table
CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) -- ENUM('admin', 'member', 'pending') originally DEFAULT 'pending',
    status VARCHAR(50) -- ENUM('active', 'inactive', 'pending') originally DEFAULT 'pending',
    created_at DATETIME DEFAULT GETDATE()
);

-- Membership Types
CREATE TABLE membership_types (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(50) -- ENUM('Community Member', 'Key Access Member', 'Creative Workspace Member') originally NOT NULL
);

-- User Memberships
CREATE TABLE user_memberships (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT,
    membership_type_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (membership_type_id) REFERENCES membership_types(id) ON DELETE CASCADE
);

-- Interests Table
CREATE TABLE interests (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(50) -- ENUM('caring', 'sharing', 'creating', 'experiencing', 'working') originally NOT NULL
);

-- User Interests
CREATE TABLE user_interests (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT,
    interest_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (interest_id) REFERENCES interests(id) ON DELETE CASCADE
);

-- Events Table
CREATE TABLE events (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(MAX),
