'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Globe, BarChart3, DollarSign } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useAdminDashboard } from '@/hooks/useAdmin'

export default function AdminDashboard() {
  const { data, isLoading, error } = useAdminDashboard()

  if (isLoading) {
    return (
      <AdminLayout userRole="super_admin">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout userRole="super_admin">
        <div className="text-center text-red-600">
          Error loading dashboard: {error.message}
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout userRole="super_admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Platform overview and statistics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                +{data?.userStats?.newUsersToday || 0} today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Domains</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.totalDomains || 0}</div>
              <p className="text-xs text-muted-foreground">
                {data?.domainStats?.totalForSale || 0} for sale
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.totalTransactions || 0}</div>
              <p className="text-xs text-muted-foreground">Total transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.totalRevenue || '0'} ETH</div>
              <p className="text-xs text-muted-foreground">All time volume</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity - showing message for now */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-500 text-center py-8">
                Connected to database - recent registrations will appear here
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-500 text-center py-8">
                Connected to database - recent sales will appear here
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}