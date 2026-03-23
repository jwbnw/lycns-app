This documentation defines the **"Sandwich Flow"**—the precise orchestration between the Client (Next.js + Privy), the Blockchain (Solana), and the Off-chain Database (Supabase). 

In a provenance system, the integrity of this sequence is what prevents "ghost" registrations or database/ledger desyncs.

---

## 🥪 The Lycns "Sandwich" Architecture

The core philosophy: **Solana is the Master of Truth; Supabase is the Master of Discovery.**

### 1. High-Level Sequence Diagram


1.  **Phase 1 (The Pre-Check):** Client → Supabase. Ensure we aren't wasting gas on a duplicate.
2.  **Phase 2 (The Meat):** Client → Solana. The immutable, on-chain registration.
3.  **Phase 3 (The Post-Sync):** Client → Supabase. Indexing the on-chain success for the UI gallery.

---

## 🛠 2. Component Breakdown

### A. The Client (Next.js + Privy)
* **Role:** The Orchestrator.
* **Responsibility:** * Generates the `pixel_hash` locally (Privacy-first; the raw image never hits the server until it's "cleared").
    * Requests the user's signature via Privy's Embedded Wallet.
    * Broadcasts the transaction to the Solana RPC.

### B. The Validator API (Next.js Route / Supabase Edge Function)
* **Endpoint:** `/api/assets/check`
* **Logic:**
    * Queries `assets` table for the `pixel_hash`.
    * If found: Returns `409 Conflict`. Stops the flow before the user pays gas.
    * If not found: Returns `200 OK`. Provides a green light to proceed to the blockchain.

### C. The On-Chain Program (Anchor)
* **Role:** The Ledger.
* **Logic:** * Enforces PDA uniqueness via `seeds = [b"asset", pixel_hash]`.
    * Stores the `manifest_hash` (C2PA) and `owner_wallet`.
    * Emits a `RegisterEvent` (optional, for real-time listeners).

### D. The Discovery Layer (Supabase)
* **Role:** The Search Engine.
* **Logic:** * Stores a copy of the on-chain state + rich metadata (EXIF, C2PA JSON, Image URL).
    * Enables the "Gallery" view (searching/filtering that Solana cannot do efficiently).

---

## 🔄 3. Detailed Step-by-Step Flow

| Step | Actor | Action | Payload / Output |
| :--- | :--- | :--- | :--- |
| **1** | **User** | Uploads image in Next.js. | `File` object. |
| **2** | **Client** | `ImageHashingService` runs. | Returns `pixel_hash` (SHA-256). |
| **3** | **Client** | Calls `/api/assets/check`. | `exists: boolean` |
| **4** | **Client** | Privy triggers signature. | User approves SOL gas fee. |
| **5** | **Solana** | `register_asset` executed. | Returns `tx_signature`. |
| **6** | **Client** | Calls Supabase `insert`. | Writes `pixel_hash`, `tx_signature`, `image_url`. |
| **7** | **DB** | RLS (Row Level Security). | Validates that the `owner_wallet` matches the JWT. |

---

## ⚠️ 4. Failure Handling & Edge Cases

| Scenario | Resolution Strategy |
| :--- | :--- |
| **User rejects signature** | Flow terminates. No data written to DB or Chain. |
| **SOL Tx Fails (Gas/Slippage)** | UI shows error. User retries. DB remains empty. |
| **SOL Tx Succeeds, but DB fails** | **Critical Desync.** We implement a "Recovery" button: "Found on-chain but not in gallery? Click to sync." |
| **Double Spend Attack** | Solana PDA seeds will naturally reject the 2nd transaction even if the API check is bypassed. |

---

## 📡 5. Future Enhancement: The "Listener"
To make Step 6 (DB write) 100% reliable, we eventually move it from the **Frontend** to a **Background Worker**.
* **Web3 Listener:** A script that watches the Lycns Program ID.
* **Action:** Every time it sees a `RegisterAsset` instruction success, it automatically inserts the row into Supabase. This makes the system "Self-Healing."

---