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
    const pHash = formData.get('pHash') as string;
    const ownerWallet = formData.get('ownerWallet') as string; // Temp: Trusting the frontend
    const manifestHash = formData.get('manifestHash') as string;
    const manifestJson = formData.get('manifestJson ') as string;
    const licenseHash  = formData.get('licenseHash') as string;
    const licenseType = formData.get('licenseType') as string;
    const priceLamports = formData.get('priceLamports') as string;

    // TODO: const trustLevel = formData.get('trustLevel') as string; // We will need to build a class to examine the manifest on the server to check if hardware or software 

    
    const fileName = `${pixelHash}${Date.now()}.png`;
    
    // Probably do serverside verification of the file type and size here in a production environment to prevent abuse, 
    //but for now we will trust the frontend.

    // Upload to Storage
    const { error: storageError } = await supabaseAdmin.storage
      .from('assets')
      .upload(fileName, file, {contentType: 'image/png', // Use the actual file type detected
        cacheControl: '3600',
        upsert: false})
      ;

    if (storageError) throw storageError;

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('assets')
      .getPublicUrl(fileName);

    // Create Draft Record
    const { data: asset, error: dbError } = await supabaseAdmin
      .from('assets')
      .insert({
        pixel_hash: pixelHash,
        p_hash: pHash,
        manifest_hash: manifestHash,
        manifest_json: manifestJson,
        license_hash: licenseHash,
        license_type: licenseType,
        price_lamports: priceLamports,
        owner_wallet: ownerWallet,
        image_url: publicUrl,
        status: 'draft',
      })
      .select()
      .single();

    if (dbError) throw dbError; // In a production environment, we would want to handle this more gracefully, potentially rolling back the storage upload if the database insert fails. Also Log..

    return NextResponse.json({ assetId: asset.id });
  } catch (err: any) {
    // probs log this and not return to the client
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}