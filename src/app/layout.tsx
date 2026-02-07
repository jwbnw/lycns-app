// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <nav className="border-b border-zinc-800 py-4 px-6 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold tracking-tighter hover:opacity-80">
            LYCNS<span className="text-emerald-500">.</span>
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/setup" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Pricing
            </Link>
            <Button variant="outline" className="border-zinc-700 text-xs h-8">
              Connect Wallet
            </Button>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto p-6">
          {children}
        </main>
      </body>
    </html>
  );
}