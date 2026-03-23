const { bmvbhash } = require('blockhash')

const NORMALIZE_SIZE = 1000;

const loadImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });

export async function generateImageFingerprints(file: File) {
  const objectUrl = URL.createObjectURL(file);

  try {
    const img = await loadImage(objectUrl);
    
    // 1. Setup Canvas for SHA-256 (Detailed 1000x1000)
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("Canvas context unavailable");

    canvas.width = NORMALIZE_SIZE;
    canvas.height = NORMALIZE_SIZE;
    ctx.drawImage(img, 0, 0, NORMALIZE_SIZE, NORMALIZE_SIZE);

    // --- SHA-256 Pixel Hash (For Solana) ---
    const imageData = ctx.getImageData(0, 0, NORMALIZE_SIZE, NORMALIZE_SIZE);
    const shaBuffer = await crypto.subtle.digest("SHA-256", imageData.data);
    const pixelHash = new Uint8Array(shaBuffer);
    const pixelHashHex = Array.from(pixelHash).map(b => b.toString(16).padStart(2, '0')).join('');

    // --- pHash (For Supabase Similarity Search) ---
    // bmvbhash works best with its own internal scaling logic
    // but we can pass our standard canvas data for consistency.
    const pHashHex = bmvbhash(imageData, 16); // Generates a 64-bit hex string

    return {
      pixelHash,      // Uint8Array for Solana instruction
      pixelHashHex,   // String for Supabase lookup
      pHashHex,       // String for Supabase similarity search
    };

  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}