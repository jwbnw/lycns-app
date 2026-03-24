-- ==========================================
-- SEED DATA FOR LYCNS PROTOCOL
-- ==========================================

-- 1. Create a "Test Creator" Asset
-- This asset represents a high-trust, Hardware-verified image (Trust Level 2)
INSERT INTO assets (
  owner_wallet,
  solana_address,
  pixel_hash,
  p_hash,
  license_hash,
  license_type,
  image_url,
  price_lamports,
  trust_level,
  is_exclusive,
  status
) VALUES (
  'DxH9v86A5f5N6X8X1X8X8X8X8X8X8X8X8X8X8X8X8X8', -- Mock Creator Wallet
  '7nE9v86A5f5N6X8X1X8X8X8X8X8X8X8X8X8X8X8X8X8', -- Mock Asset PDA
  'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', -- SHA-256 for "Empty File"
  'f0f0f0f0f0f0f0f0', -- Mock pHash
  '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', -- Mock License Hash (Editorial v1)
  'editorial',
  'https://placehold.co/600x400/png?text=Verified+Asset',
  1500000000, -- 1.5 SOL
  2, -- Hardware Verified
  false,
  'active'
);

-- 2. Create a "Sold Exclusive" Asset
-- Proves the 'is_sold' and 'is_exclusive' logic
INSERT INTO assets (
  owner_wallet,
  solana_address,
  pixel_hash,
  p_hash,
  license_hash,
  license_type,
  image_url,
  price_lamports,
  trust_level,
  is_exclusive,
  is_sold,
  status
) VALUES (
  'DxH9v86A5f5N6X8X1X8X8X8X8X8X8X8X8X8X8X8X8X8',
  'AvK9v86A5f5N6X8X1X8X8X8X8X8X8X8X8X8X8X8X8X8',
  'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce',
  'aaaaaaaaaaaaaaaa',
  '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
  'exclusive',
  'https://placehold.co/600x400/png?text=Sold+Exclusive',
  5000000000, -- 5.0 SOL
  1, -- Software Verified
  true,
  true,
  'active'
);

-- 3. Seed a Purchase Record (The Newsroom Archive)
-- Ties the sold exclusive asset to a buyer
INSERT INTO purchases (
  asset_id,
  buyer_wallet,
  seller_wallet,
  asset_pda,
  license_hash,
  license_type,
  license_terms_json,
  tx_signature,
  price_total_lamports,
  protocol_fee_lamports,
  creator_net_lamports
) VALUES (
  (SELECT id FROM assets WHERE is_exclusive = true LIMIT 1),
  'BuyerX9v86A5f5N6X8X1X8X8X8X8X8X8X8X8X8X8X8X',
  'DxH9v86A5f5N6X8X1X8X8X8X8X8X8X8X8X8X8X8X8X8',
  'AvK9v86A5f5N6X8X1X8X8X8X8X8X8X8X8X8X8X8X8X8',
  '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
  'exclusive',
  '{"terms": "Full exclusive buyout", "usage": "All Media", "duration": "Perpetual"}',
  '5ztY86A5f5N6X8X1X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X', -- Mock TX
  5000000000, -- 5.0 SOL
  75000000,   -- 1.5% Fee (0.075 SOL)
  4925000000  -- 98.5% Net (4.925 SOL)
);

-- 4. Seed a Dispute
-- Shows an asset being contested
INSERT INTO disputes (
  asset_id,
  challenger_wallet,
  dispute_reason,
  status,
  evidence_url,
  evidence_manifest
) VALUES (
  (SELECT id FROM assets WHERE trust_level = 2 LIMIT 1),
  'BadActor86A5f5N6X8X1X8X8X8X8X8X8X8X8X8X8X8',
  'Copyright Theft: I own the original RAW file.',
  'open',
  'https://placehold.co/600x400/png?text=Evidence+File',
  '{"assertion": "original_timestamp", "value": "2024-01-01T00:00:00Z"}'
);