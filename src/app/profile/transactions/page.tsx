'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ExternalLink, Search } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { formatPrice, formatTimeAgo } from '@/lib/utils'

export default function TransactionsPage() {
  const { address, isAuthenticated } = useAuth()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  // Mock transactions data - replace with real API call
  const transactions = [
    {
      id: '1',
      txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      type: 'mint',
      domainName: 'example.moh',
      amount: '0.01',
      status: 'confirmed',
      createdAt: '2024-01-15T10:30:00Z',
      blockNumber: 12345678
    },
    {
      id: '2',
      txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      type: 'sale',
      domainName: 'crypto.web3',
      amount: '0.05',
      status: 'confirmed',
      createdAt: '2024-01-14T15:20:00Z',
      blockNumber: 12345677
    }
  ]

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
            <p className="text-gray-600 mb-4">Please connect your wallet to view transactions</p>
            <w3m-button />
          </CardContent>
        </Card>
      </div>
    )
  }

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.domainName.toLowerCase().includes(search.toLowerCase()) ||
                         tx.txHash.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || tx.type === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Transaction History</h1>
        <p className="text-gray-600">View all your domain-related transactions</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by domain or transaction hash..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Types</option>
              <option value="mint">Mint</option>
              <option value="sale">Sale</option>
              <option value="purchase">Purchase</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>All Transactions ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Type</th>
                  <th className="text-left py-2">Domain</th>
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Transaction</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b">
                    <td className="py-3">
                      <Badge variant="outline">{tx.type}</Badge>
                    </td>
                    <td className="py-3 font-medium">{tx.domainName}</td>
                    <td className="py-3">{formatPrice(tx.amount)} ETH</td>
                    <td className="py-3">
                      <Badge variant={tx.status === 'confirmed' ? 'default' : 'secondary'}>
                        {tx.status}
                      </Badge>
                    </td>
                    <td className="py-3">{formatTimeAgo(tx.createdAt)}</td>
                    <td className="py-3">
                      <a
                        href={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center"
                      >
                        View <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredTransactions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {search || filter !== 'all' ? 
                'No transactions found matching your criteria.' : 
                'No transactions found.'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}