import axios, { AxiosResponse, AxiosInstance } from 'axios'

// Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginationResponse {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface User {
  id: string
  walletAddress: string
  email?: string
  username?: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface Extension {
  id: number;
  name: string;
  base_price: string;           // Backend uses "base_price"
  tier_pricing: object;
  is_enabled: boolean;          // Backend uses "is_enabled"
  contract_address: string;
  created_by: string;
  total_domains_minted: number;
  total_revenue: string;
  description: string;
  icon_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface DomainSearchResult {
  name: string
  extension: string
  isAvailable: boolean
  price?: string
  registrationPrice?: string
}

export interface Domain {
  id: string
  name: string
  extension: string
  fullName: string
  owner: string
  price?: string
  isForSale: boolean
  expiryDate?: string
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  txHash: string
  type: 'mint' | 'transfer' | 'sale'
  from?: string
  to: string
  domainName: string
  price?: string
  status: 'pending' | 'confirmed' | 'failed'
  createdAt: string
}

export interface AdminDashboardData {
  totalUsers: number
  totalDomains: number
  totalTransactions: number
  totalRevenue: string
  recentTransactions: Transaction[]
  domainStats: {
    totalMinted: number
    totalForSale: number
    totalSold: number
  }
  userStats: {
    newUsersToday: number
    activeUsers: number
  }
}

// Environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token')
        window.location.href = '/auth'
      }
    }
    return Promise.reject(error)
  }
)

// API Client Object
export const apiClient = {
  // Health & Settings
  health: () => api.get<ApiResponse>('/health'),
  
  getSettings: () => api.get<ApiResponse>('/api/settings'),

  // Auth
  connectWallet: (walletAddress: string) =>
    api.post<ApiResponse>('/api/auth/connect-wallet', { walletAddress }),
  
  verifySignature: (data: { walletAddress: string; signature: string; message: string }) =>
    api.post<ApiResponse>('/api/auth/verify-signature', data),
  
  getProfile: () => api.get<ApiResponse<User>>('/api/auth/profile'),
  
  updateProfile: (data: Partial<User>) =>
    api.put<ApiResponse<User>>('/api/auth/profile', data),

  // Domains
  getExtensions: () => api.get<ApiResponse<Extension[]>>('/api/domains/extensions'),
  
  searchDomains: (query: string, extension?: string) =>
    api.get<ApiResponse<DomainSearchResult[]>>(`/api/domains/search?q=${encodeURIComponent(query)}${extension ? `&extension=${encodeURIComponent(extension)}` : ''}`),
  
  getUserDomains: (address: string) =>
    api.get<ApiResponse<Domain[]>>(`/api/domains/user/${encodeURIComponent(address)}`),
  
  trackMintTransaction: (data: { txHash: string; domainName: string; extension: string; price?: string }) =>
    api.post<ApiResponse>('/api/domains/mint', data),

  // Marketplace
  getMarketplaceDomains: (params?: { 
    extension?: string; 
    minPrice?: string; 
    maxPrice?: string; 
    sortBy?: string; 
    sortOrder?: string;
    limit?: number;
    offset?: number;
  }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString())
        }
      })
    }
    return api.get<ApiResponse<{ domains: Domain[]; pagination: PaginationResponse }>>(`/api/marketplace/domains?${searchParams}`)
  },
  
  getTrendingDomains: () =>
    api.get<ApiResponse<Domain[]>>('/api/marketplace/trending'),
  
  getDomainDetails: (fullName: string) =>
    api.get<ApiResponse<Domain>>(`/api/marketplace/domain/${encodeURIComponent(fullName)}`),

  // Transactions
  getUserTransactions: (address: string, params?: { limit?: number; offset?: number }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString())
        }
      })
    }
    return api.get<ApiResponse<{ transactions: Transaction[]; pagination: PaginationResponse }>>(`/api/transactions/user/${encodeURIComponent(address)}?${searchParams}`)
  },

  // Admin APIs
  admin: {
    getDashboard: () => api.get<ApiResponse<AdminDashboardData>>('/api/admin/dashboard'),
    
    getUsers: (params?: { limit?: number; offset?: number; search?: string }) => {
      const searchParams = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString())
          }
        })
      }
      return api.get<ApiResponse<{ users: User[]; pagination: PaginationResponse }>>(`/api/admin/users?${searchParams}`)
    },
    
    getDomains: (params?: { limit?: number; offset?: number; search?: string; extension?: string }) => {
      const searchParams = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString())
          }
        })
      }
      return api.get<ApiResponse<{ domains: Domain[]; pagination: PaginationResponse }>>(`/api/admin/domains?${searchParams}`)
    },
    
    getTransactions: (params?: { limit?: number; offset?: number; type?: string; status?: string }) => {
      const searchParams = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString())
          }
        })
      }
      return api.get<ApiResponse<{ transactions: Transaction[]; pagination: PaginationResponse }>>(`/api/admin/transactions?${searchParams}`)
    },
    
    getExtensions: () => api.get<ApiResponse<Extension[]>>('/api/admin/extensions'),
    
    createExtension: (data: Omit<Extension, 'id'>) =>
      api.post<ApiResponse<Extension>>('/api/admin/extensions', data),
    
    updateExtension: (id: string, data: Partial<Extension>) =>
      api.put<ApiResponse<Extension>>(`/api/admin/extensions/${id}`, data),
    
    deleteExtension: (id: string) =>
      api.delete<ApiResponse>(`/api/admin/extensions/${id}`),
    
    getSupport: (params?: { limit?: number; offset?: number; status?: string }) => {
      const searchParams = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString())
          }
        })
      }
      return api.get<ApiResponse<{ tickets: any[]; pagination: PaginationResponse }>>(`/api/admin/support?${searchParams}`)
    },
    
    updateUserStatus: (userId: string, status: 'active' | 'suspended') =>
      api.put<ApiResponse>(`/api/admin/users/${userId}/status`, { status }),
    
    getDomainAnalytics: (timeRange?: '7d' | '30d' | '90d' | '1y') =>
      api.get<ApiResponse>(`/api/admin/analytics/domains${timeRange ? `?range=${timeRange}` : ''}`),
    
    getRevenueAnalytics: (timeRange?: '7d' | '30d' | '90d' | '1y') =>
      api.get<ApiResponse>(`/api/admin/analytics/revenue${timeRange ? `?range=${timeRange}` : ''}`),
  }
}

// Export the axios instance as well for direct use if needed
export { api }

// Default export is the apiClient
export default apiClient