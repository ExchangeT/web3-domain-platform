// src/components/profile/UserProfile.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useWeb3 } from '@/providers/Web3Provider';
import { 
  User,
  Edit3,
  Save,
  X,
  Globe,
  Calendar,
  MapPin,
  Mail,
  Twitter,
  Github,
  ExternalLink,
  Copy,
  Settings,
  Eye,
  Heart,
  DollarSign,
  TrendingUp,
  Award,
  Shield,
  Clock,
  Star,
  Zap,
  Camera,
  Link as LinkIcon,
  Activity,
  Wallet,
  BarChart3,
  PieChart,
  RefreshCw
} from 'lucide-react';

interface UserProfile {
  address: string;
  ensName?: string;
  displayName: string;
  email: string;
  bio: string;
  location: string;
  website: string;
  twitter: string;
  github: string;
  avatar: string;
  joinedAt: string;
  isVerified: boolean;
  level: number;
  reputation: number;
  badges: string[];
}

interface UserDomain {
  id: string;
  name: string;
  extension: string;
  fullName: string;
  isListed: boolean;
  price?: string;
  views: number;
  likes: number;
  mintedAt: string;
  lastSalePrice?: string;
  timesSold: number;
  category: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
}

interface UserTransaction {
  id: string;
  type: 'BUY' | 'SELL' | 'MINT' | 'TRANSFER' | 'LIST' | 'UNLIST';
  domainName: string;
  price?: string;
  from?: string;
  to?: string;
  timestamp: string;
  txHash: string;
  status: 'completed' | 'pending' | 'failed';
}

interface UserStats {
  totalDomains: number;
  totalValue: string;
  totalSales: number;
  totalRevenue: string;
  averageHoldTime: string;
  mostExpensiveSale: string;
  favoriteExtension: string;
  profileViews: number;
}

export default function UserProfile({ userAddress }: { userAddress?: string }) {
  const { address } = useWeb3();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [domains, setDomains] = useState<UserDomain[]>([]);
  const [transactions, setTransactions] = useState<UserTransaction[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});
  const [activeTab, setActiveTab] = useState('overview');

  const isOwnProfile = !userAddress || userAddress === address;
  const profileAddress = userAddress || address;

  useEffect(() => {
    if (profileAddress) {
      loadUserProfile();
    }
  }, [profileAddress]);

  const loadUserProfile = async () => {
    setLoading(true);
    try {
      // Simulate API calls - replace with real API
      const mockProfile: UserProfile = {
        address: profileAddress!,
        ensName: 'alice.eth',
        displayName: 'Alice Cooper',
        email: 'alice@example.com',
        bio: 'Web3 enthusiast, domain collector, and blockchain developer. Building the future of decentralized identity.',
        location: 'San Francisco, CA',
        website: 'https://alice.web3',
        twitter: '@alice_web3',
        github: 'alice-web3',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
        joinedAt: '2024-03-15T10:30:00Z',
        isVerified: true,
        level: 12,
        reputation: 850,
        badges: ['Early Adopter', 'Premium Collector', 'Verified User', 'Top Trader']
      };

      const mockDomains: UserDomain[] = [
        {
          id: '1',
          name: 'alice',
          extension: 'web3',
          fullName: 'alice.web3',
          isListed: false,
          views: 245,
          likes: 32,
          mintedAt: '2024-09-15T10:30:00Z',
          timesSold: 0,
          category: 'Personal',
          rarity: 'rare'
        },
        {
          id: '2',
          name: 'crypto',
          extension: 'dao',
          fullName: 'crypto.dao',
          isListed: true,
          price: '5.0',
          views: 189,
          likes: 28,
          mintedAt: '2024-09-10T14:20:00Z',
          lastSalePrice: '2.5',
          timesSold: 3,
          category: 'Finance',
          rarity: 'epic'
        },
        {
          id: '3',
          name: 'premium',
          extension: 'tech',
          fullName: 'premium.tech',
          isListed: false,
          views: 156,
          likes: 45,
          mintedAt: '2024-08-20T09:15:00Z',
          timesSold: 1,
          category: 'Technology',
          rarity: 'legendary'
        }
      ];

      const mockTransactions: UserTransaction[] = [
        {
          id: '1',
          type: 'MINT',
          domainName: 'alice.web3',
          price: '0.05',
          to: profileAddress!,
          timestamp: '2024-09-15T10:30:00Z',
          txHash: '0x123...abc',
          status: 'completed'
        },
        {
          id: '2',
          type: 'BUY',
          domainName: 'crypto.dao',
          price: '2.5',
          from: '0x456...def',
          to: profileAddress!,
          timestamp: '2024-09-10T14:20:00Z',
          txHash: '0x456...def',
          status: 'completed'
        },
        {
          id: '3',
          type: 'LIST',
          domainName: 'crypto.dao',
          price: '5.0',
          timestamp: '2024-09-12T16:45:00Z',
          txHash: '0x789...ghi',
          status: 'completed'
        }
      ];

      const mockStats: UserStats = {
        totalDomains: 3,
        totalValue: '12.5',
        totalSales: 2,
        totalRevenue: '3.2',
        averageHoldTime: '45 days',
        mostExpensiveSale: '2.5 ETH',
        favoriteExtension: '.web3',
        profileViews: 1240
      };

      setProfile(mockProfile);
      setDomains(mockDomains);
      setTransactions(mockTransactions);
      setStats(mockStats);
      setEditedProfile(mockProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfile({ ...profile, ...editedProfile });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 30) return `${diffInDays} days ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 'epic': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'rare': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'BUY': return <DollarSign className="h-4 w-4 text-green-600" />;
      case 'SELL': return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'MINT': return <Zap className="h-4 w-4 text-purple-600" />;
      case 'TRANSFER': return <LinkIcon className="h-4 w-4 text-gray-600" />;
      case 'LIST': return <Eye className="h-4 w-4 text-orange-600" />;
      case 'UNLIST': return <X className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  if (!profileAddress) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="text-center py-16">
            <Wallet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect Your Wallet</h3>
            <p className="text-gray-600">Please connect your wallet to view your profile</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center py-16">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="text-center py-16">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h3>
            <p className="text-gray-600">This user profile could not be found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center lg:items-start">
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={profile.avatar} alt={profile.displayName} />
                  <AvatarFallback className="text-2xl">
                    {profile.displayName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {isOwnProfile && (
                  <Button
                    size="sm"
                    className="absolute bottom-0 right-0 rounded-full p-2"
                    onClick={() => {/* Handle avatar upload */}}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="text-center lg:text-left mt-4">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold text-gray-900">{profile.displayName}</h1>
                  {profile.isVerified && (
                    <Shield className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <p className="text-gray-600">{profile.ensName || formatAddress(profile.address)}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Joined {formatTimeAgo(profile.joinedAt)}
                  </span>
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {stats?.profileViews} views
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="flex-1 space-y-6">
              {/* Level and Reputation */}
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">Level {profile.level}</div>
                  <div className="text-sm text-gray-600">Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{profile.reputation}</div>
                  <div className="text-sm text-gray-600">Reputation</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats?.totalDomains}</div>
                  <div className="text-sm text-gray-600">Domains</div>
                </div>
              </div>

              {/* Bio */}
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                      rows={3}
                      value={editedProfile.bio || ''}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                      <Input
                        value={editedProfile.displayName || ''}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, displayName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <Input
                        type="email"
                        value={editedProfile.email || ''}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <Input
                        value={editedProfile.location || ''}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                      <Input
                        value={editedProfile.website || ''}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, website: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                      <Input
                        value={editedProfile.twitter || ''}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, twitter: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                      <Input
                        value={editedProfile.github || ''}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, github: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Button onClick={handleSaveProfile}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-700">{profile.bio}</p>
                  
                  {/* Contact Info */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    {profile.location && (
                      <span className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {profile.location}
                      </span>
                    )}
                    {profile.email && (
                      <a href={`mailto:${profile.email}`} className="flex items-center text-blue-600 hover:text-blue-700">
                        <Mail className="h-4 w-4 mr-1" />
                        {profile.email}
                      </a>
                    )}
                    {profile.website && (
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-700">
                        <Globe className="h-4 w-4 mr-1" />
                        Website
                      </a>
                    )}
                    {profile.twitter && (
                      <a href={`https://twitter.com/${profile.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-700">
                        <Twitter className="h-4 w-4 mr-1" />
                        {profile.twitter}
                      </a>
                    )}
                    {profile.github && (
                      <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-700">
                        <Github className="h-4 w-4 mr-1" />
                        {profile.github}
                      </a>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    {profile.badges.map((badge, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center">
                        <Award className="h-3 w-3 mr-1" />
                        {badge}
                      </Badge>
                    ))}
                  </div>

                  {isOwnProfile && (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="domains">Domains ({domains.length})</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Globe className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Value</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalValue} ETH</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Sales</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalSales}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalRevenue} ETH</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg. Hold Time</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.averageHoldTime}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Domains */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Domains</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {domains.slice(0, 6).map((domain) => (
                  <Card key={domain.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{domain.fullName}</h4>
                        {domain.rarity && (
                          <Badge className={getRarityColor(domain.rarity)}>
                            {domain.rarity}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{domain.category}</span>
                        {domain.isListed && (
                          <span className="text-green-600 font-medium">{domain.price} ETH</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-3 mt-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {domain.views}
                        </span>
                        <span className="flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          {domain.likes}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Domains Tab */}
        <TabsContent value="domains" className="space-y-4">
          {domains.map((domain) => (
            <Card key={domain.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{domain.fullName}</h3>
                      <Badge variant="secondary">.{domain.extension}</Badge>
                      {domain.isListed && (
                        <Badge className="bg-green-100 text-green-800">
                          For Sale - {domain.price} ETH
                        </Badge>
                      )}
                      {domain.rarity && (
                        <Badge className={getRarityColor(domain.rarity)}>
                          {domain.rarity}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <span>{domain.category}</span>
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {domain.views} views
                      </span>
                      <span className="flex items-center">
                        <Heart className="h-3 w-3 mr-1" />
                        {domain.likes} likes
                      </span>
                      <span>Registered {formatTimeAgo(domain.mintedAt)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    {isOwnProfile && (
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Manage
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-gray-100">
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div>
                        <p className="font-medium">{tx.domainName}</p>
                        <p className="text-sm text-gray-600">
                          {tx.type.toLowerCase()} {tx.price && `for ${tx.price} ETH`}
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
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Portfolio Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Portfolio Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Portfolio Value</span>
                    <span className="font-bold text-lg">{stats?.totalValue} ETH</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Most Expensive Sale</span>
                    <span className="font-medium text-green-600">{stats?.mostExpensiveSale}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Favorite Extension</span>
                    <span className="font-medium">{stats?.favoriteExtension}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Hold Time</span>
                    <span className="font-medium">{stats?.averageHoldTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Domain Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Domain Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Personal', 'Finance', 'Technology', 'Gaming'].map((category, index) => {
                    const count = domains.filter(d => d.category === category).length;
                    const percentage = Math.round((count / domains.length) * 100);
                    
                    return (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">{category}</span>
                          <span className="font-medium">{count} domains ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              index === 0 ? 'bg-blue-500' :
                              index === 1 ? 'bg-green-500' :
                              index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Trading Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Trading Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{stats?.totalSales}</div>
                      <div className="text-sm text-gray-600">Total Sales</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{domains.filter(d => d.isListed).length}</div>
                      <div className="text-sm text-gray-600">Currently Listed</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Revenue</span>
                      <span className="font-bold text-green-600">{stats?.totalRevenue} ETH</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Domains Sold</span>
                      <span className="font-medium">{domains.filter(d => d.timesSold > 0).length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Success Rate</span>
                      <span className="font-medium">
                        {Math.round((stats?.totalSales! / domains.length) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.slice(0, 5).map((tx, index) => (
                    <div key={tx.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {tx.type === 'MINT' && `Registered ${tx.domainName}`}
                          {tx.type === 'BUY' && `Purchased ${tx.domainName}`}
                          {tx.type === 'SELL' && `Sold ${tx.domainName}`}
                          {tx.type === 'LIST' && `Listed ${tx.domainName} for sale`}
                          {tx.type === 'UNLIST' && `Unlisted ${tx.domainName}`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {tx.price && `${tx.price} ETH • `}{formatTimeAgo(tx.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Achievement Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Achievements & Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {profile.badges.map((badge, index) => (
                  <div key={index} className="p-4 border rounded-lg text-center hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-medium text-gray-900">{badge}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {badge === 'Early Adopter' && 'One of the first 1000 users'}
                      {badge === 'Premium Collector' && 'Owns 5+ premium domains'}
                      {badge === 'Verified User' && 'Profile verified by community'}
                      {badge === 'Top Trader' && 'High trading volume this month'}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}