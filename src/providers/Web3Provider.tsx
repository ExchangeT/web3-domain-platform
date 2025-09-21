'use client'

import { ReactNode, createContext, useContext } from 'react'
import { WagmiProvider, useAccount, useDisconnect, useChainId } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from '@/lib/web3'
import { logger } from '@/lib/logger'

const queryClient = new QueryClient()

// Web3 Context for backward compatibility
interface Web3ContextType {
  account: string | null
  isConnected: boolean
  isConnecting: boolean
  chainId: number | null
  connect: () => Promise<void>
  disconnect: () => void
  switchNetwork: (chainId: number) => Promise<void>
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  isConnected: false,
  isConnecting: false,
  chainId: null,
  connect: async () => {},
  disconnect: () => {},
  switchNetwork: async () => {}
})

// Hook for components to use
export const useWeb3 = () => {
  const context = useContext(Web3Context)
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider')
  }
  return context
}

// Internal component to provide Web3 context
function Web3ContextProvider({ children }: { children: ReactNode }) {
  const { address, isConnected, isConnecting } = useAccount()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()

  const connect = async () => {
    try {
      // Use wagmi's connect functionality
      logger.info('Wallet connection initiated', undefined, 'web3')
    } catch (error) {
      logger.web3.error('Failed to connect wallet', error)
    }
  }

  const switchNetwork = async (targetChainId: number) => {
    try {
      // Use wagmi's switch network functionality
      logger.info(`Switching to network: ${targetChainId}`, undefined, 'web3')
    } catch (error) {
      logger.web3.error('Failed to switch network', error)
    }
  }

  const contextValue: Web3ContextType = {
    account: address || null,
    isConnected,
    isConnecting,
    chainId,
    connect,
    disconnect,
    switchNetwork
  }

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  )
}

export default function Web3Provider({ children, targetChainId }: { children: ReactNode; targetChainId?: number }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Web3ContextProvider>
          {children}
        </Web3ContextProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}