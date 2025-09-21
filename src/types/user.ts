export interface User {
  id: number
  name?: string
  email?: string
  walletAddress: string
  role?: 'super_admin' | 'admin' | 'agent' | 'marketing' | 'user'
  isVerified?: boolean
  createdAt?: string
  lastLoginAt?: string
  loginCount?: number
}

export interface AuthResponse {
  success: boolean
  data: {
    user: User
    token: string
  }
  message?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}