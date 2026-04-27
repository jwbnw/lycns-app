'use client';

import {PrivyProvider} from '@privy-io/react-auth';

const appIdDev = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
const clientIdDev = process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID;

export default function Providers({children}: {children: React.ReactNode}) {
  return (
    
    <PrivyProvider
      appId = {appIdDev ? appIdDev : ""} //should probably check these and throw but this is fine for now. 
      clientId={clientIdDev ? clientIdDev : ""} //should probably check these and throw but this is fine for now.
      config={{
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          solana: {
            createOnLogin: 'users-without-wallets'
          }
        }
      }}
    >
      {children}
    </PrivyProvider>
  );
}

