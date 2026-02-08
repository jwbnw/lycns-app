"use client"
import { useRouter } from "next/navigation" // Import useRouter
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Globe, Newspaper, Zap } from "lucide-react"

export default function ContractLab() {
  const [price, setPrice] = useState([250])
  const [exclusive, setExclusive] = useState(false)

  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)

  const handleCreateLink = () => {
    setIsGenerating(true)

    // 1. Generate a mock unique ID (in a real app, this comes from your DB/Solana)
    const mockId = Math.random().toString(36).substring(2, 9)

    // 2. Simulate a brief "Creating Secure Asset..." delay
    setTimeout(() => {
      // 3. Navigate to the dynamic route: /license/[id]
      router.push(`/license/${mockId}`)
    }, 1500)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Contract Lab</h1>
        <p className="text-zinc-400">Configure your licensing terms and generate your secure link.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Configuration */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-sm font-medium uppercase tracking-widest text-emerald-500">1. Select License Tier</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup defaultValue="standard" className="grid grid-cols-1 gap-4">
                <Label
                  htmlFor="standard"
                  className="flex items-start gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 cursor-pointer transition-all"
                >
                  <RadioGroupItem value="standard" id="standard" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-semibold">
                      <Newspaper className="w-4 h-4" /> Standard News Use
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">Single-use editorial license for digital publications.</p>
                  </div>
                </Label>

                <Label
                  htmlFor="global"
                  className="flex items-start gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 cursor-pointer transition-all"
                >
                  <RadioGroupItem value="global" id="global" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-semibold">
                      <Globe className="w-4 h-4" /> Global Multi-Platform
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">Unlimited digital & broadcast use for 12 months.</p>
                  </div>
                </Label>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-sm font-medium uppercase tracking-widest text-emerald-500">2. Pricing & Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label>Base Price (USDC)</Label>
                  <span className="font-mono text-xl text-emerald-400 font-bold">${price}</span>
                </div>
                <Slider 
                  value={price} 
                  onValueChange={setPrice} 
                  max={2000} 
                  step={50} 
                  className="py-4"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <div className="space-y-0.5">
                  <Label className="text-base">Full Exclusive Buyout</Label>
                  <p className="text-xs text-zinc-500">Transfer all copyrights to the buyer permanently.</p>
                </div>
                <Switch checked={exclusive} onCheckedChange={setExclusive} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Summary / Action */}
        <div className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800 sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">License Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Asset:</span>
                  <span className="text-zinc-300">DSC_0492.raw</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Network:</span>
                  <span className="text-emerald-500">Solana Devnet</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Protocol Fee:</span>
                  <span className="text-zinc-300">1.5%</span>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-sm font-medium text-zinc-400">Total Ask:</span>
                  <span className="text-2xl font-bold">${price}</span>
                </div>
                
                <Button 
        onClick={handleCreateLink} 
        disabled={isGenerating}
        className="bg-emerald-600 w-full"
      >
        {isGenerating ? "Securing on Solana..." : "Generate Secure Link"}
      </Button>
                <p className="text-[10px] text-center text-zinc-500 mt-4">
                  By generating, you vouch for the authenticity of this asset and agree to the LYCNS Protocol Terms.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}