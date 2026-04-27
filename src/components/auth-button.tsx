"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";

export function AuthButton() {
  const { login, logout, authenticated, user } = usePrivy();

  // If authenticated, show a truncated wallet address and a logout option
  if (authenticated && user?.wallet) {
    const address = user.wallet.address;
    const truncatedAddress = `${address.slice(0, 4)}...${address.slice(-4)}`;

    return (
      <div className="flex items-center gap-3">
        <span className="text-xs text-zinc-500 font-mono bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
          {truncatedAddress}
        </span>
        <Button 
          variant="ghost" 
          className="text-xs h-8 text-zinc-400 hover:text-white"
          onClick={logout}
        >
          Sign Out
        </Button>
      </div>
    );
  }

  // Otherwise, show the Sign In button
  return (
    <Button 
      onClick={login}
      variant="outline" 
      className="border-zinc-700 text-xs h-8 hover:bg-emerald-500/10 hover:text-emerald-500"
    >
      Sign In
    </Button>
  );
}