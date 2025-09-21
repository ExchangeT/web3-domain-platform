// src/components/domain/DomainMarketplace.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  ShoppingCart, 
  Filter, 
  Search, 
  TrendingUp, 
  Clock, 
  Eye,
  Heart,
  ExternalLink,
  Copy,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface MarketplaceDomain {
  id: string;
  name: string;
  extension: string;
  fullName: string;
  price: string;
  seller: string;
  sellerENS?: string;
  listedAt: string;
  views: number;
  likes: number;
  category: string;
  description?: string;
  featured: boolean;
  timesSold: number;
  lastSalePrice?: string;
  trending: boolean;
  length: number;
}

interface MarketplaceFilters {
  search: string;
  extension: string;
  priceRange: string;
  category: string;
  sortBy: string;
}

export default function DomainMarketplace() {
  const [domains, setDomains] = useState<MarketplaceDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());
  
  const [filters, setFilters] = useState<MarketplaceFilters>({
    search: '',
    extension: 'all',
    priceRange: 'all',
    category: 'all',
    sortBy: 'newest'
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'finance', label: 'Finance & DeFi' },
    { value: 'gaming', label: 'Gaming & NFT' },
    { value: 'tech', label: 'Technology' },
    { value: 'personal', label: 'Personal' },
    { value: 'business', label: 'Business' },
    { value: 'creative', label: 'Creative & Art' }
  ];

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-0.1', label: 'Under 0.1 ETH' },
    { value: '0.1-0.5', label: '0.1 - 0.5 ETH' },
    { value: '0.5-1', label: '0.5 - 1 ETH' },
    { value: '1-5', label: '1 - 5 ETH' },
    { value: '5+', label: '5+ ETH' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest Listed' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'trending', label: 'Trending' },
    { value: 'ending-soon', label: 'Ending Soon' }
  ];

  useEffect(() => {
    fetchDomains();
  }, [filters]);

  const fetchDomains = async () => {
    try {
      setLoading(true);
      
      // Call your API endpoint
      const response = await fetch('/api/marketplace/domains', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters),
      });

      if (response.ok) {
        const data = await response.json();
        setDomains(data.domains || []);
      } else {
        throw new Error('Failed to fetch domains');
      }
    } catch (error) {
      console.error('Error fetching domains:', error);
      toast.error('Failed to load marketplace domains');
      
      // Fallback mock data for development
      const mockDomains: MarketplaceDomain[] = [
        {
          id: '1',
          name: 'crypto',
          extension: 'web3',
          fullName: 'crypto.web3',
          price: '2.5',
          seller: '0x1234...5678',
          sellerENS: 'alice.eth',
          listedAt: '2024-09-10T10:00:00Z',
          views: 156,
          likes: 23,
          category: 'finance',
          description: 'Perfect domain for crypto projects',
          featured: true,
          timesSold: 2,
          lastSalePrice: '1.8',
          trending: true,
          length: 6
        },
        {
          id: '2',
          name: 'game',
          extension: 'dao',
          fullName: 'game.dao',
          price: '0.8',
          seller: '0x9876...4321',
          listedAt: '2024-09-09T15:30:00Z',
          views: 89,
          likes: 12,
          category: 'gaming',
          featured: false,
          timesSold: 0,
          trending: false,
          length: 4
        }
      ];
      setDomains(mockDomains);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (domain: MarketplaceDomain) => {
    setPurchasing(domain.id);
    
    try {
      const response = await fetch('/api/marketplace/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domainId: domain.id,
          price: domain.price,
        }),
      });

      if (response.ok) {
        toast.success(`Successfully purchased ${domain.fullName}!`);
        fetchDomains(); // Refresh the list
      } else {
        throw new Error('Purchase failed');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Failed to purchase domain. Please try again.');
    } finally {
      setPurchasing(null);
    }
  };

  const toggleWatchlist = (domainId: string) => {
    setWatchlist(prev => {
      const newSet = new Set(prev);
      if (newSet.has(domainId)) {
        newSet.delete(domainId);
        toast.success('Removed from watchlist');
      } else {
        newSet.add(domainId);
        toast.success('Added to watchlist');
      }
      return newSet;
    });
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success('Address copied to clipboard');
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

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Domain Marketplace
        </h1>
        <p className="text-gray-600 text-lg">
          Discover and purchase premium Web3 domains
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search domains..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>

            {/* Extension Filter */}
            <Select value={filters.extension} onValueChange={(value) => setFilters(prev => ({ ...prev, extension: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Extension" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Extensions</SelectItem>
                <SelectItem value="web3">.web3</SelectItem>
                <SelectItem value="dao">.dao</SelectItem>
                <SelectItem value="defi">.defi</SelectItem>
                <SelectItem value="nft">.nft</SelectItem>
                <SelectItem value="crypto">.crypto</SelectItem>
              </SelectContent>
            </Select>

            {/* Price Range */}
            <Select value={filters.priceRange} onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map(range => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Category */}
            <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map((domain) => (
            <Card key={domain.id} className={`hover:shadow-lg transition-shadow ${domain.featured ? 'ring-2 ring-purple-200' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-blue-600 flex items-center">
                      {domain.name}
                      <span className="text-gray-500">.{domain.extension}</span>
                      {domain.length <= 3 && (
                        <Sparkles className="h-4 w-4 ml-2 text-yellow-500" />
                      )}
                    </CardTitle>
                    {domain.description && (
                      <p className="text-sm text-gray-600 mt-1">{domain.description}</p>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {domain.featured && (
                      <Badge variant="secondary" className="text-xs">Featured</Badge>
                    )}
                    {domain.trending && (
                      <Badge variant="outline" className="text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Price and Stats */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-green-600">{domain.price} ETH</p>
                    {domain.lastSalePrice && (
                      <p className="text-xs text-gray-600">
                        Last sold: {domain.lastSalePrice} ETH
                      </p>
                    )}
                  </div>
                  
                  <div className="text-right text-sm text-gray-600">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {domain.views}
                    </div>
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      {domain.likes}
                    </div>
                  </div>
                </div>

                {/* Seller Info */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Seller:</span>
                  <button 
                    onClick={() => handleCopyAddress(domain.seller)}
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <span>{domain.sellerENS || formatAddress(domain.seller)}</span>
                    <Copy className="h-3 w-3 ml-1" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Listed:</span>
                  <span>{formatTimeAgo(domain.listedAt)}</span>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleWatchlist(domain.id)}
                    className={watchlist.has(domain.id) ? 'text-red-600' : ''}
                  >
                    <Heart className={`h-4 w-4 ${watchlist.has(domain.id) ? 'fill-current' : ''}`} />
                  </Button>
                  
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/domain/${domain.fullName}`} target="_blank">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  
                  <Button
                    onClick={() => handlePurchase(domain)}
                    disabled={purchasing === domain.id}
                    size="sm"
                    className="col-span-1"
                  >
                    {purchasing === domain.id ? (
                      <Clock className="h-4 w-4 animate-spin" />
                    ) : (
                      <ShoppingCart className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && domains.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No domains found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or search terms to find more domains.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}