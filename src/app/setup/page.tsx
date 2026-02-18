"use client"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useState, Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Globe, Newspaper } from "lucide-react"

// Import our new components
import { NutritionLabel } from "@/components/provenance/NutritionLabel"
import { ProgressBar } from "@/components/ui/ProgressBar"

function ContractLabContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Extract data from URL (Passed from UploadCard)
  const metadata = {
    camera: searchParams.get('camera') || "Unknown Device",
    location: searchParams.get('loc') || "Private",
    date: searchParams.get('date') || "N/A",
    status: searchParams.get('signed') || "Unsigned"
  }

  const [price, setPrice] = useState([250])
  const [exclusive, setExclusive] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  

  const handleCreateLink = () => {
    setIsGenerating(true)
    const mockId = Math.random().toString(36).substring(2, 9)
  
    // 1. Capture the current metadata to pass it forward
    const params = new URLSearchParams({
      camera: metadata.camera,
      loc: metadata.location,
      date: metadata.date,
      price: price.toString(),
      // add any other fields you want the buyer to see
    })
  
    setTimeout(() => {
      // 2. Navigate with the ID AND the metadata
      router.push(`/license/${mockId}?${params.toString()}`)
    }, 1500)
  }
  return (
    <div className="max-w-5xl mx-auto py-10 space-y-8 animate-in fade-in duration-500">
      {/* 1. Progress Bar at the top */}
      <ProgressBar step={2} />

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Contract Lab</h1>
        <p className="text-zinc-400">Attest to the provenance of your asset and set your terms.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Provenance (The Nutrition Label) */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Asset Metadata</h2>
          <NutritionLabel {...metadata} />
        </div>

        {/* Middle: Configuration */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-sm font-medium uppercase tracking-widest text-emerald-500">1. Select License Tier</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup defaultValue="standard" className="grid grid-cols-1 gap-4">
                <Label htmlFor="standard" className="flex items-start gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 cursor-pointer transition-all">
                  <RadioGroupItem value="standard" id="standard" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-semibold text-zinc-200">
                      <Newspaper className="w-4 h-4" /> Standard News Use
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">Single-use editorial license for digital publications.</p>
                  </div>
                </Label>
                <Label htmlFor="global" className="flex items-start gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 cursor-pointer transition-all">
                  <RadioGroupItem value="global" id="global" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-semibold text-zinc-200">
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
                <Slider value={price} onValueChange={setPrice} max={2000} step={50} className="py-4" />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <div className="space-y-0.5">
                  <Label className="text-base text-zinc-200">Full Exclusive Buyout</Label>
                  <p className="text-xs text-zinc-500">Transfer all copyrights to the buyer.</p>
                </div>
                <Switch checked={exclusive} onCheckedChange={setExclusive} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Summary Action */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="bg-zinc-900 border-zinc-800 sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-sm">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Network:</span>
                  <span className="text-emerald-500">Solana</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Fee:</span>
                  <span className="text-zinc-300">1.5%</span>
                </div>
              </div>
              <div className="pt-4 border-t border-zinc-800">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-zinc-400">Total Ask:</span>
                  <span className="text-2xl font-bold">${price}</span>
                </div>
                <Button onClick={handleCreateLink} disabled={isGenerating} className="bg-emerald-600 w-full hover:bg-emerald-700">
                  {isGenerating ? "Securing Asset..." : "Generate Secure Link"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Wrapper to handle useSearchParams Requirement
export default function ContractLab() {
  return (
    <Suspense fallback={<div className="text-white">Loading Manifest...</div>}>
      <ContractLabContent />
    </Suspense>
  )
}