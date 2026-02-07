"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function UploadCard() {
  const [isMinting, setIsMinting] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  // Mock Minting Process
  const handleMint = () => {
    setIsMinting(true)
    setTimeout(() => {
      setIsMinting(false)
      alert("Mock: License Minted on Solana Devnet!")
    }, 3000)
  }

  return (
    <Card className="w-full max-w-md bg-zinc-950 border-zinc-800 text-zinc-100">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold tracking-tight">LYCNS</CardTitle>
          <Badge variant="outline" className="text-emerald-500 border-emerald-500/50">
            C2PA Ready
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          className="border-2 border-dashed border-zinc-800 rounded-lg p-8 text-center hover:border-zinc-700 transition-colors cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
        >
          <p className="text-sm text-zinc-400">
            {file ? file.name : "Drag photo here to secure license"}
          </p>
          <input 
            type="file" 
            className="hidden" 
            onChange={(e) => setFile(e.target.files?.[0] || null)} 
            id="photo-upload"
          />
          <label htmlFor="photo-upload" className="mt-4 block text-xs text-emerald-500 underline cursor-pointer">
            Browse files
          </label>
        </div>

        <Button 
          onClick={handleMint}
          disabled={!file || isMinting}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
        >
          {isMinting ? "Minting Proof..." : "License This Image"}
        </Button>
      </CardContent>
    </Card>
  )
}