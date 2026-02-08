// app/license/[id]/page.tsx
import { ProvenanceCard } from "@/components/license/ProvenanceCard";
import { PurchasePanel } from "@/components/license/PurchasePanel";

export default async function LicensePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Left: Visual Evidence */}
        <div className="space-y-6">
          <div className="aspect-[4/5] bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center relative overflow-hidden group">
            {/* Watermark Overlay */}
            <div className="absolute inset-0 z-10 grid grid-cols-4 grid-rows-6 opacity-[0.03] pointer-events-none rotate-12 scale-150">
              {Array(24).fill("LYCNS").map((t, i) => (
                <span key={i} className="text-xl font-black text-white">{t}</span>
              ))}
            </div>
            <p className="text-zinc-600 font-mono text-sm tracking-widest uppercase">
              Secure Preview: {id}
            </p>
          </div>
          <ProvenanceCard id={id} />
        </div>

        {/* Right: The Transaction Interface */}
        <div className="pt-4">
          <PurchasePanel imageId={id} />
        </div>
      </div>
    </div>
  );
}