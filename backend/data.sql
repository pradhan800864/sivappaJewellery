-- Set the database to use
DROP DATABASE IF EXISTS pocproject;
CREATE DATABASE pocproject;
\c pocproject;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS referrals, discounts, Levels, users, admin CASCADE;

-- Create the admin table
CREATE TABLE admin (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

-- Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    firstname TEXT,
    lastname TEXT,
    emailid TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    referralcode TEXT UNIQUE,
    wallet NUMERIC DEFAULT 0
);

-- Create the Levels table
CREATE TABLE Levels (
    id SERIAL PRIMARY KEY,
    level TEXT UNIQUE NOT NULL,
    value NUMERIC NOT NULL
);

-- Create the discounts table
CREATE TABLE discounts (
    id SERIAL PRIMARY KEY,
    discount_code TEXT UNIQUE NOT NULL,
    discount_value NUMERIC NOT NULL,
    applicable_products TEXT,
    minimum_requirement TEXT,
    minimum_value NUMERIC,
    eligibility TEXT,
    specific_customers TEXT,
    active_start_date TIMESTAMP NOT NULL,
    active_end_date TIMESTAMP
);

-- Create the referrals table (Parent-Child relationships)
CREATE TABLE referrals (
    id SERIAL PRIMARY KEY,
    parentcode TEXT REFERENCES users(referralcode) ON DELETE CASCADE,
    childcode TEXT UNIQUE REFERENCES users(referralcode) ON DELETE CASCADE
);

INSERT INTO admin (username, password) VALUES ('admin', '$2b$10$hIpHb6SrNT0cJGFB8wg8Nen2wpz9o3CZ9nHozn./jsymEi5u7lgGK);
