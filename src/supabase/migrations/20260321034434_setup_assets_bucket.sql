-- 1. Create the 'assets' bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow anyone to view images in the 'assets' bucket
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'assets');

-- 3. Allow authenticated users to upload to the 'assets' bucket
-- Note: In the POC, 'authenticated' usually refers to users logged in via Privy or Supabase Auth.
CREATE POLICY "Authenticated Upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'assets' AND 
    auth.role() = 'authenticated'
  );