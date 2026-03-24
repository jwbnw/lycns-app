-- ==========================================
-- 1. EXTENSIONS & CLEANUP
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 2. THE ASSETS TABLE (The Registry)
-- ==========================================
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Identity & Blockchain Pointers
  owner_wallet TEXT NOT NULL,          -- The Solana Pubkey of the creator
  solana_address TEXT NOT NULL UNIQUE, -- The Program Derived Address (PDA) on-chain
  pixel_hash TEXT NOT NULL UNIQUE,     -- SHA-256 of raw pixels (Solana PDA Seed)
  p_hash TEXT NOT NULL,                -- Perceptual Hash for visual similarity checks
  
  -- Provenance & Legal
  manifest_hash TEXT,                  -- SHA-256 of the C2PA manifest (if exists)
  manifest_json JSONB,                 -- Full parsed C2PA assertions
  license_hash TEXT NOT NULL,          -- SHA-256 of the specific license terms
  license_type TEXT DEFAULT 'standard',-- human-readable label: 'standard', 'exclusive', etc.
  
  -- Metadata & Storage
  image_url TEXT NOT NULL,             -- Supabase Storage Path
  price_lamports BIGINT NOT NULL,      -- Price in SOL (1.0 SOL = 1,000,000,000)
  
  -- State & Trust
  trust_level INTEGER DEFAULT 0,       -- 0: Unverified, 1: Software, 2: Hardware
  is_exclusive BOOLEAN DEFAULT FALSE,
  is_sold BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active',        -- 'active', 'disputed', 'locked'
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================

-- Critical for looking up an asset's data directly from a Solana transaction
CREATE INDEX idx_assets_solana_address ON assets (solana_address);

-- Critical for the "Step 3" duplicate check (Exact match)
CREATE INDEX idx_assets_pixel_hash ON assets (pixel_hash);

-- Critical for the "Step 3" similarity check (Fuzzy match)
CREATE INDEX idx_assets_p_hash ON assets (p_hash);

-- Useful for the Creator Dashboard
CREATE INDEX idx_assets_owner_wallet ON assets (owner_wallet);

-- ==========================================
-- THE PURCHASES TABLE (The Legal Archive)
-- ==========================================
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id UUID REFERENCES assets(id) ON DELETE SET NULL, -- Keep record even if asset is hidden
  
  -- The "Contract" Pointers
  buyer_wallet TEXT NOT NULL,          -- The Newsroom/Buyer Pubkey
  seller_wallet TEXT NOT NULL,         -- The Creator/Seller Pubkey
  asset_pda TEXT NOT NULL,             -- The Solana PDA address of the asset
  
  -- The Legal Snapshots
  license_hash TEXT NOT NULL,          -- The SHA-256 fingerprint of the terms bought
  license_type TEXT NOT NULL,          -- 'editorial', 'exclusive', etc.
  license_terms_json JSONB,            -- Full copy of the terms at the MOMENT of sale
  
  -- The Financials
  tx_signature TEXT NOT NULL UNIQUE,   -- The 'Receipt' ID on Solana
  price_total_lamports BIGINT NOT NULL, -- The gross amount paid
  protocol_fee_lamports BIGINT NOT NULL, -- The 1.5% cut recorded
  creator_net_lamports BIGINT NOT NULL,  -- The 98.5% the creator received
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ==========================================
-- INDEXES FOR AUDITORS
-- ==========================================

-- For the Newsroom's "My Licenses" dashboard
CREATE INDEX idx_purchases_buyer ON purchases (buyer_wallet);

-- For the Creator's "Earnings" dashboard
CREATE INDEX idx_purchases_seller ON purchases (seller_wallet);

-- For verifying a specific image's sales history
CREATE INDEX idx_purchases_asset_pda ON purchases (asset_pda);

-- To prevent double-processing the same Solana transaction
CREATE INDEX idx_purchases_tx_signature ON purchases (tx_signature);

-- ==========================================
-- 4. DISPUTES TABLE (The Courtroom)
-- ==========================================
CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  
  -- The Parties
  challenger_wallet TEXT NOT NULL,
  
  -- The Evidence
  evidence_url TEXT,                   -- Link to the original/RAW file in storage
  evidence_manifest JSONB,             -- The C2PA manifest used to challenge
  dispute_reason TEXT NOT NULL,        -- e.g., 'Copyright Theft', 'AI Mislabeling'
  
  -- The State
  status TEXT DEFAULT 'open',          -- 'open', 'resolved', 'rejected', 'escalated'
  
  -- The Outcome (For the Archive)
  resolution_note TEXT,                -- Final notes from the Lycns Agent
  resolved_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Index for the Admin Dashboard to find open cases quickly
CREATE INDEX idx_disputes_status ON disputes (status);
CREATE INDEX idx_disputes_asset_id ON disputes (asset_id);

-- Enable RLS on all tables
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- ASSETS POLICIES
-- ==========================================

-- 1. Public Read: Anyone can see assets
CREATE POLICY "Public assets are viewable by everyone" 
ON assets FOR SELECT USING (true);

-- 2. Authenticated Insert: Users can only register their own assets
-- Note: This assumes your Auth provider stores the wallet address in the JWT metadata
CREATE POLICY "Users can insert their own assets" 
ON assets FOR INSERT 
WITH CHECK (auth.jwt() ->> 'wallet_address' = owner_wallet);

-- ==========================================
-- PURCHASES POLICIES (The "Legal Archive" Security)
-- ==========================================

-- 1. Private Read: Only the Buyer or Seller can see the receipt
CREATE POLICY "Buyers and Sellers can view their own receipts" 
ON purchases FOR SELECT 
USING (
  auth.jwt() ->> 'wallet_address' = buyer_wallet OR 
  auth.jwt() ->> 'wallet_address' = seller_wallet
);

-- 2. No Manual Inserts: We only allow the Backend to insert purchases
-- (This prevents users from faking a 'Successful' purchase in the DB)
-- We do this by NOT creating an INSERT policy for users.

-- ==========================================
-- DISPUTES POLICIES
-- ==========================================

-- 1. Challenger Access: Only the person who filed it can see it
CREATE POLICY "Challengers can view their own disputes" 
ON disputes FOR SELECT 
USING (auth.jwt() ->> 'wallet_address' = challenger_wallet);

-- 2. Create Dispute: Authenticated users can file a dispute
CREATE POLICY "Users can file a dispute" 
ON disputes FOR INSERT 
WITH CHECK (auth.jwt() ->> 'wallet_address' = challenger_wallet);

-- ==========================================
-- 5. STORAGE SETUP (Buckets)
-- ==========================================

-- 1. Public Assets (The Registered Images)
INSERT INTO storage.buckets (id, name, public)
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Private Evidence (The Courtroom Files)
-- We keep this private so only the Lycns Admin/Agent can see it.
INSERT INTO storage.buckets (id, name, public)
VALUES ('disputes', 'disputes', false)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 6. STORAGE POLICIES (RLS)
-- ==========================================

-- Allow anyone to view public assets
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'assets');

-- Only the owner or a Lycns Admin can see dispute evidence
CREATE POLICY "Private Evidence Access" ON storage.objects FOR SELECT 
USING (bucket_id = 'disputes' AND auth.uid() = owner);