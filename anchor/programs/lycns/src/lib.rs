use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;

declare_id!("9do5xiZwNG2TgRWY3sREraaeHQ6QDvRdLnsSVvS3DcyY");

#[program]
pub mod lycns_protocol {
    use super::*;

    pub fn register_asset(
        ctx: Context<RegisterAsset>, 
        pixel_hash: [u8; 32], 
        manifest_hash: [u8; 32], 
        license_hash: [u8; 32], // Added for Newsroom Archiving
        price: u64,
        is_exclusive: bool
    ) -> Result<()> {
        let asset = &mut ctx.accounts.asset;
        asset.owner = *ctx.accounts.owner.key;
        asset.pixel_hash = pixel_hash;
        asset.manifest_hash = manifest_hash;
        asset.license_hash = license_hash; // Permanent record of terms
        asset.price = price;
        asset.is_exclusive = is_exclusive;
        asset.is_sold = false;
        
        // Defaulting to Active and Unverified (Backend handles upgrades later)
        asset.status = AssetStatus::Active as u8;
        asset.bump = ctx.bumps.asset;

        msg!("Asset Registered with License: {:?}", license_hash);
        Ok(())
    }

    pub fn purchase_license(ctx: Context<PurchaseLicense>) -> Result<()> {
        let asset = &mut ctx.accounts.asset;

        // Ensure asset is active and available
        require!(asset.status == AssetStatus::Active as u8, ErrorCode::AssetNotActive);
        require!(!(asset.is_exclusive && asset.is_sold), ErrorCode::AssetAlreadySold);

        let price = asset.price;
        
        // Fee Logic: 1.5% (150 basis points)
        // Basis points (bps) are standard to avoid floating point math errors
        let fee = price.checked_mul(150).unwrap().checked_div(10000).unwrap(); 
        let seller_amount = price.checked_sub(fee).unwrap();

        // 1. Pay the Seller (98.5%)
        anchor_lang::solana_program::program::invoke(
            &system_instruction::transfer(ctx.accounts.buyer.key, &asset.owner, seller_amount),
            &[
                ctx.accounts.buyer.to_account_info(), 
                ctx.accounts.owner_account.to_account_info(),
                ctx.accounts.system_program.to_account_info()
            ],
        )?;

        // 2. Pay the Lycns Treasury (1.5%)
        anchor_lang::solana_program::program::invoke(
            &system_instruction::transfer(ctx.accounts.buyer.key, ctx.accounts.treasury.key, fee),
            &[
                ctx.accounts.buyer.to_account_info(), 
                ctx.accounts.treasury.to_account_info(),
                ctx.accounts.system_program.to_account_info()
            ],
        )?;

        if asset.is_exclusive {
            asset.is_sold = true;
        }

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(pixel_hash: [u8; 32])]
pub struct RegisterAsset<'info> {
    #[account(
        init, 
        payer = owner, 
        space = Asset::LEN,
        seeds = [b"asset", pixel_hash.as_ref()], 
        bump
    )]
    pub asset: Account<'info, Asset>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PurchaseLicense<'info> {
    #[account(mut)]
    pub asset: Account<'info, Asset>,
    /// CHECK: Validated against asset.owner
    #[account(mut, address = asset.owner)]
    pub owner_account: AccountInfo<'info>,
    #[account(mut)]
    pub buyer: Signer<'info>,
    /// CHECK: Hardcode this in production or use a config account
    #[account(mut)]
    pub treasury: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(Default)]
pub struct Asset {
    pub owner: Pubkey,           // 32
    pub pixel_hash: [u8; 32],    // 32
    pub manifest_hash: [u8; 32], // 32
    pub license_hash: [u8; 32],  // 32 (New Archival Field)
    pub price: u64,              // 8
    pub trust_level: u8,         // 1
    pub status: u8,              // 1
    pub is_exclusive: bool,      // 1
    pub is_sold: bool,           // 1
    pub bump: u8,                // 1
}

impl Asset {
    // 8 (disc) + 32 + 32 + 32 + 32 + 8 + 1 + 1 + 1 + 1 + 1 = 149 bytes
    pub const LEN: usize = 8 + 32 + 32 + 32 + 32 + 8 + 1 + 1 + 1 + 1 + 1;
}


// For future dispute resolution and trust management features, we can use these enums to track asset status and trust levels.
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
#[repr(u8)]
pub enum AssetStatus {
    Active = 0,
    Disputed = 1,
    Locked = 2,
}

/*-- Currently Not Implemented. Unsure if will put onchain or handle offchain. Keeping for future reference --*/
/*
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
#[repr(u8)]
pub enum TrustLevel {
    Unverified = 0,
    Software = 1,
    Hardware = 2,
}
*/

#[error_code]
pub enum ErrorCode {
    #[msg("This exclusive asset has already been sold.")]
    AssetAlreadySold,
    #[msg("This asset is not currently active for purchase.")]
    AssetNotActive,
}