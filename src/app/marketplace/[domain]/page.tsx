'use client'

import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ExternalLink, Copy, ShoppingCart } from 'lucide-react'
import { useMarketplace } from '@/hooks/useMarketplace'
import { formatPrice, formatTimeAgo, formatAddress, copyToClipboard } from '@/lib/utils'
import Link from 'next/link'

export default function DomainDetailPage() {
  const params = useParams()
  const domainName = params.domain as string
  
  const { getDomainDetails } = useMarketplace()
  const { data: domainData, isLoading } = getDomainDetails(domainName)

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading domain details...</div>
      </div>
    )
  }

  if (!domainData) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Domain Not Found</h2>
            <p className="text-gray-600 mb-4">The domain you&apos;re looking for doesn&apos;t exist or isn&apos;t listed.</p>
            <Link href="/marketplace">
              <Button>Back to Marketplace</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { domain, priceHistory, transactions } = domainData

  const handleCopyAddress = (address: string) => {
    copyToClipboard(address)
    // You could add a toast notification here
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link href="/marketplace" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Marketplace
      </Link>

      {/* Domain Header */}
      <Card className="mb-6">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">{domain.fullName}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <Badge variant="outline" className="text-lg px-3 py-1">
                  .{domain.extension}
                </Badge>
                {domain.isListed ? (
                  <Badge variant="success" className="text-lg px-3 py-1">For Sale</Badge>
                ) : (
                  <Badge variant="outline" className="text-lg px-3 py-1">Owned</Badge>
                )}
                {domain.timesSold > 0 && (
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {domain.timesSold} sales
                  </Badge>
                )}
              </div>
              
              {/* Owner Info */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Owner:</span>
                  <button 
                    onClick={() => handleCopyAddress(domain.currentOwner)}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                  >
                    <span>{formatAddress(domain.currentOwner)}</span>
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                
                {domain.resolvedAddress && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Resolves to:</span>
                    <button 
                      onClick={() => handleCopyAddress(domain.resolvedAddress!)}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                    >
                      <span>{formatAddress(domain.resolvedAddress)}</span>
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Registered:</span>
                  <span>{formatTimeAgo(domain.mintedAt)}</span>
                </div>
              </div>
            </div>
            
            {/* Price and Actions */}
            <div className="text-right mt-6 md:mt-0">
              {domain.isListed ? (
                <>
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {formatPrice(domain.currentListPrice || '0')} ETH
                  </div>
                  <div className="text-gray-600 mb-4">
                    Listed {formatTimeAgo(domain.listedAt || '')}
                  </div>
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Buy Now
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold text-gray-600 mb-2">
                    {formatPrice(domain.purchasePrice || '0')} ETH
                  </div>
                  <div className="text-gray-600 mb-4">Purchase Price</div>
                  <Badge variant="outline" className="text-lg px-4 py-2">Not for Sale</Badge>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Price History */}
        {priceHistory && priceHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Price History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {priceHistory.map((entry, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div>
                      <div className="font-semibold capitalize">{entry.priceType}</div>
                      <div className="text-sm text-gray-600">{formatTimeAgo(entry.createdAt)}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatPrice(entry.price || '0')} ETH</div>
                      {entry.changedBy && (
                        <div className="text-sm text-gray-600">
                          by {formatAddress(entry.changedBy)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transaction History */}
        {transactions && transactions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx.txHash} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div>
                      <div className="font-semibold capitalize">{tx.txType}</div>
                      <div className="text-sm text-gray-600">{formatTimeAgo(tx.confirmedAt || tx.createdAt)}</div>
                      <a 
                        href={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-xs hover:underline flex items-center"
                      >
                        View on Etherscan <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatPrice(tx.amount || '0')} ETH</div>
                      <Badge variant={tx.status === 'confirmed' ? 'success' : 'warning'} className="text-xs">
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
