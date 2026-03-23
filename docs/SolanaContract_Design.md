# Solana Program Technical Specification: Lycns Protocol

This documentation outlines the on-chain architecture for the Lycns Protocol. It defines the Program Derived Address (PDA) structure, instruction logic, and the security model used to enforce visual provenance.

---

## 🏗 1. Program Architecture

The program is built using the **Anchor Framework**. It uses a **Content-Addressable Storage** pattern, where the address of a metadata account is derived directly from the SHA-256 hash of the image's pixels.

### Program Derived Address (PDA) Seeds
To ensure a single "Source of Truth" for every unique image:
* **Seed 1:** `b"asset"` (Static prefix)
* **Seed 2:** `pixel_hash` (32-byte SHA-256 hash of the raw image data)
* **Address:** `Pubkey::find_program_address(&[seed1, seed2], program_id)`

> **Security Benefit:** This prevents "Double Registration." If two users attempt to register the same image, the second transaction will fail at the runtime level because the account already exists.

---

## 💾 2. State Schema (`Asset` Account)

The `Asset` account holds the "On-Chain Deed" to the media.

| Field | Type | Size (Bytes) | Description |
| :--- | :--- | :--- | :--- |
| **Discriminator** | `u8[8]` | 8 | Anchor internal account identifier. |
| **Owner** | `Pubkey` | 32 | The current controller/creator of the asset. |
| **Pixel Hash** | `u8[32]` | 32 | The immutable visual fingerprint. |
| **Manifest Hash** | `u8[32]` | 32 | The SHA-256 hash of the C2PA metadata. |
| **Price** | `u64` | 8 | Listing price in Lamports. |
| **Trust Level** | `u8` | 1 | `0`: Unverified, `1`: Software, `2`: Hardware. |
| **Is Exclusive** | `bool` | 1 | If true, only one purchase is allowed. |
| **Is Sold** | `bool` | 1 | Tracks if an exclusive buyout has occurred. |
| **Bump** | `u8` | 1 | The PDA nonce for address validation. |

**Total Space:** 116 Bytes

---

## ⚡ 3. Instruction Set

### `register_asset`
Initializes a new `Asset` account on-chain.
* **Validation:** Checks if the `pixel_hash` already has an associated PDA.
* **Logic:** Sets the initial `trust_level` based on the presence of a `manifest_hash`.
* **Requirement:** The signer must pay the rent for the account storage.

### `purchase_license`
Handles the atomic transfer of funds and rights.
* **Fee Split:** * **98.5%** $\rightarrow$ `Asset.owner`
    * **1.5%** $\rightarrow$ `Lycns_Treasury`
* **Guards:** * Fails if `is_exclusive == true` and `is_sold == true`.
    * Verifies the `owner` account passed in matches the `owner` stored in the `Asset` state.
* **State Change:** Updates `is_sold` to `true` if the asset is an exclusive buyout.

### `resolve_dispute`
An administrative "Correction" instruction.
* **Authority:** Limited to the `Protocol Admin` (or a Multisig).
* **Action:** Transfers the `owner` field to a new Pubkey and upgrades the `trust_level` to `2` (Verified) once C2PA evidence is confirmed off-chain.

---

## 🛡 4. Security & Constraints

* **Integrity:** The `pixel_hash` is immutable. Once registered, the visual identity of the asset cannot be changed.
* **Realloc Support:** The program is designed to use `realloc` if future license types require additional metadata fields (e.g., expiration timestamps).
* **Rent Exemption:** All accounts must maintain a minimum balance of SOL to remain on-chain (Rent-Exempt Minimum).

---

## 🚀 Deployment Config (`Anchor.toml`)

```toml
[programs.localnet]
lycns_protocol = "YourProgramIdHere"

[clusters.default]
cluster = "localnet"

[workspace]
types = "app/src/types" # Exports IDL for your Frontend
```

---

### Verification
To verify the program on-chain, ensure you include the **Source Code Hash** in your deployment so users can verify the Rust logic matches the deployed binary via **Solana Explorer**.
