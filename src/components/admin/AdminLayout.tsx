'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { 
  Users, 
  BarChart3, 
  Settings, 
  Globe, 
  Shield, 
  MessageSquare,
  LogOut,
  Menu,
  X,
  CreditCard,
  Puzzle,
  Download,
  Activity,
  Bell
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
  userRole?: string
  permissions?: string[]
}

const adminNavigation = [
  { 
    name: 'Dashboard', 
    href: '/admin', 
    icon: BarChart3, 
    permission: 'view_analytics',
    description: 'Overview and key metrics'
  },
  { 
    name: 'Users', 
    href: '/admin/users', 
    icon: Users, 
    permission: 'view_users',
    description: 'Manage platform users'
  },
  { 
    name: 'Domains', 
    href: '/admin/domains', 
    icon: Globe, 
    permission: 'view_domains',
    description: 'Domain management'
  },
  { 
    name: 'Transactions', 
    href: '/admin/transactions', 
    icon: CreditCard, 
    permission: 'view_transactions',
    description: 'Transaction history'
  },
  { 
    name: 'Extensions', 
    href: '/admin/extensions', 
    icon: Puzzle, 
    permission: 'manage_extensions',
    description: 'Domain extensions'
  },
  { 
    name: 'Support', 
    href: '/admin/support', 
    icon: MessageSquare, 
    permission: 'view_support',
    description: 'Customer support'
  },
  { 
    name: 'Analytics', 
    href: '/admin/analytics', 
    icon: BarChart3, 
    permission: 'view_analytics',
    description: 'Detailed analytics'
  },
  { 
    name: 'Settings', 
    href: '/admin/settings', 
    icon: Settings, 
    permission: 'system_settings',
    description: 'Platform settings'
  },
]

const quickActions = [
  { name: 'Export Users', href: '/admin/export/users', icon: Download },
  { name: 'Export Domains', href: '/admin/export/domains', icon: Download },
  { name: 'System Health', href: '/admin/system/health', icon: Activity },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const pathname = usePathname()
  
  // Use admin authentication hook
  const { isAuthenticated, isLoading, userRole } = useAdminAuth()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, return null (useAdminAuth handles redirect)
  if (!isAuthenticated) {
    return null
  }

  // Filter navigation based on user role and permissions
  const allowedNavigation = adminNavigation.filter(item => {
    if (userRole === 'super_admin') return true
    
    // Define role-based permissions
    const rolePermissions = {
      'admin': ['view_analytics', 'view_users', 'view_domains', 'view_transactions'],
      'agent': ['view_users', 'view_domains']
    }
    
    const userPermissions = rolePermissions[userRole || ''] || []
    return userPermissions.includes(item.permission)
  })

  const handleLogout = () => {
    localStorage.removeItem('auth-token')
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
            <div className="flex flex-col h-full">
              {/* Mobile header */}
              <div className="p-6 border-b flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
                  <p className="text-sm text-gray-600 capitalize">{userRole} Access</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Mobile navigation */}
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {allowedNavigation.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <div>
                        <div>{item.name}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </Link>
                  )
                })}
              </nav>

              {/* Mobile quick actions */}
              {userRole === 'super_admin' && (
                <div className="p-4 border-t">
                  <div className="text-sm font-medium text-gray-500 mb-2">Quick Actions</div>
                  <div className="space-y-1">
                    {quickActions.map((action) => {
                      const Icon = action.icon
                      return (
                        <Link
                          key={action.name}
                          href={action.href}
                          className="flex items-center space-x-2 px-2 py-1 text-sm text-gray-600 hover:text-gray-900"
                        >
                          <Icon className="h-4 w-4" />
                          <span>{action.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Mobile footer */}
              <div className="p-4 border-t space-y-2">
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    Back to Site
                  </Button>
                </Link>
                <Button variant="destructive" className="w-full" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:block">
        <div className="flex flex-col h-full bg-white shadow-lg">
          {/* Desktop header */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
            <p className="text-sm text-gray-600 capitalize">{userRole} Access</p>
            <div className="mt-2">
              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                Authenticated
              </div>
            </div>
          </div>

          {/* Desktop navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {allowedNavigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <div>
                    <div>{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Desktop quick actions - only for super admin */}
          {userRole === 'super_admin' && (
            <div className="p-4 border-t">
              <div className="text-sm font-medium text-gray-500 mb-2">Quick Actions</div>
              <div className="space-y-1">
                {quickActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <Link
                      key={action.name}
                      href={action.href}
                      className="flex items-center space-x-2 px-2 py-1 text-sm text-gray-600 hover:text-gray-900"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{action.name}</span>
                    </Link>
                  )
                })}
                </div>
            </div>
          )}

          {/* Desktop footer */}
          <div className="p-4 border-t space-y-2">
            <Link href="/">
              <Button variant="outline" className="w-full">
                Back to Site
              </Button>
            </Link>
            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top header for mobile and notifications */}
        <div className="bg-white border-b lg:border-b-0">
          <div className="flex items-center justify-between p-4">
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Desktop title */}
            <div className="hidden lg:block">
              <h1 className="text-2xl font-semibold text-gray-900">
                {allowedNavigation.find(item => item.href === pathname)?.name || 'Admin'}
              </h1>
            </div>

            {/* User info and notifications */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-medium capitalize">{userRole}</span>
              </div>
              
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
                </Button>

                {/* Notification dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border z-50">
                    <div className="p-4 border-b">
                      <h3 className="font-medium">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <div className="p-4 border-b hover:bg-gray-50">
                        <div className="text-sm font-medium">New user registered</div>
                        <div className="text-xs text-gray-500">5 minutes ago</div>
                      </div>
                      <div className="p-4 border-b hover:bg-gray-50">
                        <div className="text-sm font-medium">Domain sale completed</div>
                        <div className="text-xs text-gray-500">10 minutes ago</div>
                      </div>
                      <div className="p-4 hover:bg-gray-50">
                        <div className="text-sm font-medium">System backup completed</div>
                        <div className="text-xs text-gray-500">1 hour ago</div>
                      </div>
                    </div>
                    <div className="p-2 border-t">
                      <Button variant="ghost" size="sm" className="w-full">
                        View all notifications
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-8">
          {children}
        </main>
      </div>

      {/* Click outside to close notifications */}
      {notificationsOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setNotificationsOpen(false)}
        />
      )}
    </div>
  )
}