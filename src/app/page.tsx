// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  TrendingUp, 
  Globe, 
  Users, 
  Zap,
  ArrowRight,
  Star,
  Clock,
  DollarSign,
  Activity,
  Eye,
  ShoppingCart
} from 'lucide-react';
import { useWeb3 } from '@/providers/Web3Provider';
import { DashboardStats, QuickActions } from '@/components/layout/AppLayout';
import { logger } from '@/lib/logger';


interface TrendingDomain {
  id: string;
  name: string;
  extension: string;
  price: string;
  change: string;
  volume: string;
}

interface RecentActivity {
  id: string;
  type: 'registration' | 'sale' | 'listing';
  domain: string;
  price?: string;
  user: string;
  timestamp: string;
}

interface FeaturedDomain {
  id: string;
  name: string;
  extension: string;
  fullName: string;
  price: string;
  description: string;
  category: string;
  featured: boolean;
}

export default function Homepage() {
  const { isConnected, account } = useWeb3();
  const [searchTerm, setSearchTerm] = useState('');
  const [trendingDomains, setTrendingDomains] = useState<TrendingDomain[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [featuredDomains, setFeaturedDomains] = useState<FeaturedDomain[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Set mock data immediately for development
      setMockData();
      
      // Try to call APIs but don't fail if they're not available
      try {
        const [trendingRes, activityRes, featuredRes] = await Promise.allSettled([
          fetch('/api/domains/trending').catch(() => null),
          fetch('/api/activity/recent').catch(() => null),
          fetch('/api/domains/featured').catch(() => null)
        ]);

        // Handle trending domains
        if (trendingRes.status === 'fulfilled' && trendingRes.value && trendingRes.value.ok) {
          const trendingData = await trendingRes.value.json();
          if (trendingData.domains && Array.isArray(trendingData.domains)) {
            setTrendingDomains(trendingData.domains);
          }
        }

        // Handle recent activity
        if (activityRes.status === 'fulfilled' && activityRes.value && activityRes.value.ok) {
          const activityData = await activityRes.value.json();
          if (activityData.activities && Array.isArray(activityData.activities)) {
            setRecentActivity(activityData.activities);
          }
        }

        // Handle featured domains
        if (featuredRes.status === 'fulfilled' && featuredRes.value && featuredRes.value.ok) {
          const featuredData = await featuredRes.value.json();
          if (featuredData.domains && Array.isArray(featuredData.domains)) {
            setFeaturedDomains(featuredData.domains);
          }
        }
       } catch (apiError) {
         logger.info('API calls failed, using mock data', apiError, 'dashboard');
         // Mock data is already set, so we're good
       }
     } catch (error) {
       logger.error('Error fetching dashboard data', error, 'dashboard');
       setMockData(); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  const setMockData = () => {
    const mockTrending: TrendingDomain[] = [
      { id: '1', name: 'crypto', extension: 'web3', price: '2.5', change: '+15%', volume: '12.3 ETH' },
      { id: '2', name: 'defi', extension: 'dao', price: '1.8', change: '+8%', volume: '8.7 ETH' },
      { id: '3', name: 'nft', extension: 'crypto', price: '3.2', change: '+22%', volume: '15.1 ETH' },
      { id: '4', name: 'meta', extension: 'web3', price: '4.1', change: '+12%', volume: '9.8 ETH' },
      { id: '5', name: 'ai', extension: 'tech', price: '5.0', change: '+35%', volume: '20.5 ETH' }
    ];

    const mockActivity: RecentActivity[] = [
      { id: '1', type: 'registration', domain: 'john.web3', user: '0x1234...5678', timestamp: '2 min ago' },
      { id: '2', type: 'sale', domain: 'crypto.dao', price: '2.5 ETH', user: '0x9876...4321', timestamp: '5 min ago' },
      { id: '3', type: 'listing', domain: 'game.nft', price: '1.2 ETH', user: '0x5555...7777', timestamp: '8 min ago' },
      { id: '4', type: 'registration', domain: 'alice.defi', user: '0x1111...2222', timestamp: '12 min ago' },
      { id: '5', type: 'sale', domain: 'web3.crypto', price: '3.8 ETH', user: '0x3333...4444', timestamp: '15 min ago' }
    ];

    const mockFeatured: FeaturedDomain[] = [
      {
        id: '1',
        name: 'bitcoin',
        extension: 'crypto',
        fullName: 'bitcoin.crypto',
        price: '50.0',
        description: 'Premium cryptocurrency domain perfect for Bitcoin-related projects',
        category: 'finance',
        featured: true
      },
      {
        id: '2',
        name: 'metaverse',
        extension: 'web3',
        fullName: 'metaverse.web3',
        price: '25.0',
        description: 'Ideal for virtual world and metaverse applications',
        category: 'gaming',
        featured: true
      },
      {
        id: '3',
        name: 'exchange',
        extension: 'defi',
        fullName: 'exchange.defi',
        price: '15.0',
        description: 'Perfect for decentralized exchange platforms',
        category: 'finance',
        featured: true
      }
    ];

    setTrendingDomains(mockTrending);
    setRecentActivity(mockActivity);
    setFeaturedDomains(mockFeatured);
  };

  const handleQuickSearch = () => {
    if (searchTerm.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'registration':
        return <Globe className="h-4 w-4 text-green-600" />;
      case 'sale':
        return <DollarSign className="h-4 w-4 text-blue-600" />;
      case 'listing':
        return <ShoppingCart className="h-4 w-4 text-purple-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityText = (activity: RecentActivity) => {
    switch (activity.type) {
      case 'registration':
        return `${activity.domain} was registered`;
      case 'sale':
        return `${activity.domain} sold for ${activity.price}`;
      case 'listing':
        return `${activity.domain} listed for ${activity.price}`;
      default:
        return `Activity on ${activity.domain}`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
          Own Your Web3 Identity
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Register, manage, and trade decentralized domains on the blockchain. 
          Your gateway to the decentralized web starts here.
        </p>

        {/* Quick Search */}
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search for your perfect domain..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleQuickSearch()}
                className="pl-12 h-14 text-lg"
              />
            </div>
            <Button 
              onClick={handleQuickSearch}
              size="lg"
              className="h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Search
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Try: "crypto.web3", "your-name.dao", "project.defi"
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Instant Registration</h3>
            <p className="text-gray-600">Register domains instantly on the blockchain with our streamlined process</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Full Ownership</h3>
            <p className="text-gray-600">True ownership of your domains stored securely on the blockchain</p>
          </div>
          <div className="text-center">
            <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Active Marketplace</h3>
            <p className="text-gray-600">Buy and sell domains in our thriving decentralized marketplace</p>
          </div>
        </div>
      </div>

      {/* Dashboard Stats (only show if connected) */}
      {isConnected && <DashboardStats />}

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trending Domains */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-orange-500" />
              Trending Domains
            </CardTitle>
            <Link href="/marketplace?sort=trending">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trendingDomains.map((domain, index) => (
                <div key={domain.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-600 rounded-full text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{domain.name}.{domain.extension}</p>
                      <p className="text-sm text-gray-600">Volume: {domain.volume}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{domain.price} ETH</p>
                    <p className="text-sm text-green-600">{domain.change}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      {getActivityText(activity)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/activity">
              <Button variant="outline" className="w-full mt-4">
                View All Activity
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Featured Domains */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-500" />
            Featured Premium Domains
          </CardTitle>
          <Link href="/marketplace?featured=true">
            <Button variant="outline" size="sm">
              View All Featured
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredDomains.map((domain) => (
              <div key={domain.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-blue-600">{domain.fullName}</h3>
                  <Badge variant="secondary">Featured</Badge>
                </div>
                <p className="text-gray-600 text-sm mb-4">{domain.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">{domain.price} ETH</span>
                  <Link href={`/marketplace/${domain.fullName}`}>
                    <Button size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      {!isConnected && (
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Connect your wallet to start registering and managing Web3 domains
            </p>
            <div className="space-x-4">
              <Button size="lg" variant="secondary">
                Connect Wallet
              </Button>
              <Link href="/docs">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-purple-600">
                  Learn More
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}