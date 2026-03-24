import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pixel_hash, p_hash } = body;

    if (!pixel_hash || !p_hash) {
      return NextResponse.json({ error: "Hashes missing" }, { status: 400 });
    }

    // 1. Check for Exact File Duplicate (SHA-256)
    const { data: exactMatch } = await supabaseAdmin
      .from('assets')
      .select('id, owner_wallet')
      .eq('pixel_hash', pixel_hash)
      .maybeSingle(); // .single() throws error if 0 rows, .maybeSingle() is cleaner

    if (exactMatch) {
      return NextResponse.json({ 
        available: false, 
        reason: 'EXACT_DUPLICATE',
        message: 'This exact file is already registered.' 
      }, { status: 409 });
    }

    // 2. Check for Visual Similarity (pHash)
    // Even if it's a different file, is the content the same?
    const { data: visualMatch } = await supabaseAdmin
      .from('assets')
      .select('id, owner_wallet')
      .eq('p_hash', p_hash)
      .maybeSingle();

    //Note this should be improved by hammering/testing the pHash threshold and algorithm in the future, but for now we want to be strict to prevent abuse.
    if (visualMatch) {
      return NextResponse.json({ 
        available: false, 
        reason: 'VISUAL_MATCH',
        message: 'A visually identical image is already registered by another creator.' 
      }, { status: 409 });
    }

    // 3. Success
    return NextResponse.json({ 
      available: true,
      message: "Asset is unique."
    });

  } catch (err) {
    console.error("Check API Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}