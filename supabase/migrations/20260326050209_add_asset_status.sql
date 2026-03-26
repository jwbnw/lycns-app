--https://github.com/jwbnw/lycns-app/issues/1 

-- 1. Create the asset_status enum type if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'asset_upload_status') THEN
        CREATE TYPE asset_upload_status AS ENUM ('draft', 'pending', 'active', 'failed');
    END IF;
END $$;

-- 2. Add the status and signature columns to the assets table
-- We use DEFAULT 'draft' to ensure existing rows (if any) are populated
ALTER TABLE IF EXISTS public.assets 
ADD COLUMN IF NOT EXISTS status asset_upload_status DEFAULT 'draft' NOT NULL,
ADD COLUMN IF NOT EXISTS last_tx_signature TEXT;

-- 3. Add an index to the signature column 
-- This allows us to quickly find assets by their Solana transaction hash 
-- when we do the "Reconciliation/Sync" check
CREATE INDEX IF NOT EXISTS idx_assets_last_tx_signature ON public.assets (last_tx_signature);

-- 4. Add an index to status 
-- Useful for the "My Studio" page to filter out non-active uploads
CREATE INDEX IF NOT EXISTS idx_assets_upload_status ON public.assets (status);

-- 5. Helpful comment for the database schema
COMMENT ON COLUMN public.assets.status IS 'The lifecycle state of the asset: draft (uploaded), pending (on-chain tx sent), active (fully verified), failed (tx error).';