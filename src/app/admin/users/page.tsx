'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import AdminLayout from '@/components/admin/AdminLayout'
import { useAdminUsers, useUpdateUserStatus } from '@/hooks/useAdmin'
import { formatTimeAgo } from '@/lib/utils'

export default function AdminUsers() {
  const [search, setSearch] = useState('')
  const router = useRouter()
  const { data, isLoading, error, refetch } = useAdminUsers()
  const updateUserStatus = useUpdateUserStatus()

  const users = data?.users || []

  const filteredUsers = users.filter((user: any) =>
    user.wallet_address?.toLowerCase().includes(search.toLowerCase()) ||
    user.walletAddress?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.username?.toLowerCase().includes(search.toLowerCase())
  )

  const handleSuspendUser = async (userId: string, currentStatus: string) => {
    console.log('Suspend button clicked!', { userId, currentStatus })
    
    const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended'
    
    try {
      await updateUserStatus.mutateAsync({ userId, status: newStatus })
      alert(`User ${newStatus === 'suspended' ? 'suspended' : 'activated'} successfully!`)
    } catch (error) {
      console.error('Error updating user status:', error)
      alert('Failed to update user status')
    }
  }

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
          <div className="text-red-600 mb-4">Error loading users: {error.message}</div>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout userRole="super_admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage platform users and their roles</p>
          </div>
          <Button>Add User</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{users.length}</div>
              <div className="text-gray-600">Total Users</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">
                {users.filter((u: any) => u.role_name === 'super_admin' || u.role === 'super_admin').length}
              </div>
              <div className="text-gray-600">Super Admins</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {users.filter((u: any) => u.role_name === 'agent' || u.role === 'agent').length}
              </div>
              <div className="text-gray-600">Agents</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {users.filter((u: any) => u.role_name === 'user' || u.role === 'user').length}
              </div>
              <div className="text-gray-600">Regular Users</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>Search Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Search by wallet address, email, or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" onClick={() => setSearch('')}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Wallet Address</th>
                    <th className="text-left py-2">Name/Email</th>
                    <th className="text-left py-2">Role</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Domains</th>
                    <th className="text-left py-2">Joined</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user: any) => (
                    <tr key={user.id} className="border-b">
                      <td className="py-3 font-mono text-sm">{user.walletAddress || user.wallet_address}</td>
                      <td className="py-3">
                        <div>
                          {(user.username || user.name) && <div className="font-medium">{user.username || user.name}</div>}
                          {user.email && <div className="text-sm text-gray-600">{user.email}</div>}
                        </div>
                      </td>
                      <td className="py-3">
                        <Badge variant="outline">
                          user
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Badge variant={user.status === 'suspended' ? 'destructive' : 'default'}>
                          {user.status || 'active'}
                        </Badge>
                      </td>
                      <td className="py-3">0</td>
                      <td className="py-3 text-gray-600">
                        {formatTimeAgo(user.createdAt || user.joined_at || user.created_at)}
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/admin/users/${user.id}`)}
                          >
                            View Details
                          </Button>
                          <Button
                            variant={user.status === 'suspended' ? 'default' : 'destructive'}
                            size="sm"
                            onClick={() => handleSuspendUser(user.id, user.status || 'active')}
                            disabled={updateUserStatus.isPending}
                          >
                            {updateUserStatus.isPending ? 'Loading...' : 
                             user.status === 'suspended' ? 'Activate' : 'Suspend'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {search ? 'No users found matching your search.' : 'No users found.'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}