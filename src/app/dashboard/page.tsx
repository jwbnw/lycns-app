"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, LogIn, Image as ImageIcon, Shield } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  // We'll mock the 'isLoggedIn' state for now
  const [isLoggedIn] = useState(false)
  const [assets] = useState([]) 

  // 1. Authenticated but No Assets
  if (isLoggedIn && assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 mb-6">
          <Shield className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-3xl font-black tracking-tighter mb-2">Vault is Empty</h2>
        <p className="text-zinc-500 max-w-sm mb-8 text-balance">
          You're signed in, but you haven't secured any assets. Protecting your first photo takes less than 60 seconds.
        </p>
        <Link href="/">
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 gap-2 h-12 px-8">
            <PlusCircle className="w-5 h-5" /> Secure My First Asset
          </Button>
        </Link>
      </div>
    )
  }

  // 2. Not Logged In (The "Or" State)
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-black tracking-tighter mb-6">Access Your Vault</h1>
        
        <div className="grid md:grid-cols-2 gap-6 w-full">
          {/* Action A: The Creator Path */}
          <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col items-center space-y-4">
            <div className="p-3 bg-zinc-800 rounded-lg">
              <PlusCircle className="w-6 h-6 text-zinc-400" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-lg">New Asset</h3>
              <p className="text-xs text-zinc-500 italic">No account needed to start</p>
            </div>
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full border-zinc-700 hover:bg-zinc-800">
                Start Uploading
              </Button>
            </Link>
          </div>

          {/* Action B: The Returning User Path */}
          <div className="p-8 rounded-2xl bg-emerald-600/5 border border-emerald-600/20 flex flex-col items-center space-y-4">
            <div className="p-3 bg-emerald-600/20 rounded-lg text-emerald-500">
              <LogIn className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-lg">Existing User</h3>
              <p className="text-xs text-zinc-500 italic">Access your shared links</p>
            </div>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-500">
              Sign In to Lycns
            </Button>
          </div>
        </div>

        <div className="mt-12 flex items-center gap-4 text-zinc-700">
            <div className="h-px w-12 bg-zinc-800" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Powered by Solana</span>
            <div className="h-px w-12 bg-zinc-800" />
        </div>
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