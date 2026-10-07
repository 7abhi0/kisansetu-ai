-- ==========================================================
-- KisanSetu AI: Enterprise PostgreSQL Database Schema
-- Production Ready DDL for Agmarknet, Farmers, AI & Mandis
-- ==========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User Roles Enum
CREATE TYPE user_role_enum AS ENUM (
    'farmer',
    'buyer',
    'transporter',
    'expert',
    'government',
    'admin'
);

-- Crop Growth Stage Enum
CREATE TYPE growth_stage_enum AS ENUM (
    'Germination',
    'Vegetative',
    'Flowering',
    'Maturity',
    'Harvest Ready'
);

-- Quality Grade Enum
CREATE TYPE quality_grade_enum AS ENUM (
    'A+ Export Grade',
    'Grade A Premium',
    'Grade B Standard'
);

-- ==========================================================
-- 1. USERS & RBAC TABLE
-- ==========================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'farmer',
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    address TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    admin_approved BOOLEAN NOT NULL DEFAULT FALSE,
    badge_title VARCHAR(100) DEFAULT 'Farmer',
    net_worth VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);

-- ==========================================================
-- 2. FARMS & PARCELS
-- ==========================================================
CREATE TABLE farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    farm_name VARCHAR(150) NOT NULL,
    area_acres NUMERIC(8, 2) NOT NULL,
    soil_type VARCHAR(80) NOT NULL,
    water_source VARCHAR(80) NOT NULL,
    irrigation_type VARCHAR(80) NOT NULL,
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    soil_nitrogen NUMERIC(6, 2) DEFAULT 140.0,
    soil_phosphorus NUMERIC(6, 2) DEFAULT 45.0,
    soil_potassium NUMERIC(6, 2) DEFAULT 60.0,
    soil_ph NUMERIC(3, 1) DEFAULT 6.8,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_farms_user_id ON farms(user_id);

-- ==========================================================
-- 3. CROPS & LIFECYCLE
-- ==========================================================
CREATE TABLE crops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    crop_name VARCHAR(100) NOT NULL,
    variety VARCHAR(100) NOT NULL,
    sowing_date DATE NOT NULL,
    expected_harvest_date DATE NOT NULL,
    growth_stage growth_stage_enum NOT NULL DEFAULT 'Germination',
    growth_progress_percent INT NOT NULL DEFAULT 10,
    expected_yield_quintals NUMERIC(10, 2) NOT NULL,
    health_score INT NOT NULL DEFAULT 95,
    status VARCHAR(50) DEFAULT 'Healthy',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_crops_farm_id ON crops(farm_id);

-- ==========================================================
-- 4. APMC MANDI PRICES
-- ==========================================================
CREATE TABLE mandi_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    commodity VARCHAR(100) NOT NULL,
    mandi_name VARCHAR(150) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    modal_price NUMERIC(10, 2) NOT NULL,
    min_price NUMERIC(10, 2) NOT NULL,
    max_price NUMERIC(10, 2) NOT NULL,
    arrival_quantity_tons NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    price_change_percent NUMERIC(5, 2) DEFAULT 0.0,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_mandi_commodity ON mandi_prices(commodity);
CREATE INDEX idx_mandi_state ON mandi_prices(state);

-- ==========================================================
-- 5. AI PRICE PREDICTIONS & HOLD/SELL SIGNALS
-- ==========================================================
CREATE TABLE ai_price_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    commodity VARCHAR(100) NOT NULL,
    mandi_name VARCHAR(150) NOT NULL,
    forecast_horizon_days INT NOT NULL,
    predicted_price NUMERIC(10, 2) NOT NULL,
    confidence_interval_low NUMERIC(10, 2) NOT NULL,
    confidence_interval_high NUMERIC(10, 2) NOT NULL,
    signal_recommendation VARCHAR(20) NOT NULL, -- 'SELL' or 'HOLD'
    recommended_hold_days INT DEFAULT 0,
    expected_upside_inr NUMERIC(10, 2) DEFAULT 0.0,
    confidence_score NUMERIC(5, 2) NOT NULL,
    model_version VARCHAR(50) DEFAULT 'ARIMA-LSTM-v2.4',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- 6. MARKETPLACE LISTINGS & AUCTION BIDS
-- ==========================================================
CREATE TABLE marketplace_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    crop_name VARCHAR(100) NOT NULL,
    variety VARCHAR(100) NOT NULL,
    quantity_quintals NUMERIC(10, 2) NOT NULL,
    min_order_quintals NUMERIC(10, 2) NOT NULL DEFAULT 10.0,
    ask_price_per_quintal NUMERIC(10, 2) NOT NULL,
    current_highest_bid NUMERIC(10, 2),
    quality_grade quality_grade_enum NOT NULL DEFAULT 'Grade A Premium',
    is_organic_certified BOOLEAN NOT NULL DEFAULT FALSE,
    is_sold BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE auction_bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES marketplace_listings(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bid_amount_per_quintal NUMERIC(10, 2) NOT NULL,
    quantity_demanded_quintals NUMERIC(10, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'Active', -- 'Active', 'Accepted', 'Outbid'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- 7. FINANCIAL EXPENSES & INCOMES (FARM LEDGER)
-- ==========================================================
CREATE TABLE farm_expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expense_date DATE NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    amount_inr NUMERIC(12, 2) NOT NULL,
    receipt_ocr_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE farm_incomes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    invoice_no VARCHAR(50) UNIQUE NOT NULL,
    income_date DATE NOT NULL,
    crop_name VARCHAR(100) NOT NULL,
    quantity_quintals NUMERIC(10, 2) NOT NULL,
    rate_per_quintal NUMERIC(10, 2) NOT NULL,
    total_amount_inr NUMERIC(12, 2) NOT NULL,
    buyer_name VARCHAR(150) NOT NULL,
    payment_status VARCHAR(30) DEFAULT 'Completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- 8. INITIAL SEED FIXTURES
-- ==========================================================
INSERT INTO users (id, email, hashed_password, full_name, phone, role, state, district, is_verified, admin_approved, badge_title)
VALUES 
('a0000000-0000-0000-0000-000000000001', 'farmer@kisansetu.ai', '$2b$12$e80yq7KjF.f8wYhJ8r7fU.8L0QyU7e7fP6/1Z6vL9eK0F9y6K8e9m', 'Sardar Gurpreet Singh', '+919876543210', 'farmer', 'Punjab', 'Ludhiana', TRUE, TRUE, 'Progressive Kisan'),
('a0000000-0000-0000-0000-000000000002', 'buyer@kisansetu.ai', '$2b$12$e80yq7KjF.f8wYhJ8r7fU.8L0QyU7e7fP6/1Z6vL9eK0F9y6K8e9m', 'Aditi Agri Foods Pvt Ltd', '+919123456789', 'buyer', 'Maharashtra', 'Navi Mumbai', TRUE, TRUE, 'Verified Corporate Buyer'),
('a0000000-0000-0000-0000-000000000003', 'transporter@kisansetu.ai', '$2b$12$e80yq7KjF.f8wYhJ8r7fU.8L0QyU7e7fP6/1Z6vL9eK0F9y6K8e9m', 'Kisan Gati Logistics', '+919988776655', 'transporter', 'Madhya Pradesh', 'Indore', TRUE, TRUE, '18 Reefer Fleet Owner'),
('a0000000-0000-0000-0000-000000000004', 'expert@kisansetu.ai', '$2b$12$e80yq7KjF.f8wYhJ8r7fU.8L0QyU7e7fP6/1Z6vL9eK0F9y6K8e9m', 'Dr. Rameshwar Patil', '+919422011223', 'expert', 'Maharashtra', 'Pune', TRUE, TRUE, 'ICAR Senior Scientist'),
('a0000000-0000-0000-0000-000000000005', 'officer@kisansetu.ai', '$2b$12$e80yq7KjF.f8wYhJ8r7fU.8L0QyU7e7fP6/1Z6vL9eK0F9y6K8e9m', 'Sunita Sharma (IAS)', '+919811033445', 'government', 'Delhi', 'New Delhi', TRUE, TRUE, 'District Magistrate'),
('a0000000-0000-0000-0000-000000000006', 'admin@kisansetu.ai', '$2b$12$e80yq7KjF.f8wYhJ8r7fU.8L0QyU7e7fP6/1Z6vL9eK0F9y6K8e9m', 'KisanSetu Ops Console', '+918000011222', 'admin', 'Karnataka', 'Bengaluru', TRUE, TRUE, 'Super Administrator')
ON CONFLICT (email) DO NOTHING;
