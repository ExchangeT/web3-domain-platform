'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import AdminLayout from '@/components/admin/AdminLayout'
import { useAdminExtensions } from '@/hooks/useAdmin'
import { formatPrice, formatTimeAgo } from '@/lib/utils'

export default function AdminExtensions() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const { data: extensions, isLoading, error, refetch } = useAdminExtensions()

  const stats = {
    total: extensions?.length || 0,
    enabled: extensions?.filter(ext => ext.isActive).length || 0,
    disabled: extensions?.filter(ext => !ext.isActive).length || 0,
    avgPrice: extensions && extensions.length > 0
      ? extensions.reduce((sum, ext) => sum + parseFloat(ext.price), 0) / extensions.length
      : 0
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
          <div className="text-red-600 mb-4">Error loading extensions: {error.message}</div>
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
            <h1 className="text-3xl font-bold text-gray-900">Extension Management</h1>
            <p className="text-gray-600">Manage domain extensions and pricing</p>
          </div>
          <Button onClick={() => setShowCreateForm(true)}>Create Extension</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-gray-600">Total Extensions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.enabled}</div>
              <div className="text-gray-600">Enabled</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.disabled}</div>
              <div className="text-gray-600">Disabled</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {formatPrice(stats.avgPrice.toString())}
              </div>
              <div className="text-gray-600">Avg Price</div>
            </CardContent>
          </Card>
        </div>

        {/* Create Extension Form */}
        {showCreateForm && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Extension</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input placeholder="Extension name (e.g., web3)" />
                <Input placeholder="Base price (ETH)" type="number" step="0.001" />
                <Input placeholder="Description" />
              </div>
              <div className="flex gap-2 mt-4">
                <Button>Create Extension</Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Extensions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {extensions?.map((ext) => (
            <Card key={ext.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">.{ext.name}</CardTitle>
                  <Badge variant={ext.isActive ? 'default' : 'secondary'}>
                    {ext.isActive ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Price:</span>
                    <span className="font-medium">{formatPrice(ext.price)}</span>
                  </div>
                  {ext.description && (
                    <div>
                      <span className="text-sm text-gray-600 block mb-1">Description:</span>
                      <p className="text-sm text-gray-700">{ext.description}</p>
                    </div>
                  )}
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                    <Button
                      variant={ext.isActive ? "destructive" : "default"}
                      size="sm"
                      className="flex-1"
                    >
                      {ext.isActive ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )) || <div className="col-span-full text-center text-gray-500">No extensions found</div>}
        </div>

        {/* Extension Management Table */}
        <Card>
          <CardHeader>
            <CardTitle>Extension Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Extension</th>
                    <th className="text-left py-2">Price</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {extensions?.map((ext) => (
                    <tr key={ext.id} className="border-b">
                      <td className="py-3">
                        <div className="font-semibold">.{ext.name}</div>
                        {ext.description && (
                          <div className="text-sm text-gray-600">{ext.description}</div>
                        )}
                      </td>
                      <td className="py-3">{formatPrice(ext.price)}</td>
                      <td className="py-3">
                        <Badge variant={ext.isActive ? 'default' : 'secondary'}>
                          {ext.isActive ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <button className="text-blue-600 hover:underline mr-2">Edit</button>
                        <button className={`hover:underline ${ext.isActive ? 'text-red-600' : 'text-green-600'}`}>
                          {ext.isActive ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-gray-500">
                        No extensions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}