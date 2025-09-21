'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
// import { DomainSearchResult, Extension } from '@/types/domain' // Unused for now

export function useDomains() {
  const queryClient = useQueryClient()

  // Get extensions
  const { data: extensions, isLoading: isLoadingExtensions } = useQuery({
    queryKey: ['extensions'],
    queryFn: async () => {
      const response = await apiClient.getExtensions()
      return response.data.data || []
    },
  })

  // Search domains
  const searchMutation = useMutation({
    mutationFn: async ({ query, extension }: { query: string; extension?: string }) => {
      const response = await apiClient.searchDomains(query, extension)
      return response.data.data || []
    },
  })

  // Get user domains hook
  const useUserDomains = (address?: string) => {
    return useQuery({
      queryKey: ['userDomains', address],
      queryFn: async () => {
        if (!address) return []
        const response = await apiClient.getUserDomains(address)
        return response.data.data || []
      },
      enabled: !!address,
    })
  }

  // Track mint transaction
  const trackMintMutation = useMutation({
    mutationFn: async (data: { txHash: string; domainName: string; extension: string; price?: string }) => {
      const response = await apiClient.trackMintTransaction(data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userDomains'] })
    },
  })

  return {
    extensions,
    isLoadingExtensions,
    searchDomains: searchMutation.mutateAsync,
    isSearching: searchMutation.isPending,
    searchResults: searchMutation.data,
    useUserDomains,
    trackMint: trackMintMutation.mutateAsync,
    isTrackingMint: trackMintMutation.isPending,
  }
}