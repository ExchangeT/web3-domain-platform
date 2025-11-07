import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  sepolia
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Web3 Domain Platform',
  projectId: '890c09f7bb094d9a88beda9235d2bd74', // Get from https://cloud.walletconnect.com
  chains: [mainnet, sepolia, polygon, optimism, arbitrum, base],
  ssr: true, // If using Next.js
});