'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { logger } from '@/lib/logger'

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = async () => {
    try {
      const token = localStorage.getItem('auth-token')
      
      if (!token) {
        router.push('/')
        return
      }

      // Verify token with backend using apiClient
      const response = await apiClient.getProfile()
      const user = response.data

      // Check if user has admin role (default to 'user' if role is null/undefined)
      const userRole = user.role || 'user'
      const adminRoles = ['super_admin', 'admin']
      if (!adminRoles.includes(userRole)) {
        router.push('/')
        return
      }

      setIsAuthenticated(true)
      setUserRole(userRole)
      logger.auth.info(`Admin authenticated: ${userRole}`)
    } catch (error) {
      logger.auth.error('Admin auth check failed', error)
      router.push('/')
    } finally {
      setIsLoading(false)
    }
  }

  return { isAuthenticated, isLoading, userRole }
}