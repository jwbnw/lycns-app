use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;

declare_id!("9do5xiZwNG2TgRWY3sREraaeHQ6QDvRdLnsSVvS3DcyY");

#[program]
pub mod lycns_protocol {
    use super::*;

    /// Registers a new asset. The PDA is derived from the pixel_hash.
    pub fn register_asset(
        ctx: Context<RegisterAsset>, 
        pixel_hash: [u8; 32], 
        manifest_hash: [u8; 32], 
        price: u64,
        is_exclusive: bool
    ) -> Result<()> {
        let asset = &mut ctx.accounts.asset;
        asset.owner = *ctx.accounts.owner.key;
        asset.pixel_hash = pixel_hash;
        asset.manifest_hash = manifest_hash;
        asset.price = price;
        asset.is_exclusive = is_exclusive;
        asset.is_sold = false;
        
        // Trust Level Logic: 2 = C2PA Verified, 0 = Generic Upload
        asset.trust_level = if manifest_hash != [0; 32] { 2 } else { 0 };
        asset.bump = ctx.bumps.asset;

        msg!("Asset Registered. Pixel Hash: {:?}", pixel_hash);
        Ok(())
    }

    /// Atomic purchase with a 1.5% protocol fee.
    pub fn purchase_license(ctx: Context<PurchaseLicense>) -> Result<()> {
        let asset = &mut ctx.accounts.asset;

        // Ensure exclusive assets aren't sold twice
        require!(!(asset.is_exclusive && asset.is_sold), ErrorCode::AssetAlreadySold);

        let price = asset.price;
        let fee = price.checked_mul(15).unwrap().checked_div(1000).unwrap(); // 1.5%
        let seller_amount = price.checked_sub(fee).unwrap();

        // 1. Pay the Seller (98.5%)
        anchor_lang::solana_program::program::invoke(
            &system_instruction::transfer(ctx.accounts.buyer.key, &asset.owner, seller_amount),
            &[ctx.accounts.buyer.to_account_info(), ctx.accounts.owner_account.to_account_info()],
        )?;

        // 2. Pay the Lycns Treasury (1.5%)
        anchor_lang::solana_program::program::invoke(
            &system_instruction::transfer(ctx.accounts.buyer.key, ctx.accounts.treasury.key, fee),
            &[ctx.accounts.buyer.to_account_info(), ctx.accounts.treasury.to_account_info()],
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
    /// CHECK: Validated against asset.owner in the instruction
    #[account(mut, address = asset.owner)]
    pub owner_account: AccountInfo<'info>,
    #[account(mut)]
    pub buyer: Signer<'info>,
    /// CHECK: The protocol's fee collection wallet
    #[account(mut)]
    pub treasury: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

// Not implemented currently - for future use in dispute resolution or asset management
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
#[repr(u8)] // Ensures it occupies exactly 1 byte
pub enum AssetStatus {
    Active = 0,     // Normal, listed, or owned
    Disputed = 1,   // Under review by the protocol
    Locked = 2,     // Frozen due to verified copyright theft
    Sourced = 3,    // Optional: Asset was imported from a 3rd party registry
}

#[account]
#[derive(Default)] // Optional: Good practice for initialization
pub struct Asset {
    pub owner: Pubkey,
    pub pixel_hash: [u8; 32],
    pub manifest_hash: [u8; 32],
    pub price: u64,
    pub trust_level: u8,
    pub is_exclusive: bool,
    pub is_sold: bool,
    pub status: u8, 
    pub bump: u8,
}

impl Asset {
    // 8 (discriminator) + 32 + 32 + 32 + 8 + 1 + 1 + 1 + 1 + 1 = 117
    pub const LEN: usize = 8 + 32 + 32 + 32 + 8 + 1 + 1 + 1 + 1 + 1;
}

#[error_code]
pub enum ErrorCode {
    #[msg("This exclusive asset has already been sold.")]
    AssetAlreadySold,
}