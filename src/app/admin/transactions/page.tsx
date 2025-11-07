'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import AdminLayout from '@/components/admin/AdminLayout'
import { useAdminTransactions } from '@/hooks/useAdmin'
import { formatPrice, formatTimeAgo } from '@/lib/utils'

export default function AdminTransactions() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const { data, isLoading, error, refetch } = useAdminTransactions()

  const transactions = data?.transactions || []

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.txHash?.toLowerCase().includes(search.toLowerCase()) ||
                         tx.domainName?.toLowerCase().includes(search.toLowerCase()) ||
                         tx.from?.toLowerCase().includes(search.toLowerCase()) ||
                         tx.to?.toLowerCase().includes(search.toLowerCase())

    const matchesType = typeFilter === 'all' || tx.type === typeFilter
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const stats = {
    total: transactions.length,
    confirmed: transactions.filter(tx => tx.status === 'confirmed').length,
    pending: transactions.filter(tx => tx.status === 'pending').length,
    failed: transactions.filter(tx => tx.status === 'failed').length,
    totalVolume: transactions.filter(tx => tx.status === 'confirmed')
      .reduce((sum, tx) => sum + parseFloat(tx.price || '0'), 0)
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
          <div className="text-red-600 mb-4">Error loading transactions: {error.message}</div>
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
            <h1 className="text-3xl font-bold text-gray-900">Transaction Management</h1>
            <p className="text-gray-600">Monitor all platform transactions and blockchain activity</p>
          </div>
          <Button>Export Transactions</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-gray-600">Total Transactions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
              <div className="text-gray-600">Confirmed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-gray-600">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
              <div className="text-gray-600">Failed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatPrice(stats.totalVolume.toString())} ETH
              </div>
              <div className="text-gray-600">Total Volume</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Search hash, domain, or address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Types</option>
                <option value="mint">Mint</option>
                <option value="sale">Sale</option>
                <option value="transfer">Transfer</option>
                <option value="list">List</option>
                <option value="unlist">Unlist</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              <Button variant="outline" onClick={() => {
                setSearch('')
                setTypeFilter('all')
                setStatusFilter('all')
              }}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Transactions ({filteredTransactions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Hash</th>
                    <th className="text-left py-2">Type</th>
                    <th className="text-left py-2">Domain</th>
                    <th className="text-left py-2">From</th>
                    <th className="text-left py-2">To</th>
                    <th className="text-left py-2">Amount</th>
                    <th className="text-left py-2">Fee</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Time</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b">
                      <td className="py-3 font-mono text-sm">
                        <a
                          href={`https://etherscan.io/tx/${tx.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {tx.txHash?.slice(0, 10)}...{tx.txHash?.slice(-8)}
                        </a>
                      </td>
                      <td className="py-3">
                        <Badge variant="outline">{tx.type}</Badge>
                      </td>
                      <td className="py-3 font-medium">{tx.domainName || '-'}</td>
                      <td className="py-3 font-mono text-sm">
                        {tx.from?.slice(0, 6)}...{tx.from?.slice(-4)}
                      </td>
                      <td className="py-3 font-mono text-sm">
                        {tx.to?.slice(0, 6)}...{tx.to?.slice(-4)}
                      </td>
                      <td className="py-3">{formatPrice(tx.price || '0')} ETH</td>
                      <td className="py-3">-</td>
                      <td className="py-3">
                        <Badge variant={
                          tx.status === 'confirmed' ? 'default' :
                          tx.status === 'pending' ? 'secondary' : 'destructive'
                        }>
                          {tx.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-gray-600">
                        {formatTimeAgo(tx.createdAt)}
                      </td>
                      <td className="py-3">
                        <button className="text-blue-600 hover:underline mr-2">View</button>
                        {tx.status === 'pending' && (
                          <button className="text-orange-600 hover:underline">Check</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredTransactions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {search || typeFilter !== 'all' || statusFilter !== 'all' ? 
                  'No transactions found matching your criteria.' : 
                  'No transactions found.'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}