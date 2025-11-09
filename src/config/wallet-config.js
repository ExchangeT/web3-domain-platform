import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet } from 'wagmi/chains';

// IMPORTANT: Replace this with YOUR Project ID from WalletConnect
const WALLET_CONNECT_PROJECT_ID = '890c09f7bb094d9a88beda9235d2bd74';

export const config = getDefaultConfig({
  appName: 'Unlimited Domains',
  projectId: WALLET_CONNECT_PROJECT_ID,
  chains: [sepolia, mainnet],
  ssr: false,
});