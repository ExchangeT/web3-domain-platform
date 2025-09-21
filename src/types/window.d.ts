// Extend the Window interface to include ethereum and web3 properties
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      isMetaMask?: boolean
      isConnected?: () => boolean
      on?: (event: string, callback: (...args: any[]) => void) => void
      removeListener?: (event: string, callback: (...args: any[]) => void) => void
    }
    web3?: {
      currentProvider?: {
        request: (args: { method: string; params?: any[] }) => Promise<any>
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
