'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import AdminLayout from '@/components/admin/AdminLayout'
import { useAdminDomains } from '@/hooks/useAdmin'
import { formatPrice, formatTimeAgo } from '@/lib/utils'

export default function AdminDomains() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const { data: domainsData, isLoading, error, refetch } = useAdminDomains()
  const domains = domainsData?.domains || []

  const filteredDomains = domains.filter(domain => {
    const matchesSearch = domain.fullName?.toLowerCase().includes(search.toLowerCase()) ||
                         domain.owner?.toLowerCase().includes(search.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'listed' && domain.isForSale) ||
                         (statusFilter === 'unlisted' && !domain.isForSale)
    
    return matchesSearch && matchesStatus
  }) || []

  const stats = {
    total: domains.length,
    listed: domains.filter(d => d.isForSale).length,
    unlisted: domains.filter(d => !d.isForSale).length,
    totalValue: domains.reduce((sum, d) => sum + parseFloat(d.price || '0'), 0)
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
          <div className="text-red-600 mb-4">Error loading domains: {error.message}</div>
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
            <h1 className="text-3xl font-bold text-gray-900">Domain Management</h1>
            <p className="text-gray-600">Manage all platform domains and listings</p>
          </div>
          <Button>Export Data</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-gray-600">Total Domains</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.listed}</div>
              <div className="text-gray-600">Listed for Sale</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.unlisted}</div>
              <div className="text-gray-600">Privately Held</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {formatPrice(stats.totalValue.toString())} ETH
              </div>
              <div className="text-gray-600">Total Value</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Search domains or owners..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Status</option>
                <option value="listed">Listed for Sale</option>
                <option value="unlisted">Privately Held</option>
              </select>
              <Button variant="outline" onClick={() => {
                setSearch('')
                setStatusFilter('all')
              }}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Domains Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Domains ({filteredDomains.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Domain</th>
                    <th className="text-left py-2">Extension</th>
                    <th className="text-left py-2">Owner</th>
                    <th className="text-left py-2">Purchase Price</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">List Price</th>
                    <th className="text-left py-2">Registered</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDomains.map((domain) => (
                    <tr key={domain.id} className="border-b">
                      <td className="py-3 font-semibold">{domain.fullName}</td>
                      <td className="py-3">
                        <Badge variant="outline">.{domain.extension}</Badge>
                      </td>
                      <td className="py-3">
                        <div className="font-mono text-sm">{domain.owner}</div>
                      </td>
                      <td className="py-3">{formatPrice(domain.price || '0')} ETH</td>
                      <td className="py-3">
                        <Badge variant={domain.isForSale ? 'default' : 'secondary'}>
                          {domain.isForSale ? 'For Sale' : 'Held'}
                        </Badge>
                      </td>
                      <td className="py-3">
                        {domain.isForSale && domain.price ? 
                          `${formatPrice(domain.price)} ETH` : '-'}
                      </td>
                      <td className="py-3 text-gray-600">
                        {formatTimeAgo(domain.createdAt)}
                      </td>
                      <td className="py-3">
                        <button className="text-blue-600 hover:underline mr-2">View</button>
                        <button className="text-orange-600 hover:underline">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredDomains.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {search || statusFilter !== 'all' ? 
                  'No domains found matching your criteria.' : 
                  'No domains found.'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}