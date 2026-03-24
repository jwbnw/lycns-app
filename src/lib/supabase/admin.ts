import { createClient } from '@supabase/supabase-js';

// Environment variables are accessed via process.env in Node.js/Next.js
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase Admin Environment Variables');
}

// This client has "God Mode" (Service Role)
// Use it ONLY in /api routes (server-side), never in client components!
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});