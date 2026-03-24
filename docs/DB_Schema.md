# Lycns Protocol Schema Documentation

This document serves as the technical reference for the MVP **Lycns Protocol** backend architecture. It defines how data is structured off-chain (Supabase PostgreSQL) and on-chain (Solana PDA accounts), establishing a unified visual provenance registry.

---

## 🏛 System Overview

The Lycns Protocol relies on a **hybrid infrastructure**:
1.  **Solana (Anchor):** Holds the ultimate state of ownership, pricing, and visual truth (Visual Hash).
2.  **Supabase (PostgreSQL):** Acts as a high-speed caching and query layer, enabling fast UI loads and complex analytics (e.g., searching for C2PA camera types).

---

## 🗄 1. Supabase Database Schema

### `assets` Table (The Registry)
This table mirrors the Solana `Asset` accounts. It acts as a visual cache of registered images.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Internal primary key. |
| `owner_wallet` | `TEXT` | Solana public key of the creator. |
| **`pixel_hash`** | `TEXT` | **UNIQUE Index.** SHA-256 fingerprint of the visual pixels. |
| `p_hash`** | `TEXT` | pHash to perform visual similarity searches |
| `manifest_hash` | `TEXT` | SHA-256 fingerprint of the C2PA manifest. |
| `manifest_json` | `JSONB` | Extracted C2PA metadata for rich querying. |
| `license_hash ` | `TEXT` | SHA-256 of the specific license terms |
| `license_type` | `TEXT` | Default: `standard`. Options: `exclusive`, `limited`. |
| `image_url` | `TEXT` | URL pointing to Supabase Storage. |
| `price_lamports` | `BIGINT` | Price in Lamports (1 SOL = 1,000,000,000 lamports). |
| `trust_level` | `INTEGER` | `0` = Unverified, `1` = Software signed, `2` = Hardware signed. |
| `is_exclusive` | `BOOLEAN` | True if image can only be purchased once. |
| `is_sold` | `BOOLEAN` | True if the exclusive image has been bought. |
| `status` | `TEXT` | `active`, `disputed`, `locked`. |

---

### `purchases` Table (The Sales Ledger)
Keeps track of licensing transactions off-chain to power user "Libraries" and financial dashboards.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Primary key. |
| `asset_id` | `UUID` | Foreign Key $\rightarrow$ `assets.id`. |
| `buyer_wallet` | `TEXT` | Solana public key of the buyer. |
| `seller_wallet` | `TEXT` | Solana public key of the seller. |
| `asset_pda ` | `TEXT` |  The Solana PDA address of the asset |
| `license_hash ` | `TEXT` | SHA-256 of the specific license terms |
| `license_type` | `TEXT` | Default: `standard`. Options: `exclusive`, `limited`. |
| `license_terms_json` | `TEXT` | Full copy of the terms at the MOMENT of sale |
| **`tx_signature`** | `TEXT` | **UNIQUE.** The Solana transaction ID (On-chain proof of payment). |
| `price_paid_lamports` | `BIGINT` | Gross SOL spent by buyer. |
| `protocol_fee_lamports` | `BIGINT` | The 1.5% cut routed to the Lycns treasury. |
| `creator_net_lamports ` | `BIGINT` | The 98.5% the creator received |
---

### `disputes` Table (The Courtroom)
Logs claims where independent creators challenge an existing visual registry listing.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Primary key. |
| `asset_id` | `UUID` | Foreign Key $\rightarrow$ `assets.id`. |
| `challenger_wallet` | `TEXT` | Wallet filing the challenge. |
| `evidence_url` | `TEXT` | Link to the RAW file or high-fidelity evidence. |
| `evidence_manifest` | `JSONB` | C2PA data supporting the challenge. |
| `status` | `TEXT` | `open`, `resolved`, `rejected`. |

---

## 🪣 2. Supabase Storage & RLS Matrix

### `assets` Bucket
Stores the actual binary files. Configured as **Public** so frontends can serve visual media seamlessly.

| Operation | Target | Role | Condition |
| :--- | :--- | :--- | :--- |
| **SELECT** | DB & Storage | Public (`anon`) | Allowed. Anyone can verify image provenance. |
| **INSERT** | DB & Storage | Authenticated | Allowed (Via Lycns API after visual hashing verify). |
| **UPDATE** | DB | Authenticated | True (Restricted by API logic). |

---

## ☀️ 3. Solana Account Schema (Anchor)

On-chain state is localized in program-derived addresses (PDA). The visual fingerprint dictates the address.

### `Asset` Struct
```rust
pub struct Asset {
    pub owner: Pubkey,          // 32 bytes
    pub pixel_hash: [u8; 32],   // 32 bytes
    pub manifest_hash: [u8; 32],// 32 bytes
    pub price: u64,             // 8 bytes
    pub trust_level: u8,        // 1 byte
    pub is_exclusive: bool,     // 1 byte
    pub is_sold: bool,          // 1 byte
    pub bump: u8,               // 1 byte
}
```

> **Calculation Context:**
> Space Allocated = 8 (Anchor Discriminator) + 32 + 32 + 32 + 8 + 1 + 1 + 1 + 1 = **116 bytes**.
> **Seed Formulation:** `[b"asset", pixel_hash.as_ref()]`

---

### Key Workflows Derived from this Schema

1.  **Duplicate Detection (Anti-Piracy):** Because `pixel_hash` is unique on both Postgres and Solana (via PDA seeds), a thief uploading an exact pixel copy is stopped before compute is wasted.
2.  **Fractional Currencies:** By defaulting to `BIGINT` for lamports, we bypass float precision anomalies across JavaScript client environments.
3.  **Auditability:** Every `purchase` requires a unique `tx_signature`, giving your protocol mathematically sound revenue reporting.

---
