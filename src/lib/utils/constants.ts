export const CHAIN_CONFIG = {
    11155111: {
      name: 'Sepolia',
      rpcUrl: 'https://sepolia.infura.io/v3/',
      blockExplorer: 'https://sepolia.etherscan.io',
      nativeCurrency: {
        name: 'Sepolia ETH',
        symbol: 'SEP',
        decimals: 18,
      },
    },
    1: {
      name: 'Ethereum Mainnet',
      rpcUrl: 'https://mainnet.infura.io/v3/',
      blockExplorer: 'https://etherscan.io',
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
      },
    },
  };
  
  export const DOMAIN_EXTENSIONS = [
    { name: 'web3', price: '0.1', description: 'Perfect for Web3 projects', popular: true },
    { name: 'dao', price: '0.15', description: 'Ideal for DAOs and organizations', popular: true },
    { name: 'defi', price: '0.12', description: 'Great for DeFi protocols', popular: true },
    { name: 'nft', price: '0.2', description: 'For NFT collections and creators', popular: false },
    { name: 'crypto', price: '0.25', description: 'Crypto and blockchain projects', popular: false },
    { name: 'meta', price: '0.3', description: 'Metaverse and virtual worlds', popular: false },
  ];
  
  export const DOMAIN_CATEGORIES = [
    { value: 'finance', label: 'Finance & DeFi', color: 'bg-green-100 text-green-800' },
    { value: 'gaming', label: 'Gaming & NFT', color: 'bg-purple-100 text-purple-800' },
    { value: 'tech', label: 'Technology', color: 'bg-blue-100 text-blue-800' },
    { value: 'personal', label: 'Personal', color: 'bg-pink-100 text-pink-800' },
    { value: 'business', label: 'Business', color: 'bg-gray-100 text-gray-800' },
    { value: 'creative', label: 'Creative & Art', color: 'bg-yellow-100 text-yellow-800' },
  ];
  
  export const TEXT_RECORD_KEYS = [
    { key: 'email', label: 'Email', placeholder: 'your@email.com' },
    { key: 'url', label: 'Website', placeholder: 'https://your-website.com' },
    { key: 'avatar', label: 'Avatar URL', placeholder: 'https://avatar-url.com/image.jpg' },
    { key: 'description', label: 'Description', placeholder: 'Brief description' },
    { key: 'twitter', label: 'Twitter', placeholder: '@username' },
    { key: 'github', label: 'GitHub', placeholder: 'username' },
    { key: 'discord', label: 'Discord', placeholder: 'username#1234' },
    { key: 'telegram', label: 'Telegram', placeholder: '@username' },
  ];