import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { mainnet, sepolia } from 'wagmi/chains'
import type { Chain } from 'wagmi/chains'
import { logger } from './logger'

// Environment variables with validation
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

if (!projectId || projectId === 'demo-project-id') {
  logger.warn('⚠️ NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID not set. Using demo project ID.', undefined, 'web3')
}

const metadata = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'Web3 Domain Platform',
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Decentralized domain registration and marketplace',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://web3domains.com',
  icons: [
    process.env.NEXT_PUBLIC_APP_ICON || 'https://avatars.githubusercontent.com/u/37784886'
  ]
}

// Chain configuration for the domain platform
const chains = [sepolia, mainnet] as const

// Wagmi configuration
export const config = defaultWagmiConfig({
  chains,
  projectId: projectId || 'demo-project-id',
  metadata,
  ssr: true, // Enable SSR support
})

// Web3Modal configuration - FIXED PHANTOM WALLET ISSUE
let web3Modal: ReturnType<typeof createWeb3Modal> | null = null

try {
  web3Modal = createWeb3Modal({
    wagmiConfig: config,
    projectId: projectId || 'demo-project-id',
    enableAnalytics: process.env.NODE_ENV === 'production',
    themeMode: 'light',
    themeVariables: {
      '--w3m-color-mix': '#00BB7F',
      '--w3m-color-mix-strength': 40,
      '--w3m-border-radius-master': '8px',
    },
    
    // FIXED: Exclude problematic wallets
    excludeWalletIds: [
      '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // Phantom
      '18388be9ac2d02726dbac9777c96efaac06d744b2f6d580fccdd4127a6d01fd1', // Rabby
      'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa', // Coinbase Wallet (causing CORS issues)
    ],
    
    // Only include MetaMask and WalletConnect to avoid CORS issues
    featuredWalletIds: [
      'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
      '4622a2b2d6af1c9844944291e5e7351a6aa395cd430d48341c7b9f27f3a4c4a7', // WalletConnect
    ],
    
    // Disable problematic wallet integrations
    enableWalletConnect: true,
    enableInjected: true,
    enableCoinbase: false, // Disable Coinbase to prevent CORS errors
  })

  logger.info('✅ Web3Modal initialized successfully', undefined, 'web3')
} catch (error) {
  logger.error('❌ Failed to initialize Web3Modal', error, 'web3')
  
  // Fallback: create a minimal modal without custom features
  try {
    web3Modal = createWeb3Modal({
      wagmiConfig: config,
      projectId: projectId || 'demo-project-id',
      enableAnalytics: false,
    })
    logger.info('✅ Web3Modal initialized with fallback configuration', undefined, 'web3')
  } catch (fallbackError) {
    logger.error('❌ Failed to initialize Web3Modal even with fallback', fallbackError, 'web3')
  }
}

// Enhanced utility functions for Web3 operations
export const web3Utils = {
  // Get the current chain
  getCurrentChain: (): Chain | undefined => {
    if (typeof window === 'undefined') return undefined
    return chains[0] // Default to first chain (sepolia)
  },
  
  // Check if a chain is supported
  isChainSupported: (chainId: number): boolean => {
    return chains.some(chain => chain.id === chainId)
  },
  
  // Get chain by ID
  getChainById: (chainId: number): Chain | undefined => {
    return chains.find(chain => chain.id === chainId)
  },
  
  // Format address for display
  formatAddress: (address: string, length: number = 6): string => {
    if (!address) return ''
    return `${address.slice(0, length)}...${address.slice(-length)}`
  },
  
  // Validate Ethereum address
  isValidAddress: (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  },
  
  // Get network name
  getNetworkName: (chainId: number): string => {
    const chain = chains.find(c => c.id === chainId)
    return chain?.name || 'Unknown Network'
  },
  
  // NEW: Contract addresses from your deployment
  getContractAddresses: () => ({
    DOMAIN_CORE: process.env.NEXT_PUBLIC_DOMAIN_CORE_ADDRESS || '0xF2650822a05cc2a0E595D1c55448efB6BBD0AFB1',
    MARKETPLACE: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || '0x6D4f21a0a4eE799b9FE9651f774cD2c17530892b',
    EXTENSION_MANAGER: process.env.NEXT_PUBLIC_EXTENSION_MANAGER_ADDRESS || '0x0682Ee75F3d918AED6FC4B39A4E9ECa1Fa710Fc3',
    RESOLVER: process.env.NEXT_PUBLIC_RESOLVER_ADDRESS || '0x074443faFb649Ba1C56C93f2Fe46D607E69DECFc',
  }),
  
  // NEW: Get API URL
  getApiUrl: (): string => {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  },
  
  // NEW: Format currency (ETH)
  formatEther: (wei: bigint | string, decimals: number = 4): string => {
    try {
      const etherValue = Number(wei) / Math.pow(10, 18)
      return etherValue.toFixed(decimals)
    } catch (error) {
      return '0.0000'
    }
  }
}

// Export the modal instance for external use
export { web3Modal, projectId }

// Export default configuration
export default config