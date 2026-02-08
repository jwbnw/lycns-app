"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, Image as ImageIcon } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  // Mocking an empty state for now
  const [assets] = useState([]) 

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
        <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
          <ImageIcon className="w-10 h-10 text-zinc-700" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">No secured assets yet</h2>
          <p className="text-zinc-500 max-w-xs mx-auto text-sm">
            Upload your first high-stakes photo to generate a secure, sellable license link.
          </p>
        </div>
        <Link href="/">
          <Button className="bg-emerald-600 hover:bg-emerald-500 gap-2">
            <PlusCircle className="w-4 h-4" /> Secure First Photo
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Vault</h1>
      {/* Grid for assets would go here */}
    </div>
  )
}