import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

/*
NOTE: NEED PROPER AUTHENTICATION & AUTHORIZATION IN PRODUCTION. (Privy or similar)

The purpose of this API route is to handle the creation of a new asset draft. 
It receives the uploaded file, stores it in Supabase Storage, and creates a c
orresponding record in the database with a "draft" status. 
This allows the user to later finalize the asset once the leger (solana) write is confrimed
by providing additional metadata and changing its status to "active".
*/

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const pixelHash = formData.get('pixelHash') as string;
    const ownerWallet = formData.get('ownerWallet') as string; // Temp: Trusting the frontend

    const fileName = `${pixelHash}-${Date.now()}.jpg`;
    
    // Upload to Storage
    const { error: storageError } = await supabaseAdmin.storage
      .from('assets')
      .upload(fileName, file);

    if (storageError) throw storageError;

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('assets')
      .getPublicUrl(fileName);

    // Create Draft Record
    const { data: asset, error: dbError } = await supabaseAdmin
      .from('assets')
      .insert({
        pixel_hash: pixelHash,
        owner_wallet: ownerWallet,
        image_url: publicUrl,
        status: 'draft',
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({ assetId: asset.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}