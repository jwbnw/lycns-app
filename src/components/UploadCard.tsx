"use client"

import { useRouter } from "next/navigation"
import React, { useState } from 'react'
import exifr from 'exifr'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function UploadCard() {
  const [file, setFile] = useState<File | null>(null)
  const [metadata, setMetadata] = useState<any>(null)
  const [isMinting, setIsMinting] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  // 1. Process the file but DON'T navigate yet
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setIsProcessing(true)
    setFile(selectedFile)

    try {
      const exifData = await exifr.parse(selectedFile, {
        gps: true,
        tiff: true
      })
      
      const lycnsMetadata = {
        camera: `${exifData.Make || ''} ${exifData.Model || ''}`.trim() || "Unknown",
        location: exifData.latitude ? `${exifData.latitude.toFixed(4)}, ${exifData.longitude.toFixed(4)}` : "Private",
        timestamp: exifData.DateTimeOriginal ? new Date(exifData.DateTimeOriginal).toLocaleDateString() : new Date().toLocaleDateString(),
        integrity: exifData.Software ? `Edited with ${exifData.Software}` : "Original"
      }
      
      // Store metadata in state to show the user or pass on later
      setMetadata(lycnsMetadata)
      console.log("Metadata Ready:", lycnsMetadata)
      
    } catch (err) {
      console.error("EXIF Error:", err)
    } finally {
      setIsProcessing(false)
    }
  }

  // 2. Handle the navigation only when the button is clicked
  const handleMint = () => {
    if (!file || !metadata) return

    setIsMinting(true)
    
    // Simulate the "Securing" delay
    setTimeout(() => {
      setIsMinting(false)
      
      // Pass the metadata we gathered in step 1 to the next page
      const params = new URLSearchParams({
        ...metadata,
        fileName: file.name
      })
      
      router.push(`/setup?${params.toString()}`)
    }, 2000)
  }
// ... (keep your imports and logic same)

// ... (keep logic same)

return (
  /* w-full makes it mobile friendly, max-w-md stops it from getting too huge */
  <Card className="w-full max-w-md bg-zinc-950 border-zinc-800 text-zinc-100 mx-auto">
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="text-xl font-bold tracking-tight">LYCNS</CardTitle>
        <Badge variant="outline" className="text-emerald-500 border-emerald-500/50">
          C2PA Ready
        </Badge>
      </div>
    </CardHeader>
    
    <CardContent className="space-y-4">
      {/* THE FIX: 
          1. h-48 locks the vertical height so it NEVER shrinks vertically.
          2. items-center + justify-center keeps content pinned to the middle.
      */}
      <div 
        className="relative h-48 w-full border-2 border-dashed border-zinc-800 rounded-lg p-6 flex flex-col items-center justify-center hover:border-zinc-700 transition-all overflow-hidden bg-zinc-900/20"
        onDragOver={(e) => e.preventDefault()}
      >
        {isProcessing ? (
          <div className="space-y-2 text-center">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Analyzing</p>
          </div>
        ) : (
          <div className="w-full text-center space-y-4">
            {/* This div has a fixed height so the 'Browse' link doesn't move */}
            <div className="h-12 flex items-center justify-center px-2">
              <p className="text-sm text-zinc-400 font-medium break-all line-clamp-2">
                {file ? file.name : "Drag photo here to secure license"}
              </p>
            </div>
            
            <div className="pt-2">
              <input 
                type="file" 
                className="hidden" 
                onChange={handleFileChange} 
                id="photo-upload"
                accept="image/*"
              />
              <label 
                htmlFor="photo-upload" 
                className="text-[10px] uppercase font-black tracking-widest text-emerald-500 hover:text-emerald-400 cursor-pointer border border-emerald-500/20 px-4 py-2 rounded-md bg-emerald-500/5 transition-all"
              >
                {file ? "Change file" : "Browse files"}
              </label>
            </div>
          </div>
        )}
      </div>

      <Button 
        onClick={handleMint}
        disabled={!file || isMinting || isProcessing}
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
      >
        {isMinting ? "Securing Proof..." : "License This Image"}
      </Button>
    </CardContent>
  </Card>
)
}