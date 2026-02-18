// app/license/[id]/page.tsx
import { ProvenanceCard } from "@/components/license/ProvenanceCard";
import { PurchasePanel } from "@/components/license/PurchasePanel";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default async function LicensePage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const { id } = await params;
  const sParams = await searchParams;


  // Map the URL data to your ProvenanceCard props
  const camera = (sParams.camera as string) || undefined;
  const location = (sParams.loc as string) || undefined;
  const timestamp = (sParams.date as string) || undefined;
  const price = (sParams.price as string) || "Error No Price Passed";
  // Create a mock hash using the ID for the "On-Chain" feel
  const mockHash = `SOL_${id.toUpperCase()}...${Math.random().toString(36).substring(2,5)}`;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <ProgressBar step={3} />
      <div className="grid md:grid-cols-2 gap-12">
        {/* Left: Visual Evidence */}
        <div className="space-y-6">
          <div className="aspect-[4/5] bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 z-10 grid grid-cols-4 grid-rows-6 opacity-[0.03] pointer-events-none rotate-12 scale-150">
              {Array(24).fill("LYCNS").map((t, i) => (
                <span key={i} className="text-xl font-black text-white">{t}</span>
              ))}
            </div>
            <p className="text-zinc-600 font-mono text-sm tracking-widest uppercase">
              Secure Preview: {id}
            </p>
          </div>

          {/* Pass the data here */}
          <ProvenanceCard 
            id={id} 
            camera={camera} 
            location={location} 
            timestamp={timestamp} 
            hash={mockHash}
          />
        </div>

        {/* Right: The Transaction Interface */}
        <div className="pt-4">
          <PurchasePanel imageId={id}  price={price}/>
        </div>
      </div>
    </div>
  );
}