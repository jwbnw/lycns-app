import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';


/*
NOTE: NEED PROPER AUTHENTICATION & AUTHORIZATION IN PRODUCTION. (Privy or similar)

The purpose of this API route is to finalize an asset but updating state
and providing the records from the ledger after 
the user has successfully completed the leger (solana) write.
*/

export async function POST(req: Request) {
  try {
    const { assetId, signature, pdaAddress } = await req.json();

    const { error } = await supabaseAdmin
      .from('assets')
      .update({ 
        status: 'active',
        solana_address: pdaAddress,
        last_tx_signature: signature 
      })
      .eq('id', assetId);

    if (error) throw error; // In a production environment, we would want to handle this more gracefully, potentially rolling back the storage upload if the database insert fails. Also Log..

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}