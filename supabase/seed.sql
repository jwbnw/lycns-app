-- ==========================================
-- SEED DATA FOR LYCNS PROTOCOL (CLEAN VERSION)
-- ==========================================

-- 1. Seed a "Verified" Asset
INSERT INTO assets (
  id,
  owner_wallet,
  pixel_hash,
  manifest_hash,
  image_url,
  price_lamports,
  trust_level,
  license_type,
  is_exclusive,
  status,
  manifest_json
) VALUES (
  'e5b1b7a0-1234-4a5b-8c9d-111111111111',
  'Addr_Verified_Creator_1111', 
  'hash_pixel_verified_001', 
  'hash_manifest_verified_001',
  'https://placehold.co/600x400.png',
  1000000000, 
  2,          
  'standard',
  false,
  'active',
  '{"publisher": "Sony A7R V"}'
);

-- 2. Seed an "Unverified" Asset
INSERT INTO assets (
  id,
  owner_wallet,
  pixel_hash,
  image_url,
  price_lamports,
  trust_level,
  license_type,
  is_exclusive,
  status
) VALUES (
  'f6c2c8b1-5678-4b6c-9d0e-222222222222',
  'Addr_Thief_9999',
  'hash_pixel_unverified_002', 
  'https://placehold.co/400x400.png',
  500000000, 
  0,         
  'standard',
  false,
  'active'
);

-- 3. Seed a Purchase Record
INSERT INTO purchases (
  asset_id,
  buyer_wallet,
  seller_wallet,
  tx_signature,
  price_paid_lamports,
  protocol_fee_lamports,
  license_snapshot
) VALUES (
  'e5b1b7a0-1234-4a5b-8c9d-111111111111',
  'Addr_Buyer_5555',
  'Addr_Verified_Creator_1111',
  'sig_abc_123_confirmation_hash',
  1000000000,
  15000000,
  'standard'
);

-- 4. Seed an Open Dispute
INSERT INTO disputes (
  asset_id,
  challenger_wallet,
  status,
  evidence_manifest
) VALUES (
  'f6c2c8b1-5678-4b6c-9d0e-222222222222',
  'Addr_Real_Artist_7777',
  'open',
  '{"note": "Original RAW evidence provided"}'
);