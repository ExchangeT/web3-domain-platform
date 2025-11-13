'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, User, Globe, CreditCard, Activity, ShoppingCart } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useUserDetails } from '@/hooks/useAdmin'
import { formatTimeAgo } from '@/lib/utils'

export default function UserDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('domains')
  const userId = params.userId as string
  
  const { data, isLoading, error } = useUserDetails(userId)

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
        <div className="text-center">
          <div className="text-red-600 mb-4">Error loading user details: {error.message}</div>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </AdminLayout>
    )
  }

  const { user, recentSessions, domains, transactions, marketplaceOrders } = data || {}

  const tabs = [
    { id: 'domains', label: 'Domains', icon: Globe, count: domains?.length },
    { id: 'transactions', label: 'Transactions', icon: CreditCard, count: transactions?.length },
    { id: 'sessions', label: 'Sessions', icon: Activity, count: recentSessions?.length },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, count: marketplaceOrders?.length },
    { id: 'profile', label: 'Profile', icon: User }
  ]

  return (
    <AdminLayout userRole="super_admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
            <p className="text-gray-600">Comprehensive user information and activity</p>
          </div>
        </div>

        {/* User Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Basic Information</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-600">Wallet:</span> {user?.wallet_address}</div>
                  <div><span className="text-gray-600">Name:</span> {user?.name || 'Not provided'}</div>
                  <div><span className="text-gray-600">Email:</span> {user?.email || 'Not provided'}</div>
                  <div><span className="text-gray-600">Joined:</span> {formatTimeAgo(user?.joined_at)}</div>
                  <div><span className="text-gray-600">Status:</span> 
                    <Badge className="ml-2" variant={user?.status === 'suspended' ? 'destructive' : 'default'}>
                      {user?.status || 'active'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Last Session</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-600">Last Login:</span> {formatTimeAgo(user?.last_login)}</div>
                  <div><span className="text-gray-600">IP Address:</span> {user?.last_login_ip || 'Unknown'}</div>
                  <div><span className="text-gray-600">Location:</span> {user?.last_login_city && user?.last_login_country ? `${user.last_login_city}, ${user.last_login_country}` : 'Unknown'}</div>
                  <div><span className="text-gray-600">Browser:</span> {user?.last_login_browser || 'Unknown'}</div>
                  <div><span className="text-gray-600">Device:</span> {user?.last_login_device || 'Unknown'}</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Activity Summary</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-600">Total Domains:</span> {domains?.length || 0}</div>
                  <div><span className="text-gray-600">Total Transactions:</span> {transactions?.length || 0}</div>
                  <div><span className="text-gray-600">Total Sessions:</span> {recentSessions?.length || 0}</div>
                  <div><span className="text-gray-600">Open Orders:</span> {marketplaceOrders?.filter((o: any) => o.status === 'active').length || 0}</div>
                  <div><span className="text-gray-600">Closed Orders:</span> {marketplaceOrders?.filter((o: any) => o.status === 'completed').length || 0}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Custom Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {tab.count !== undefined && (
                    <Badge variant="secondary" className="ml-1">
                      {tab.count}
                    </Badge>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'domains' && (
          <Card>
            <CardHeader>
              <CardTitle>User Domains ({domains?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Domain</th>
                      <th className="text-left py-2">Extension</th>
                      <th className="text-left py-2">Purchase Price</th>
                      <th className="text-left py-2">Listed</th>
                      <th className="text-left py-2">List Price</th>
                      <th className="text-left py-2">Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {domains?.map((domain: any) => (
                      <tr key={domain.id} className="border-b">
                        <td className="py-3 font-medium">{domain.fullName || domain.full_name}</td>
                        <td className="py-3">{domain.extension}</td>
                        <td className="py-3">{domain.price || domain.purchase_price} ETH</td>
                        <td className="py-3">
                          <Badge variant={domain.is_listed ? 'default' : 'secondary'}>
                            {domain.is_listed ? 'Yes' : 'No'}
                          </Badge>
                        </td>
                        <td className="py-3">{domain.list_price ? `${domain.list_price} ETH` : '-'}</td>
                        <td className="py-3">{formatTimeAgo(domain.minted_at)}</td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-500">
                          No domains found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'transactions' && (
          <Card>
            <CardHeader>
              <CardTitle>User Transactions ({transactions?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Hash</th>
                      <th className="text-left py-2">Type</th>
                      <th className="text-left py-2">Domain</th>
                      <th className="text-left py-2">Amount</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions?.map((tx: any) => (
                      <tr key={tx.id} className="border-b">
                        <td className="py-3 font-mono text-sm">
                          {tx.tx_hash?.slice(0, 10)}...{tx.tx_hash?.slice(-8)}
                        </td>
                        <td className="py-3">
                          <Badge variant="outline">{tx.tx_type}</Badge>
                        </td>
                        <td className="py-3">{tx.domain_name || '-'}</td>
                        <td className="py-3">{tx.amount} ETH</td>
                        <td className="py-3">
                          <Badge variant={tx.status === 'confirmed' ? 'default' : 'secondary'}>
                            {tx.status}
                          </Badge>
                        </td>
                        <td className="py-3">{formatTimeAgo(tx.created_at)}</td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-500">
                          No transactions found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'sessions' && (
          <Card>
            <CardHeader>
              <CardTitle>Login/Session History ({recentSessions?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Date & Time</th>
                      <th className="text-left py-2">IP Address</th>
                      <th className="text-left py-2">Location</th>
                      <th className="text-left py-2">Browser</th>
                      <th className="text-left py-2">Device/OS</th>
                      <th className="text-left py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSessions?.map((session: any) => (
                      <tr key={session.id} className="border-b">
                        <td className="py-3">{new Date(session.created_at).toLocaleString()}</td>
                        <td className="py-3 font-mono text-sm">{session.ip_address}</td>
                        <td className="py-3">{session.city && session.country ? `${session.city}, ${session.country}` : 'Unknown'}</td>
                        <td className="py-3">{session.browser}</td>
                        <td className="py-3">{session.device} / {session.os}</td>
                        <td className="py-3">
                          <Badge variant={session.is_active ? 'default' : 'secondary'}>
                            {session.is_active ? 'Active' : 'Ended'}
                          </Badge>
                        </td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-500">
                          No session history found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'orders' && (
          <Card>
            <CardHeader>
              <CardTitle>Marketplace Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Marketplace orders functionality will be implemented when marketplace tables are created
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'profile' && (
          <Card>
            <CardHeader>
              <CardTitle>User Profile Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Account Actions</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      Edit User Information
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Change User Role
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Reset Password
                    </Button>
                    <Button variant="destructive" className="w-full justify-start">
                      {user?.status === 'suspended' ? 'Activate Account' : 'Suspend Account'}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Account Statistics</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Account Age:</span>
                      <span>{user?.joined_at ? Math.floor((new Date().getTime() - new Date(user.joined_at).getTime()) / (1000 * 60 * 60 * 24)) : 0} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Spent:</span>
                      <span>{domains?.reduce((sum: number, d: any) => sum + parseFloat(d.purchase_price || d.price || '0'), 0).toFixed(3)} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Earned:</span>
                      <span>{transactions?.filter((t: any) => t.tx_type === 'sale' || t.type === 'sale').reduce((sum: number, t: any) => sum + parseFloat(t.amount || t.price || '0'), 0).toFixed(3)} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Success Rate:</span>
                      <span>{transactions?.length ? Math.round((transactions.filter((t: any) => t.status === 'confirmed').length / transactions.length) * 100) : 0}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}