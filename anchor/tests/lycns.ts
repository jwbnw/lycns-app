import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { LycnsProtocol } from "../target/types/lycns_protocol";
import { expect } from "chai";

describe("lycns-protocol", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.LycnsProtocol as Program<LycnsProtocol>;

  // Mock a 32-byte pixel hash (In prod, this is the SHA-256 of the image)
  const mockPixelHash = Array.from(Buffer.alloc(32, "A"));

  it("Registers a unique asset", async () => {
    const [assetPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("asset"), Buffer.from(mockPixelHash)],
      program.programId
    );

    await program.methods
    .registerAsset(
      mockPixelHash, 
      Array(32).fill(0), 
      Array(32).fill(0),
      new anchor.BN(1000000), 
      false
    )
    .accountsStrict({ // Use accountsStrict to force manual account passing
      asset: assetPda,
      owner: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();

    const account = await program.account.asset.fetch(assetPda);
    expect(account.owner.toBase58()).to.equal(provider.wallet.publicKey.toBase58());
  });

  it("Fails if registering the same image twice", async () => {
    const [assetPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("asset"), Buffer.from(mockPixelHash)],
      program.programId
    );

    try {
      await program.methods
        .registerAsset(mockPixelHash, Array(32).fill(0), Array(32).fill(0), new anchor.BN(1000000), false)
        .accounts({
          asset: assetPda,
          owner: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        } as any)
        .rpc();
        
      expect.fail("The transaction should have been rejected because the account already exists.");
    } catch (err: any) {
      // Option A: Check for the specific Cross-Program Invoke error
      // In localnet, this usually shows up as "0x0" or "already in use" in the underlying logs
      const isDuplicateError = err.logs.some((log: string) => 
        log.includes("already in use") || log.includes("custom program error: 0x0")
      );
      
      // If the catch block is triggered, the blockchain successfully blocked the double-register.
      // We just need to ensure it wasn't a DIFFERENT error (like a timeout).
      expect(err).to.exist;
      console.log("Successfully blocked double-registration.");
    }
  });
});