"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Download, ShieldCheck } from "lucide-react"

// Added 'price' to the interface
export function PurchasePanel({ imageId, price = "250" }: { imageId: string, price?: string }) {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle')

  const handleMockPurchase = () => {
    setStatus('processing')
    setTimeout(() => setStatus('success'), 2500)
  }

  if (status === 'success') {
    return (
      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-8 text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="mx-auto w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center">
          <CheckCircle2 className="text-white w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">License Secured</h2>
          <p className="text-zinc-400 text-sm">Blockchain receipt: 0x72...f92a</p>
        </div>
        <Button className="w-full bg-white text-black hover:bg-zinc-200 gap-2 h-12">
          <Download className="w-4 h-4" /> Download High-Res Original
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tighter">Verified Asset</h1>
        <p className="text-zinc-400">Exclusive digital rights for editorial use.</p>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-center gap-4">
          <ShieldCheck className="text-emerald-500 w-6 h-6" />
          <div className="text-sm">
            <p className="font-bold text-emerald-400">Verified by Lycns Agent</p>
            <p className="text-zinc-500">Metadata matches cryptographic signature.</p>
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <div className="flex justify-between items-end">
            <span className="text-zinc-500 text-sm">Editorial License</span>
            {/* DYNAMIC PRICE HERE */}
            <span className="text-2xl font-bold">${price}.00</span>
          </div>
          <Button 
            onClick={handleMockPurchase}
            disabled={status === 'processing'}
            className="w-full h-14 text-lg bg-emerald-600 hover:bg-emerald-500 transition-all font-bold"
          >
            {status === 'processing' ? "Verifying on Solana..." : "Buy License"}
          </Button>
        </div>
      </div>
    </div>
  )
}