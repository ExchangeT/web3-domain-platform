'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Settings, ExternalLink, Copy, DollarSign } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useDomains } from '@/hooks/useDomains'
import { formatPrice, formatTimeAgo, formatAddress, copyToClipboard } from '@/lib/utils'
import Link from 'next/link'

export default function MyDomainsPage() {
  const { address, isAuthenticated } = useAuth()
  const { useUserDomains } = useDomains()
  const [selectedDomain, setSelectedDomain] = useState<{
    id: string;
    name: string;
    extension: string;
    fullName: string;
    owner: string;
    price?: string;
    createdAt: string;
    isForSale: boolean;
  } | null>(null)
  const [resolveAddress, setResolveAddress] = useState('')
  
  const { data: domains, isLoading } = useUserDomains(address)

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
            <p className="text-gray-600 mb-4">Please connect your wallet to view your domains</p>
            {/* @ts-expect-error - Web3Modal custom element */}
            <w3m-button />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading your domains...</div>
      </div>
    )
  }

  const handleCopyAddress = (address: string) => {
    copyToClipboard(address)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Domains</h1>
        <p className="text-gray-600">Manage your Web3 domain portfolio</p>
      </div>

      {/* Portfolio Summary */}
      {domains && domains.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{domains.length}</div>
              <div className="text-gray-600">Total Domains</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">
                {domains.filter(d => d.isForSale).length}
              </div>
              <div className="text-gray-600">Listed for Sale</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatPrice(
                  domains
                    .filter(d => d.isForSale)
                    .reduce((sum, d) => sum + parseFloat(d.price || '0'), 0)
                    .toString()
                )} ETH
              </div>
              <div className="text-gray-600">Total List Value</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {formatPrice(
                  domains.reduce((sum, d) => sum + parseFloat(d.price || '0'), 0).toString()
                )} ETH
              </div>
              <div className="text-gray-600">Total Invested</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Domain List */}
      {!domains || domains.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">No domains yet</h3>
            <p className="text-gray-600 mb-4">Start building your Web3 identity by registering your first domain</p>
            <Link href="/search">
              <Button>Search Domains</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {domains.map((domain) => (
            <Card key={domain.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-xl font-semibold">{domain.fullName}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">.{domain.extension}</Badge>
                        {domain.isForSale && <Badge variant="success">For Sale</Badge>}
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        Registered {formatTimeAgo(domain.createdAt)} • 
                        Paid {formatPrice(domain.price || '0')} ETH
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {domain.isForSale && (
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {formatPrice(domain.price || '0')} ETH
                        </div>
                        <div className="text-sm text-gray-600">Listed Price</div>
                      </div>
                    )}
                    
                    <div className="flex flex-col space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDomain(domain)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Manage
                      </Button>
                      
                      <Link href={`/marketplace/${domain.fullName}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Domain Management Modal */}
      {selectedDomain && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Manage {selectedDomain.fullName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Set Resolution */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Resolve to Address
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="0x..."
                    value={resolveAddress}
                    onChange={(e) => setResolveAddress(e.target.value)}
                  />
                  <Button size="sm">Update</Button>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Set the wallet address this domain should resolve to
                </p>
              </div>

              {/* List for Sale */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  List for Sale
                </label>
                <div className="flex gap-2">
                  <Input placeholder="Price in ETH" />
                  <Button size="sm">
                    <DollarSign className="h-4 w-4 mr-1" />
                    List
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedDomain(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleCopyAddress(selectedDomain.owner)}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Address
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
