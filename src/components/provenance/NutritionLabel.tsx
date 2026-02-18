import { ShieldCheck, Camera, MapPin, Calendar } from 'lucide-react'

export function NutritionLabel({ camera, location, date, status }: any) {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-2xl">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className={`w-4 h-4 ${status === 'Unsigned' ? 'text-zinc-500' : 'text-emerald-500'}`} />
          <span className="text-[10px] font-black uppercase tracking-tighter text-zinc-400">Content Manifest</span>
        </div>
        <span className="text-[9px] font-mono text-zinc-600 px-2 py-0.5 bg-zinc-900 rounded">v0.1</span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Camera className="w-4 h-4 text-zinc-700" />
          <div>
            <p className="text-[9px] uppercase text-zinc-500 font-bold">Origin</p>
            <p className="text-xs text-white">{camera}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-zinc-700" />
          <div>
            <p className="text-[9px] uppercase text-zinc-500 font-bold">Location</p>
            <p className="text-xs text-white">{location}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-zinc-700" />
          <div>
            <p className="text-[9px] uppercase text-zinc-500 font-bold">Timestamp</p>
            <p className="text-xs text-white">{date}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-zinc-900">
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-zinc-500 font-bold uppercase">Status</span>
          <span className={`font-black ${status === 'Unsigned' ? 'text-orange-500' : 'text-emerald-500'}`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  )
}