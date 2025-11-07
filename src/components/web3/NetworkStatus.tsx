// src/components/web3/NetworkStatus.tsx
'use client';

import { useWeb3 } from '@/providers/Web3Provider';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export function NetworkStatus() {
  const { chainId, switchNetwork, isConnected } = useWeb3();
  const targetChainId = 11155111; // Sepolia

  const getNetworkName = (chainId: number) => {
    const networks: Record<number, string> = {
      1: 'Ethereum Mainnet',
      11155111: 'Sepolia Testnet',
      137: 'Polygon',
      56: 'BSC',
    };
    return networks[chainId] || `Unknown (${chainId})`;
  };

  if (!isConnected || !chainId) return null;

  if (chainId !== targetChainId) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 mx-4 sm:mx-6 lg:mx-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div>
              <h3 className="text-red-800 font-medium">Wrong Network</h3>
              <p className="text-red-600 text-sm">
                You&apos;re on {getNetworkName(chainId)}. Please switch to {getNetworkName(targetChainId)}.
              </p>
            </div>
          </div>
          <Button
            onClick={() => switchNetwork(targetChainId)}
            className="bg-red-600 text-white hover:bg-red-700"
            size="sm"
          >
            Switch Network
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 mx-4 sm:mx-6 lg:mx-8">
      <div className="flex items-center">
        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
        <span className="text-green-800 text-sm font-medium">
          Connected to {getNetworkName(chainId)}
        </span>
      </div>
    </div>
  );
}