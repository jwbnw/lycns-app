use anchor_lang::prelude::*;

declare_id!("9do5xiZwNG2TgRWY3sREraaeHQ6QDvRdLnsSVvS3DcyY");

#[program]
pub mod anchor {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
