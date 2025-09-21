'use client'

import { useState, useCallback } from 'react'
import { useAccount, useSignMessage } from 'wagmi'
import { apiClient } from '@/lib/api'
import { logger } from '@/lib/logger'
// import { User } from '@/types/user' // Unused for now
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useAuth() {
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const queryClient = useQueryClient()
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  // Get user profile
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user', address],
    queryFn: async () => {
      if (!address) return null
      const token = localStorage.getItem('auth-token')
      if (!token) return null
      
      try {
        const response = await apiClient.getProfile()
        return response.data.data
      } catch {
        localStorage.removeItem('auth-token')
        return null
      }
    },
    enabled: !!address && !!localStorage.getItem('auth-token'),
  })

  // Authentication mutation
  const authenticateMutation = useMutation({
    mutationFn: async (walletAddress: string) => {
      setIsAuthenticating(true)
      
      // Step 1: Get nonce from backend
      const connectResponse = await apiClient.connectWallet(walletAddress)
      const { message } = connectResponse.data.data
      
      // Step 2: Sign message
      const signature = await signMessageAsync({ message })
      
      // Step 3: Verify signature with backend
      const verifyResponse = await apiClient.verifySignature({
        walletAddress,
        signature,
        message
      })
      
      const { token, user } = verifyResponse.data.data
      localStorage.setItem('auth-token', token)
      
      return user
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(['user', address], userData)
      setIsAuthenticating(false)
    },
    onError: (error) => {
      logger.auth.error('Authentication failed', error)
      setIsAuthenticating(false)
    }
  })

  const authenticate = useCallback(async () => {
    if (!address || !isConnected) return
    try {
      await authenticateMutation.mutateAsync(address)
    } catch (error) {
      logger.auth.error('Authentication error', error)
    }
  }, [address, isConnected, authenticateMutation])

  const logout = useCallback(() => {
    localStorage.removeItem('auth-token')
    queryClient.removeQueries({ queryKey: ['user'] })
  }, [queryClient])

  const isAuthenticated = !!user && !!localStorage.getItem('auth-token')

  return {
    user,
    isAuthenticated,
    isAuthenticating,
    isLoadingUser,
    authenticate,
    logout,
    address,
    isConnected,
  }
}
