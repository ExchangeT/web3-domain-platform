'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Settings, 
  ExternalLink, 
  Copy, 
  Globe, 
  Wallet,
  History,
  Shield,
  RefreshCw
} from 'lucide-react';

interface Domain {
  id: string;
  name: string;
  extension: string;
  fullName: string;
  currentOwner: string;
  resolvedAddress?: string;
  isListed: boolean;
  price?: string;
  mintedAt: string;
  expiresAt?: string;
  timesSold: number;
}

interface DomainManagementProps {
  userAddress: string;
}

export default function DomainManagement({ userAddress }: DomainManagementProps) {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [resolveAddress, setResolveAddress] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch user's domains
  useEffect(() => {
    fetchUserDomains();
  }, [userAddress]);

  const fetchUserDomains = async () => {
    try {
      setLoading(true);
      // This would call your backend API
      const response = await fetch(`/api/domains/user/${userAddress}`);
      const data = await response.json();
      setDomains(data.domains || []);
    } catch (error) {
      console.error('Error fetching domains:', error);
      toast.error('Failed to load domains');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success('Address copied to clipboard');
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const updateResolution = async () => {
    if (!selectedDomain || !resolveAddress) return;

    try {
      setIsUpdating(true);
      
      // Call your smart contract resolver
      const response = await fetch('/api/domains/resolve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain: selectedDomain.fullName,
          address: resolveAddress,
          owner: userAddress
        }),
      });

      if (response.ok) {
        toast.success('Domain resolution updated successfully');
        setSelectedDomain(null);
        setResolveAddress('');
        fetchUserDomains(); // Refresh the list
      } else {
        throw new Error('Failed to update resolution');
      }
    } catch (error) {
      console.error('Error updating resolution:', error);
      toast.error('Failed to update domain resolution');
    } finally {
      setIsUpdating(false);
    }
  };

  const listForSale = async (domain: Domain, price: string) => {
    try {
      const response = await fetch('/api/marketplace/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain: domain.fullName,
          price: price,
          seller: userAddress
        }),
      });

      if (response.ok) {
        toast.success('Domain listed for sale');
        fetchUserDomains();
      } else {
        throw new Error('Failed to list domain');
      }
    } catch (error) {
      console.error('Error listing domain:', error);
      toast.error('Failed to list domain for sale');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Domains</h1>
          <p className="text-gray-600 mt-1">
            Manage your {domains.length} registered domains
          </p>
        </div>
        <Button onClick={fetchUserDomains} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Domains Grid */}
      {domains.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No domains found
            </h3>
            <p className="text-gray-600">
              You haven't registered any domains yet. Start by searching for your perfect domain!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map((domain) => (
            <Card key={domain.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-blue-600">
                      {domain.name}
                    </CardTitle>
                    <p className="text-gray-600">{domain.extension}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={domain.isListed ? "default" : "secondary"}>
                      {domain.isListed ? 'Listed' : 'Owned'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Domain Info */}
                <div className="space-y-2 text-sm">
                  {domain.resolvedAddress && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Resolves to:</span>
                      <button 
                        onClick={() => handleCopyAddress(domain.resolvedAddress!)}
                        className="flex items-center text-blue-600 hover:text-blue-700"
                      >
                        <span>{formatAddress(domain.resolvedAddress)}</span>
                        <Copy className="h-3 w-3 ml-1" />
                      </button>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Registered:</span>
                    <span>{formatTimeAgo(domain.mintedAt)}</span>
                  </div>
                  
                  {domain.timesSold > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Sales:</span>
                      <span>{domain.timesSold}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedDomain(domain)}
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Manage
                  </Button>
                  
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/marketplace/${domain.fullName}`} target="_blank">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Domain Management Modal */}
      {selectedDomain && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Manage {selectedDomain.fullName}</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedDomain(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Current Resolution */}
              <div>
                <h3 className="font-medium mb-3 flex items-center">
                  <Wallet className="h-4 w-4 mr-2" />
                  Domain Resolution
                </h3>
                
                {selectedDomain.resolvedAddress ? (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Currently resolves to:</p>
                    <div className="flex items-center justify-between">
                      <code className="text-sm">{selectedDomain.resolvedAddress}</code>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleCopyAddress(selectedDomain.resolvedAddress!)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    No resolution set. Set an address to make this domain point to a wallet.
                  </p>
                )}
              </div>

              {/* Update Resolution */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Update Resolution Address
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="0x..."
                    value={resolveAddress}
                    onChange={(e) => setResolveAddress(e.target.value)}
                    className="font-mono text-sm"
                  />
                  <Button 
                    onClick={updateResolution}
                    disabled={!resolveAddress || isUpdating}
                    size="sm"
                  >
                    {isUpdating ? 'Updating...' : 'Update'}
                  </Button>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Set the wallet address this domain should resolve to
                </p>
              </div>

              {/* Marketplace Actions */}
              <div className="border-t pt-4">
                <h3 className="font-medium mb-3 flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Marketplace
                </h3>
                
                {selectedDomain.isListed ? (
                  <div className="space-y-2">
                    <p className="text-sm text-green-600 bg-green-50 p-2 rounded">
                      This domain is listed for sale at {selectedDomain.price} ETH
                    </p>
                    <Button variant="outline" className="w-full">
                      Remove from Sale
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      List this domain on the marketplace
                    </p>
                    <div className="flex gap-2">
                      <Input placeholder="Price in ETH" />
                      <Button size="sm">List for Sale</Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Domain History */}
              <div className="border-t pt-4">
                <h3 className="font-medium mb-3 flex items-center">
                  <History className="h-4 w-4 mr-2" />
                  Transaction History
                </h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  <div className="text-sm bg-gray-50 p-2 rounded">
                    <div className="flex justify-between">
                      <span>Registered</span>
                      <span className="text-gray-600">{formatTimeAgo(selectedDomain.mintedAt)}</span>
                    </div>
                  </div>
                  {/* Add more transaction history items here */}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}