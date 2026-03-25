# 🛡️ Lycns Protocol (MVP)
### *Secure Provenance & Instant Licensing for Creators and Newsrooms*

Lycns is a decentralized protocol designed to empower photographers and protect digital integrity. By combining hardware-level hashing with blockchain-enforced licensing, Lycns provides creators with a "one-click" storefront for their assets and newsrooms with a verifiable audit trail.

---

## ✨ Key Value Propositions

### For Photographers (Creators)
* **Instant Monetization:** Sell editorial or exclusive licenses directly from your own "on-chain" portfolio.
* **Copyright Protection:** Establish a permanent, timestamped "Proof of Existence" on the Solana blockchain.
* **Anti-Theft:** Integrated pHash (Perceptual Hashing) identifies if your work is being re-uploaded or minorly altered without a license.

### For Newsrooms (Licensees)
* **Verifiable Provenance:** Confirm the origin and "Trust Level" (Software vs. Hardware-signed) of an image.
* **Legal Compliance:** Every purchase generates a cryptographically linked license agreement.
* **Transparent Fees:** No hidden agency cuts; 98.5% goes directly to the creator.

---

## 🚀 The Stack
* **Frontend:** [Next.js 16](https://nextjs.org/) (App Router) + [Tailwind CSS 4](https://tailwindcss.com/)
* **Blockchain:** [Solana](https://solana.com/) + [Anchor Framework](https://www.anchor-lang.com/) (Rust)
* **Backend/Database:** [Supabase](https://supabase.com/) (PostgreSQL + RLS + Storage)
* **Language:** TypeScript (Strict Mode)

---

## 🏗️ How it Works: The Triple Lock

Lycns ensures asset integrity through three distinct layers of verification:

1.  **The Visual Lock (Supabase):** Images are processed via **pHash** (Perceptual Hashing) to prevent visual duplicates (even if resized/re-encoded) and **SHA-256** (`pixel_hash`) for exact file identity.
    
2.  **The Legal Lock (Solana):** A unique **Program Derived Address (PDA)** is generated on-chain for every image using the `pixel_hash` as a seed. This PDA stores the `license_hash`, `price`, and `owner` permanently.

3.  **The Financial Lock (Rust):** The smart contract enforces a **1.5% protocol fee** (150 basis points) on all purchases, automatically routing funds to the Lycns Treasury and 98.5% to the creator instantly.

---

## 🛠️ Local Development Setup

### 1. Prerequisites
* [Node.js](https://nodejs.org/) (v20+)
* [Rust & Anchor](https://www.anchor-lang.com/docs/installation)
* [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
* [Supabase CLI](https://supabase.com/docs/guides/cli)

### 2. Environment Configuration
Create a `.env.local` in the **project root**:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=[https://your-project-id.supabase.co](https://your-project-id.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-secret-service-role-key

# Solana Configuration
NEXT_PUBLIC_SOLANA_NETWORK=localhost
```

### 3. Initialize the Backend (Supabase)
Lycns uses Supabase for image storage and asset indexing.
```bash
# Start the Supabase local stack (Postgres, Storage, Studio)
supabase start

# Reset the DB and run migrations/seeds
npm run db:reset
```
Note: Once started, access your local Supabase Dashboard at http://localhost:54323.

### 4. Deploy the Smart Contract (Anchor)
The Lycns Protocol logic lives on the Solana blockchain.
```bash
# Start a local Solana validator in a separate terminal
solana-test-validator

# Build the Rust program and generate the TypeScript IDL
npm run anchor:build

# Deploy the program to your local validator
cd anchor && anchor deploy
```

### 5. Run the Frontend
Launch the Next.js application to interact with the protocol.
```bash
# Install Node dependencies
npm install

# Start the development server
npm run dev
```

---

## 📂 Project Structure

The project is organized into three main layers: the **On-Chain Layer** (Anchor), the **Service Layer** (Next.js APIs), and the **Client Layer** (React).

* **`anchor/`**: Rust smart contracts defining the `Asset` accounts and registration logic.
* **`src/app/api/`**:
    * `/assets/check`: The "Gatekeeper" that validates image uniqueness.
    * `/assets/register`: The "Closer" that handles storage and DB persistence.
* **`src/lib/`**:
    * `anchor/`: Generated IDL and TypeScript helpers for wallet interaction.
    * `supabase/`: Configuration for the `public` and `admin` (service role) clients.
    * `services/`: The Hashing Service for `pixel_hash` and `p_hash` generation.
* **`supabase/`**: Local configuration, SQL migrations, and seed files for the database.

---

## 📜 Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| **dev** | `next dev` | Runs the Next.js app in development mode. |
| **anchor:build** | `cd anchor && anchor build` | Compiles Rust program and updates the TypeScript IDL. |
| **anchor:test** | `cd anchor && anchor test` | Runs the Anchor test suite (local validator required). |
| **db:reset** | `supabase db reset` | Resets local Supabase DB and re-runs migration/seed files. |
| **solana:logs** | `solana logs -u localhost` | Streams real-time program logs from the local validator. |

---

## ⚖️ License
Standard Lycns Editorial License - See `src/lib/licensing.ts` for terms.