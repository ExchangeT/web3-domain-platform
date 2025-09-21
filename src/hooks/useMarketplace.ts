'use client'

import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'

export function useMarketplace() {
  // Get marketplace domains with pagination
  const useMarketplaceDomains = (filters?: {
    extension?: string
    minPrice?: string
    maxPrice?: string
    sortBy?: string
    sortOrder?: string
  }) => {
    return useInfiniteQuery({
      queryKey: ['marketplaceDomains', filters],
      queryFn: async ({ pageParam = 0 }) => {
        const response = await apiClient.getMarketplaceDomains({
          ...filters,
          limit: 20,
          offset: pageParam * 20,
        })
        return response.data.data
      },
      getNextPageParam: (lastPage, pages) => {
        return lastPage?.pagination?.hasMore ? pages.length : undefined
      },
      initialPageParam: 0,
    })
  }

  // Get trending domains
  const { data: trendingDomains, isLoading: isLoadingTrending } = useQuery({
    queryKey: ['trendingDomains'],
    queryFn: async () => {
      const response = await apiClient.getTrendingDomains()
      return response.data.data || []
    },
  })

  // Get domain details
  const useDomainDetails = (fullName?: string) => {
    return useQuery({
      queryKey: ['domainDetails', fullName],
      queryFn: async () => {
        if (!fullName) return null
        const response = await apiClient.getDomainDetails(fullName)
        return response.data.data
      },
      enabled: !!fullName,
    })
  }

  return {
    useMarketplaceDomains,
    trendingDomains,
    isLoadingTrending,
    useDomainDetails,
  }
}
