// src/components/marketplace/DomainMarketplace.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useWeb3 } from '@/providers/Web3Provider';
import { 
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Heart,
  Eye,
  Clock,
  TrendingUp,
  ShoppingCart,
  Star,
  Zap,
  Globe,
  Calendar,
  User,
  ExternalLink,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  DollarSign
} from 'lucide-react';

interface MarketplaceDomain {
  id: string;
  name: string;
  extension: string;
  fullName: string;
  price: string;
  priceUSD: string;
  owner: string;
  ownerENS?: string;
  listedAt: string;
  views: number;
  likes: number;
  isLiked: boolean;
  isPremium: boolean;
  lastSalePrice?: string;
  timesSold: number;
  category: string;
  length: number;
  textRecords?: {
    description?: string;
    url?: string;
    twitter?: string;
  };
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
}

interface MarketplaceFilters {
  search: string;
  extension: string;
  minPrice: string;
  maxPrice: string;
  category: string;
  sortBy: 'price_asc' | 'price_desc' | 'newest' | 'oldest' | 'popular' | 'length';
  length: string;
}

export default function DomainMarketplace() {
  const { address } = useWeb3();
  const [domains, setDomains] = useState<MarketplaceDomain[]>([]);
  const [filteredDomains, setFilteredDomains] = useState<MarketplaceDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<MarketplaceFilters>({
    search: '',
    extension: 'all',
    minPrice: '',
    maxPrice: '',
    category: 'all',
    sortBy: 'newest',
    length: 'all'
  });

  const itemsPerPage = 12;

  // Load marketplace domains
  useEffect(() => {
    loadMarketplaceDomains();
  }, []);

  // Apply filters and pagination
  useEffect(() => {
    applyFilters();
  }, [domains, filters, currentPage]);

  const loadMarketplaceDomains = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with real marketplace API
      const mockDomains: MarketplaceDomain[] = [
        {
          id: '1',
          name: 'crypto',
          extension: 'web3',
          fullName: 'crypto.web3',
          price: '5.0',
          priceUSD: '12,500',
          owner: '0x742d35Cc6631C0532925a3b8D4c0dEa2',
          ownerENS: 'alice.eth',
          listedAt: '2024-09-20T10:30:00Z',
          views: 245,
          likes: 12,
          isLiked: false,
          isPremium: true,
          lastSalePrice: '2.5',
          timesSold: 3,
          category: 'Finance',
          length: 6,
          textRecords: {
            description: 'Premium crypto domain',
            url: 'https://crypto.web3',
            twitter: '@crypto'
          },
          rarity: 'epic'
        },
        {
          id: '2',
          name: 'nft',
          extension: 'dao',
          fullName: 'nft.dao',
          price: '8.5',
          priceUSD: '21,250',
          owner: '0x123d35Cc6631C0532925a3b8D4c0dEa1',
          listedAt: '2024-09-19T15:45:00Z',
          views: 189,
          likes: 8,
          isLiked: true,
          isPremium: true,
          timesSold: 1,
          category: 'Art',
          length: 3,
          textRecords: {
            description: 'NFT marketplace domain'
          },
          rarity: 'legendary'
        },
        {
          id: '3',
          name: 'gaming',
          extension: 'web3',
          fullName: 'gaming.web3',
          price: '3.2',
          priceUSD: '8,000',
          owner: '0x456d35Cc6631C0532925a3b8D4c0dEa3',
          ownerENS: 'gamer.eth',
          listedAt: '2024-09-18T09:20:00Z',
          views: 156,
          likes: 15,
          isLiked: false,
          isPremium: false,
          timesSold: 0,
          category: 'Gaming',
          length: 6,
          rarity: 'rare'
        },
        {
          id: '4',
          name: 'ai',
          extension: 'tech',
          fullName: 'ai.tech',
          price: '12.0',
          priceUSD: '30,000',
          owner: '0x789d35Cc6631C0532925a3b8D4c0dEa4',
          listedAt: '2024-09-17T14:30:00Z',
          views: 320,
          likes: 25,
          isLiked: true,
          isPremium: true,
          lastSalePrice: '8.0',
          timesSold: 2,
          category: 'Technology',
          length: 2,
          textRecords: {
            description: 'Artificial Intelligence domain',
            url: 'https://ai.tech'
          },
          rarity: 'legendary'
        },
        {
          id: '5',
          name: 'defi',
          extension: 'finance',
          fullName: 'defi.finance',
          price: '6.8',
          priceUSD: '17,000',
          owner: '0xabcd35Cc6631C0532925a3b8D4c0dEa5',
          listedAt: '2024-09-16T11:15:00Z',
          views: 203,
          likes: 18,
          isLiked: false,
          isPremium: true,
          timesSold: 4,
          category: 'Finance',
          length: 4,
          rarity: 'epic'
        }
      ];

      setDomains(mockDomains);
    } catch (error) {
      console.error('Error loading marketplace:', error);
      toast.error('Failed to load marketplace');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...domains];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(domain =>
        domain.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
        domain.category.toLowerCase().includes(filters.search.toLowerCase()) ||
        domain.textRecords?.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Extension filter
    if (filters.extension !== 'all') {
      filtered = filtered.filter(domain => domain.extension === filters.extension);
    }

    // Price filters
    if (filters.minPrice) {
      filtered = filtered.filter(domain => parseFloat(domain.price) >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(domain => parseFloat(domain.price) <= parseFloat(filters.maxPrice));
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(domain => domain.category === filters.category);
    }

    // Length filter
    if (filters.length !== 'all') {
      const lengthNum = parseInt(filters.length);
      if (lengthNum === 3) {
        filtered = filtered.filter(domain => domain.length <= 3);
      } else if (lengthNum === 4) {
        filtered = filtered.filter(domain => domain.length === 4);
      } else if (lengthNum === 5) {
        filtered = filtered.filter(domain => domain.length >= 5);
      }
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_asc':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price_desc':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'newest':
          return new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime();
        case 'oldest':
          return new Date(a.listedAt).getTime() - new Date(b.listedAt).getTime();
        case 'popular':
          return b.views - a.views;
        case 'length':
          return a.length - b.length;
        default:
          return 0;
      }
    });

    // Pagination
    const totalItems = filtered.length;
    const pages = Math.ceil(totalItems / itemsPerPage);
    setTotalPages(pages);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedDomains = filtered.slice(startIndex, endIndex);

    setFilteredDomains(paginatedDomains);
  };

  const handlePurchase = async (domainId: string) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    const domain = domains.find(d => d.id === domainId);
    if (!domain) return;

    setPurchasing(domainId);
    try {
      // Simulate purchase transaction
      toast.loading(`Purchasing ${domain.fullName}...`);
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Remove from marketplace
      setDomains(prev => prev.filter(d => d.id !== domainId));
      
      toast.success(`Successfully purchased ${domain.fullName} for ${domain.price} ETH!`);
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Purchase failed. Please try again.');
    } finally {
      setPurchasing(null);
    }
  };

  const handleLike = async (domainId: string) => {
    if (!address) {
      toast.error('Please connect your wallet to like domains');
      return;
    }

    setDomains(prev => prev.map(domain =>
      domain.id === domainId
        ? {
            ...domain,
            isLiked: !domain.isLiked,
            likes: domain.isLiked ? domain.likes - 1 : domain.likes + 1
          }
        : domain
    ));
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just listed';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 'epic': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'rare': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center py-16">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Domain Marketplace</h1>
          <p className="text-gray-600 mt-1">Discover and purchase premium Web3 domains</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-lg px-3 py-1">
            {domains.length} Listed
          </Badge>
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search domains, categories, or descriptions..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2">
              <Select
                value={filters.extension}
                onValueChange={(value) => setFilters(prev => ({ ...prev, extension: value }))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Extension" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Extensions</SelectItem>
                  <SelectItem value="web3">.web3</SelectItem>
                  <SelectItem value="dao">.dao</SelectItem>
                  <SelectItem value="tech">.tech</SelectItem>
                  <SelectItem value="finance">.finance</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.sortBy}
                onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value as 'price_asc' | 'price_desc' | 'newest' | 'oldest' | 'popular' | 'length' }))}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="length">Shortest First</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (ETH)</label>
                <Input
                  placeholder="0.1"
                  value={filters.minPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (ETH)</label>
                <Input
                  placeholder="100"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Gaming">Gaming</SelectItem>
                    <SelectItem value="Art">Art</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Length</label>
                <Select
                  value={filters.length}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, length: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any Length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Length</SelectItem>
                    <SelectItem value="3">3 characters or less</SelectItem>
                    <SelectItem value="4">4 characters</SelectItem>
                    <SelectItem value="5">5+ characters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Domain Grid/List */}
      {filteredDomains.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No domains found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-4'
        }>
          {filteredDomains.map((domain) => (
            <Card key={domain.id} className={`hover:shadow-lg transition-all duration-200 ${
              viewMode === 'list' ? 'hover:scale-[1.01]' : 'hover:scale-105'
            }`}>
              <CardContent className={viewMode === 'grid' ? 'p-6' : 'p-6'}>
                {viewMode === 'grid' ? (
                  // Grid View
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 truncate">
                          {domain.fullName}
                        </h3>
                        <p className="text-sm text-gray-600">{domain.category}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(domain.id)}
                        className={domain.isLiked ? 'text-red-500' : 'text-gray-400'}
                      >
                        <Heart className={`h-4 w-4 ${domain.isLiked ? 'fill-current' : ''}`} />
                      </Button>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">.{domain.extension}</Badge>
                      {domain.isPremium && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Star className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                      {domain.rarity && (
                        <Badge className={getRarityColor(domain.rarity)}>
                          {domain.rarity}
                        </Badge>
                      )}
                    </div>

                    {/* Description */}
                    {domain.textRecords?.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {domain.textRecords.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {domain.views}
                        </span>
                        <span className="flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          {domain.likes}
                        </span>
                      </div>
                      <span>{formatTimeAgo(domain.listedAt)}</span>
                    </div>

                    {/* Owner */}
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">
                        {domain.ownerENS || formatAddress(domain.owner)}
                      </span>
                    </div>

                    {/* Price and Action */}
                    <div className="space-y-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {domain.price} ETH
                        </div>
                        <div className="text-sm text-gray-600">
                          ~${domain.priceUSD}
                        </div>
                        {domain.lastSalePrice && (
                          <div className="text-xs text-gray-500">
                            Last sold: {domain.lastSalePrice} ETH
                          </div>
                        )}
                      </div>
                      
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => handlePurchase(domain.id)}
                        disabled={purchasing === domain.id}
                      >
                        {purchasing === domain.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <ShoppingCart className="h-4 w-4 mr-2" />
                        )}
                        {purchasing === domain.id ? 'Purchasing...' : 'Buy Now'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  // List View
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="text-lg font-bold text-gray-900">
                            {domain.fullName}
                          </h3>
                          <Badge variant="secondary">.{domain.extension}</Badge>
                          {domain.isPremium && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <Star className="h-3 w-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                          {domain.rarity && (
                            <Badge className={getRarityColor(domain.rarity)}>
                              {domain.rarity}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{domain.category}</span>
                          <span className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {domain.ownerENS || formatAddress(domain.owner)}
                          </span>
                          <span className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            {domain.views} views
                          </span>
                          <span>{formatTimeAgo(domain.listedAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">
                          {domain.price} ETH
                        </div>
                        <div className="text-sm text-gray-600">
                          ~${domain.priceUSD}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(domain.id)}
                          className={domain.isLiked ? 'text-red-500' : 'text-gray-400'}
                        >
                          <Heart className={`h-4 w-4 ${domain.isLiked ? 'fill-current' : ''}`} />
                        </Button>
                        
                        <Button
                          onClick={() => handlePurchase(domain.id)}
                          disabled={purchasing === domain.id}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {purchasing === domain.id ? (
                            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <ShoppingCart className="h-4 w-4 mr-2" />
                          )}
                          {purchasing === domain.id ? 'Purchasing...' : 'Buy Now'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
              if (pageNum > totalPages) return null;
              
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}