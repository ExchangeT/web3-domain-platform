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
  
  const { useDomainDetails } = useMarketplace()
  const { data: domainData, isLoading } = useDomainDetails(domainName)

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

  const domain = domainData

  const handleCopyAddress = (address: string) => {
    copyToClipboard(address)
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
                {domain.isForSale ? (
                  <Badge className="text-lg px-3 py-1">For Sale</Badge>
                ) : (
                  <Badge variant="outline" className="text-lg px-3 py-1">Owned</Badge>
                )}
              </div>

              {/* Owner Info */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Owner:</span>
                  <button
                    onClick={() => handleCopyAddress(domain.owner)}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                  >
                    <span>{formatAddress(domain.owner)}</span>
                    <Copy className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Registered:</span>
                  <span>{formatTimeAgo(domain.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Price and Actions */}
            <div className="text-right mt-6 md:mt-0">
              {domain.isForSale ? (
                <>
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {formatPrice(domain.price || '0')}
                  </div>
                  <div className="text-gray-600 mb-4">
                    Listed {formatTimeAgo(domain.updatedAt)}
                  </div>
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Buy Now
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold text-gray-600 mb-2">
                    {formatPrice(domain.price || '0')}
                  </div>
                  <div className="text-gray-600 mb-4">Current Price</div>
                  <Badge variant="outline" className="text-lg px-4 py-2">Not for Sale</Badge>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Domain Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Full Name:</span>
              <span className="font-medium">{domain.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Extension:</span>
              <span className="font-medium">.{domain.extension}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <Badge variant={domain.isForSale ? 'default' : 'secondary'}>
                {domain.isForSale ? 'For Sale' : 'Owned'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Created:</span>
              <span>{formatTimeAgo(domain.createdAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
