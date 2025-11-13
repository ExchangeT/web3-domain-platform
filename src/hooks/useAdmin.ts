import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import type { ApiResponse, AdminDashboardData, User, Domain, Transaction, Extension } from '@/lib/api'

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const response = await apiClient.admin.getDashboard()
      return response.data.data
    },
    retry: 1,
    staleTime: 30000, // 30 seconds
  })
}

export function useAdminUsers(params?: { limit?: number; offset?: number; search?: string }) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: async () => {
      const response = await apiClient.admin.getUsers(params)
      return response.data.data
    },
  })
}

export function useAdminDomains(params?: { limit?: number; offset?: number; search?: string; extension?: string }) {
  return useQuery({
    queryKey: ['admin', 'domains', params],
    queryFn: async () => {
      const response = await apiClient.admin.getDomains(params)
      return response.data.data
    },
  })
}

export function useAdminTransactions(params?: { limit?: number; offset?: number; type?: string; status?: string }) {
  return useQuery({
    queryKey: ['admin', 'transactions', params],
    queryFn: async () => {
      const response = await apiClient.admin.getTransactions(params)
      return response.data.data
    },
  })
}

export function useAdminExtensions() {
  return useQuery({
    queryKey: ['admin', 'extensions'],
    queryFn: async () => {
      const response = await apiClient.admin.getExtensions()
      return response.data.data || []
    },
  })
}

export function useAdminSupport(params?: { limit?: number; offset?: number; status?: string }) {
  return useQuery({
    queryKey: ['admin', 'support', params],
    queryFn: async () => {
      const response = await apiClient.admin.getSupport(params)
      return response.data.data
    },
  })
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: 'active' | 'suspended' }) => {
      return await apiClient.admin.updateUserStatus(userId, status)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}

export function useCreateExtension() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: Omit<Extension, 'id'>) => {
      return await apiClient.admin.createExtension(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'extensions'] })
    },
  })
}

export function useUpdateExtension() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Extension> }) => {
      return await apiClient.admin.updateExtension(id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'extensions'] })
    },
  })
}

export function useDeleteExtension() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      return await apiClient.admin.deleteExtension(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'extensions'] })
    },
  })
}

export function useDomainAnalytics(timeRange?: '7d' | '30d' | '90d' | '1y') {
  return useQuery({
    queryKey: ['admin', 'analytics', 'domains', timeRange],
    queryFn: async () => {
      const response = await apiClient.admin.getDomainAnalytics(timeRange)
      return response.data.data
    },
  })
}

export function useRevenueAnalytics(timeRange?: '7d' | '30d' | '90d' | '1y') {
  return useQuery({
    queryKey: ['admin', 'analytics', 'revenue', timeRange],
    queryFn: async () => {
      const response = await apiClient.admin.getRevenueAnalytics(timeRange)
      return response.data.data
    },
  })
}

export function useUserDetails(userId: string) {
  return useQuery({
    queryKey: ['admin', 'users', userId, 'details'],
    queryFn: async () => {
      const response = await fetch(`/api/admin/users/${userId}/details`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        }
      })
      if (!response.ok) throw new Error('Failed to fetch user details')
      const result = await response.json()
      return result.data
    },
    enabled: !!userId,
  })
}