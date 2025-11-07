// Extend the Window interface to include ethereum and web3 properties
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
      isMetaMask?: boolean
      isConnected?: () => boolean
      on?: (event: string, callback: (...args: unknown[]) => void) => void
      removeListener?: (event: string, callback: (...args: unknown[]) => void) => void
    }
    web3?: {
      currentProvider?: {
        request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
      }
    }
    walletConnect?: {
      provider?: {
        request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
      }
    }
  }
}

// Declare the w3m-button custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'w3m-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
    }
  }
}

export {}
