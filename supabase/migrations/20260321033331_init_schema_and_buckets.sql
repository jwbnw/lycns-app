-- ==========================================
-- 1. EXTENSIONS & CLEANUP
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 2. THE ASSETS TABLE (The Registry)
-- ==========================================
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_wallet TEXT NOT NULL,          -- The Solana Pubkey of the creator
  pixel_hash TEXT NOT NULL UNIQUE,      -- SHA-256 of raw pixels (Solana PDA Seed)
  p_hash TEXT,                          -- pHash for quick visual similarity checks (not unique)
  manifest_hash TEXT,                  -- SHA-256 of the C2PA manifest
  manifest_json JSONB,                 -- Full parsed C2PA assertions for querying
  
  image_url TEXT NOT NULL,             -- Supabase Storage Path
  price_lamports BIGINT NOT NULL,      -- Price in SOL (1 SOL = 1,000,000,000 lamports)
  
  trust_level INTEGER DEFAULT 0,       -- 0: Unverified, 1: Software Sign, 2: Hardware (C2PA)
  license_type TEXT DEFAULT 'standard',-- 'standard', 'exclusive', 'limited'
  
  is_exclusive BOOLEAN DEFAULT FALSE,
  is_sold BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active',        -- 'active', 'disputed', 'locked'
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Indexes for the "Visual Fingerprint" and owner lookups
CREATE INDEX idx_assets_pixel_hash ON assets (pixel_hash);
CREATE INDEX idx_assets_owner_wallet ON assets (owner_wallet);

-- ==========================================
-- 3. THE PURCHASES TABLE (The Sales Ledger)
-- ==========================================
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  buyer_wallet TEXT NOT NULL,          -- The Solana Pubkey of the buyer
  seller_wallet TEXT NOT NULL,         -- The Solana Pubkey of the creator
  
  tx_signature TEXT NOT NULL UNIQUE,   -- The Solana Transaction ID (Proof of Payment)
  price_paid_lamports BIGINT NOT NULL,
  protocol_fee_lamports BIGINT NOT NULL, -- The 1.5% cut for the Lycns Agent
  
  license_snapshot TEXT DEFAULT 'standard', -- Rights granted at time of purchase
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_purchases_buyer ON purchases (buyer_wallet);
CREATE INDEX idx_purchases_asset ON purchases (asset_id);

-- ==========================================
-- 4. DISPUTES TABLE (The Courtroom)
-- ==========================================
CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  challenger_wallet TEXT NOT NULL,
  evidence_url TEXT,                   -- Link to the original/RAW file in storage
  evidence_manifest JSONB,             -- The C2PA manifest used to challenge
  status TEXT DEFAULT 'open',          -- 'open', 'resolved', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ==========================================
-- 5. STORAGE SETUP (Buckets)
-- ==========================================
-- Create the bucket for image storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

-- =================