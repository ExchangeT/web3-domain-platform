// src/components/domain/DomainManagement.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useWeb3 } from '@/providers/Web3Provider';
import { 
  Settings, 
  ExternalLink, 
  Copy, 
  Globe, 
  Wallet,
  History,
  Shield,
  RefreshCw,
  DollarSign,
  Edit,
  Save,
  X,
  Plus,
  Eye,
  Link as LinkIcon,
  Mail,
  Twitter,
  Github,
  Calendar,
  TrendingUp
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
  lastSalePrice?: string;
  textRecords?: {
    email?: string;
    url?: string;
    avatar?: string;
    description?: string;
    twitter?: string;
    github?: string;
  };
}

interface Transaction {
  id: string;
  type: 'MINT' | 'TRANSFER' | 'SALE' | 'RESOLUTION_UPDATE';
  domainName: string;
  from?: string;
  to: string;
  price?: string;
  timestamp: string;
  txHash: string;
}

export default function DomainManagement() {
  const { address } = useWeb3();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [editingResolution, setEditingResolution] = useState(false);
  const [editingTextRecords, setEditingTextRecords] = useState(false);
  const [newResolution, setNewResolution] = useState('');
  const [textRecords, setTextRecords] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'overview' | 'domains' | 'transactions' | 'settings'>('overview');

  // Load user domains and transactions
  useEffect(() => {
    if (address) {
      loadUserData();
    }
  }, [address]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Simulate API calls - replace with real API
      const mockDomains: Domain[] = [
        {
          id: '1',
          name: 'alice',
          extension: 'web3',
          fullName: 'alice.web3',
          currentOwner: address!,
          resolvedAddress: address,
          isListed: false,
          mintedAt: '2024-09-15T10:30:00Z',
          timesSold: 0,
          textRecords: {
            email: 'alice@example.com',
            url: 'https://alice.com',
            description: 'Web3 enthusiast and developer',
            twitter: '@alice_web3'
          }
        },
        {
          id: '2',
          name: 'crypto',
          extension: 'dao',
          fullName: 'crypto.dao',
          currentOwner: address!,
          isListed: true,
          price: '5.0',
          lastSalePrice: '2.5',
          mintedAt: '2024-09-10T14:20:00Z',
          timesSold: 2,
          textRecords: {
            url: 'https://crypto-dao.org',
            description: 'Decentralized autonomous organization'
          }
        }
      ];

      const mockTransactions: Transaction[] = [
        {
          id: '1',
          type: 'MINT',
          domainName: 'alice.web3',
          to: address!,
          price: '0.05',
          timestamp: '2024-09-15T10:30:00Z',
          txHash: '0x123...abc'
        },
        {
          id: '2',
          type: 'RESOLUTION_UPDATE',
          domainName: 'alice.web3',
          to: address!,
          timestamp: '2024-09-16T15:45:00Z',
          txHash: '0x456...def'
        }
      ];

      setDomains(mockDomains);
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load your domains');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateResolution = async () => {
    if (!selectedDomain || !newResolution.trim()) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDomains(prev => prev.map(domain => 
        domain.id === selectedDomain.id 
          ? { ...domain, resolvedAddress: newResolution }
          : domain
      ));

      toast.success(`${selectedDomain.fullName} now resolves to ${newResolution.slice(0, 6)}...${newResolution.slice(-4)}`);
      setEditingResolution(false);
      setNewResolution('');
    } catch (error) {
      toast.error('Failed to update resolution');
    }
  };

  const handleUpdateTextRecords = async () => {
    if (!selectedDomain) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDomains(prev => prev.map(domain => 
        domain.id === selectedDomain.id 
          ? { ...domain, textRecords: textRecords }
          : domain
      ));

      toast.success('Text records updated successfully');
      setEditingTextRecords(false);
    } catch (error) {
      toast.error('Failed to update text records');
    }
  };

  const handleListForSale = async (domainId: string, price: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDomains(prev => prev.map(domain => 
        domain.id === domainId 
          ? { ...domain, isListed: true, price }
          : domain
      ));

      toast.success('Domain listed for sale!');
    } catch (error) {
      toast.error('Failed to list domain');
    }
  };

  const handleUnlist = async (domainId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setDomains(prev => prev.map(domain => 
        domain.id === domainId 
          ? { ...domain, isListed: false, price: undefined }
          : domain
      ));

      toast.success('Domain unlisted successfully');
    } catch (error) {
      toast.error('Failed to unlist domain');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  if (!address) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="text-center py-16">
            <Wallet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect Your Wallet</h3>
            <p className="text-gray-600">Please connect your wallet to manage your domains</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center py-16">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Domain Portfolio</h1>
          <p className="text-gray-600 mt-1">Manage your Web3 domains and settings</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-lg px-3 py-1">
            {domains.length} Domains
          </Badge>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {domains.filter(d => d.isListed).length} Listed
          </Badge>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'domains', label: 'My Domains', icon: Globe },
            { id: 'transactions', label: 'Transactions', icon: History },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'domains' | 'transactions' | 'settings')}
                className={`flex items-center space-x-2 pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Globe className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Domains</p>
                  <p className="text-2xl font-bold text-gray-900">{domains.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Listed for Sale</p>
                  <p className="text-2xl font-bold text-gray-900">{domains.filter(d => d.isListed).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Sales</p>
                  <p className="text-2xl font-bold text-gray-900">{domains.reduce((sum, d) => sum + d.timesSold, 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Domains Tab */}
      {activeTab === 'domains' && (
        <div className="space-y-4">
          {domains.length === 0 ? (
            <Card>
              <CardContent className="text-center py-16">
                <Globe className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Domains Found</h3>
                <p className="text-gray-600 mb-4">You haven&apos;t registered any domains yet.</p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Register Your First Domain
                </Button>
              </CardContent>
            </Card>
          ) : (
            domains.map((domain) => (
              <Card key={domain.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <h3 className="text-xl font-bold text-gray-900">{domain.fullName}</h3>
                        <Badge variant="secondary">.{domain.extension}</Badge>
                        {domain.isListed && (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            For Sale - {domain.price} ETH
                          </Badge>
                        )}
                        {domain.timesSold > 0 && (
                          <Badge variant="outline">{domain.timesSold} sales</Badge>
                        )}
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4" />
                          <span>Owner: {formatAddress(domain.currentOwner)}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(domain.currentOwner)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        {domain.resolvedAddress ? (
                          <div className="flex items-center space-x-2">
                            <LinkIcon className="h-4 w-4" />
                            <span>Resolves to: {formatAddress(domain.resolvedAddress)}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(domain.resolvedAddress!)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 text-amber-600">
                            <Shield className="h-4 w-4" />
                            <span>Not resolved - Click manage to set</span>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Registered {formatTimeAgo(domain.mintedAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedDomain(domain);
                          setTextRecords(domain.textRecords || {});
                          setNewResolution(domain.resolvedAddress || '');
                        }}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Manage
                      </Button>
                      
                      {domain.isListed ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnlist(domain.id)}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Unlist
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const price = prompt('Enter price in ETH:');
                            if (price) handleListForSale(domain.id, price);
                          }}
                        >
                          <DollarSign className="h-4 w-4 mr-2" />
                          List for Sale
                        </Button>
                      )}
                      
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View on Explorer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      tx.type === 'MINT' ? 'bg-green-100 text-green-600' :
                      tx.type === 'SALE' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {tx.type === 'MINT' && <Plus className="h-4 w-4" />}
                      {tx.type === 'SALE' && <DollarSign className="h-4 w-4" />}
                      {tx.type === 'RESOLUTION_UPDATE' && <LinkIcon className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium">{tx.domainName}</p>
                      <p className="text-sm text-gray-600">
                        {tx.type === 'MINT' && 'Domain registered'}
                        {tx.type === 'SALE' && `Sold for ${tx.price} ETH`}
                        {tx.type === 'RESOLUTION_UPDATE' && 'Resolution updated'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{formatTimeAgo(tx.timestamp)}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(tx.txHash)}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Domain Management Modal */}
      {selectedDomain && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Manage {selectedDomain.fullName}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDomain(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Resolution Settings */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Domain Resolution</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingResolution(!editingResolution)}
                  >
                    <Edit className="h-3 w-3 mr-2" />
                    {editingResolution ? 'Cancel' : 'Edit'}
                  </Button>
                </div>
                
                {editingResolution ? (
                  <div className="space-y-3">
                    <Input
                      placeholder="0x..."
                      value={newResolution}
                      onChange={(e) => setNewResolution(e.target.value)}
                    />
                    <Button onClick={handleUpdateResolution} className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      Update Resolution
                    </Button>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      {selectedDomain.resolvedAddress 
                        ? `Resolves to: ${formatAddress(selectedDomain.resolvedAddress)}`
                        : 'No resolution set'
                      }
                    </p>
                  </div>
                )}
              </div>

              {/* Text Records */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Text Records</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingTextRecords(!editingTextRecords)}
                  >
                    <Edit className="h-3 w-3 mr-2" />
                    {editingTextRecords ? 'Cancel' : 'Edit'}
                  </Button>
                </div>
                
                {editingTextRecords ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <Mail className="h-4 w-4 inline mr-1" />
                          Email
                        </label>
                        <Input
                          placeholder="alice@example.com"
                          value={textRecords.email || ''}
                          onChange={(e) => setTextRecords(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <Globe className="h-4 w-4 inline mr-1" />
                          Website
                        </label>
                        <Input
                          placeholder="https://alice.com"
                          value={textRecords.url || ''}
                          onChange={(e) => setTextRecords(prev => ({ ...prev, url: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <Twitter className="h-4 w-4 inline mr-1" />
                          Twitter
                        </label>
                        <Input
                          placeholder="@alice"
                          value={textRecords.twitter || ''}
                          onChange={(e) => setTextRecords(prev => ({ ...prev, twitter: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <Github className="h-4 w-4 inline mr-1" />
                          GitHub
                        </label>
                        <Input
                          placeholder="alice"
                          value={textRecords.github || ''}
                          onChange={(e) => setTextRecords(prev => ({ ...prev, github: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <Input
                        placeholder="Web3 enthusiast and developer"
                        value={textRecords.description || ''}
                        onChange={(e) => setTextRecords(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                    <Button onClick={handleUpdateTextRecords} className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      Update Text Records
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedDomain.textRecords && Object.entries(selectedDomain.textRecords).map(([key, value]) => (
                      value && (
                        <div key={key} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                          <span className="text-sm font-medium capitalize">{key}:</span>
                          <span className="text-sm text-gray-600">{value}</span>
                        </div>
                      )
                    ))}
                    {(!selectedDomain.textRecords || Object.keys(selectedDomain.textRecords).length === 0) && (
                      <p className="text-sm text-gray-600">No text records set</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}