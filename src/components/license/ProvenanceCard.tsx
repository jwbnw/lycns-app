"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, MapPin, Clock, Fingerprint } from "lucide-react"

interface MetadataProps {
  id: string;
  camera?: string;
  location?: string;
  timestamp?: string;
  hash?: string;
}

export function ProvenanceCard({ id, camera = "iPhone 16 Pro", location = "Manhattan, NY", timestamp = "Feb 7, 2026 14:12 EST", hash = "SOL_82f...a12" }: MetadataProps) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Asset Provenance</h3>
        <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-[10px]">C2PA SIGNED</Badge>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <div className="flex items-start gap-3">
          <Camera className="w-4 h-4 text-zinc-500 mt-1" />
          <div>
            <p className="text-[10px] uppercase text-zinc-500 font-bold">Hardware Device</p>
            <p className="text-sm font-medium">{camera}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-zinc-500 mt-1" />
          <div>
            <p className="text-[10px] uppercase text-zinc-500 font-bold">GPS Coordinates</p>
            <p className="text-sm font-medium">{location}</p>
            <p className="text-[10px] text-emerald-500/70 font-mono">Precision: ± 5 meters</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="w-4 h-4 text-zinc-500 mt-1" />
          <div>
            <p className="text-[10px] uppercase text-zinc-500 font-bold">Capture Time</p>
            <p className="text-sm font-medium">{timestamp}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 border-t border-zinc-800 pt-4">
          <Fingerprint className="w-4 h-4 text-emerald-500 mt-1" />
          <div className="w-full">
            <p className="text-[10px] uppercase text-zinc-500 font-bold">On-Chain Asset ID</p>
            <div className="flex justify-between items-center w-full">
              <p className="text-xs font-mono text-zinc-400 truncate max-w-[150px]">{hash}</p>
              <button className="text-[10px] text-emerald-500 hover:underline">Verify Explorer</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}