// src/components/web3/WalletConnection.tsx
'use client';

import { useWeb3 } from '@/providers/Web3Provider';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Copy, Wallet } from 'lucide-react';

export function WalletConnection() {
  const { account, isConnected, isConnecting, connect, disconnect, chainId } = useWeb3();
  const targetChainId = 11155111; // Sepolia

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleCopyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      toast.success('Address copied to clipboard');
    }
  };

  if (isConnected && account) {
    return (
      <div className="flex items-center space-x-2">
        {chainId !== targetChainId && (
          <div className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
            Wrong Network
          </div>
        )}
        
        <button
          onClick={handleCopyAddress}
          className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="font-medium">{formatAddress(account)}</span>
          <Copy className="h-3 w-3" />
        </button>
        
        <button
          onClick={disconnect}
          className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <Button
      onClick={connect}
      disabled={isConnecting}
      className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
    >
      {isConnecting ? (
        <>
          <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="h-4 w-4 mr-2" />
          Connect Wallet
        </>
      )}
    </Button>
  );
}