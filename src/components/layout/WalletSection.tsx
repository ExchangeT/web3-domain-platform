'use client'

import { useAccount, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/button'
import { User, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import { logger } from '@/lib/logger'

interface User {
  id: number
  name?: string
  email?: string
  walletAddress: string
  role?: string
  isVerified?: boolean
}

export default function WalletSection() {
  const [mounted, setMounted] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  useEffect(() => {
    setMounted(true)
    
    // Check for existing auth token on mount
    const token = localStorage.getItem('auth-token')
    if (token && isConnected) {
      // Verify token with backend
      verifyExistingToken(token)
    }
  }, [isConnected])

  // Verify existing token
  const verifyExistingToken = async (token: string) => {
    try {
      const response = await fetch('/api/auth/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const { data } = await response.json()
        setUser(data.user)
        // Dispatch event to update header
        window.dispatchEvent(new Event('auth-change'))
      } else {
        // Token invalid, remove it
        localStorage.removeItem('auth-token')
      }
    } catch (error) {
      logger.auth.error('Token verification failed', error)
      localStorage.removeItem('auth-token')
    }
  }

  // Custom signing function that bypasses wagmi issues
  const signMessage = async (message: string, address: string): Promise<string> => {
    try {
      // Try different wallet providers
      if (window.ethereum) {
        // MetaMask or other injected wallets
        return await window.ethereum.request({
          method: 'personal_sign',
          params: [message, address]
        })
      }
      
      // If WalletConnect provider is available
      if ((window as any).walletConnect?.provider) {
        return await (window as any).walletConnect.provider.request({
          method: 'personal_sign',
          params: [message, address]
        })
      }
      
      throw new Error('No wallet provider available')
    } catch (error) {
      logger.web3.error('Signing error', error)
      throw error
    }
  }

  const authenticateWithBackend = async () => {
    if (!address || isAuthenticating) return

    setIsAuthenticating(true)
    try {
      logger.info(`Starting authentication for address: ${address}`, undefined, 'auth')
      
      // Step 1: Get nonce from backend
      const nonceResponse = await fetch('/api/auth/connect-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address })
      })

      if (!nonceResponse.ok) {
        throw new Error('Failed to get nonce from backend')
      }

      const { data: nonceData } = await nonceResponse.json()
      logger.debug('Received nonce data', nonceData, 'auth')
      
      // Step 2: Sign the message using custom signing function
      const signature = await signMessage(nonceData.message, address)
      logger.info('Message signed successfully', undefined, 'auth')

      // Step 3: Verify signature with backend
      const verifyResponse = await fetch('/api/auth/verify-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          signature,
          message: nonceData.message
        })
      })

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.text()
        logger.auth.error(`Verify response error: ${errorData}`)
        throw new Error('Signature verification failed')
      }

      const { data: authData } = await verifyResponse.json()
      logger.auth.login(address || 'unknown')
      
      // Store token and update user state
      localStorage.setItem('auth-token', authData.token)
      setUser(authData.user)
      
      // Dispatch event to update header
      window.dispatchEvent(new Event('auth-change'))

    } catch (error) {
      logger.auth.error('Authentication failed', error)
      alert('Authentication failed: ' + (error as Error).message)
    } finally {
      setIsAuthenticating(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('auth-token')
    setUser(null)
    disconnect()
    window.dispatchEvent(new Event('auth-change'))
  }

  // Don't render anything until mounted on client
  if (!mounted) {
    return (
      <Button className="bg-blue-600 hover:bg-blue-700">
        Connect Wallet
      </Button>
    )
  }

  // Show Web3Modal button when not connected
  if (!isConnected) {
    return <div className="w3m-button" />
  }

  // Show authenticating state
  if (isConnected && !user && isAuthenticating) {
    return (
      <Button disabled className="bg-blue-600">
        Authenticating...
      </Button>
    )
  }

  // Show sign to login button when connected but not authenticated
  if (isConnected && !user && !isAuthenticating) {
    return (
      <Button onClick={authenticateWithBackend} className="bg-blue-600 hover:bg-blue-700">
        Sign to Login
      </Button>
    )
  }

  // Show authenticated user state
  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
        <User className="h-4 w-4 text-gray-600" />
        <div className="text-sm">
          <div className="font-medium">
            {user?.username || `${address?.slice(0, 6)}...${address?.slice(-4)}`}
          </div>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={handleLogout}>
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )
}