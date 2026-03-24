// File for housing the standard license templates and hashing logic for Solana instructions

export const STANDARD_EDITORIAL_LICENSE = {
    "version": "1.0.0",
    "license_name": "Lycns Standard Editorial",
    "terms": {
      "usage_scope": "Editorial only. No commercial/advertising use.",
      "territory": "Worldwide",
      "duration": "Perpetual",
      "transferability": "Non-transferable",
      "attribution": "Required (Format: 'Name / Lycns')",
      "modifications": "Standard cropping and color correction allowed. No AI-generative manipulation."
    },
    "governance": {
      "jurisdiction": "New York, USA",
      "dispute_resolution": "Lycns Protocol Arbitration"
    }
  }

/**
 * Generates the 32-byte hash for the Solana Instruction
 */
export async function getLicenseHash(licenseObj: object): Promise<Buffer> {
  const content = JSON.stringify(licenseObj);
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(content));
  return Buffer.from(hash);
}