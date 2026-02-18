export function ProgressBar({ step }: { step: number }) {
    return (
      <div className="w-full mb-12">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
          <span className={step >= 1 ? "text-emerald-500" : "text-zinc-600"}>1. Capture</span>
          <span className={step >= 2 ? "text-emerald-500" : "text-zinc-600"}>2. Attest</span>
          <span className={step >= 3 ? "text-emerald-500" : "text-zinc-600"}>3. Secure</span>
        </div>
        <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981] transition-all duration-700" 
            style={{ width: `${(step / 3) * 100}%` }} 
          />
        </div>
      </div>
    )
  }