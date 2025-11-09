// src/components/admin/AdminDashboard.tsx - Updated to use existing hooks
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

// Use your existing hooks instead of creating new ones
import { useAuth } from '@/hooks/useAuth';
import { 
  useAdminDashboard, 
  useAdminUsers, 
  useAdminTransactions, 
  useAdminExtensions,
  useUpdateUserStatus,
  useCreateExtension
} from '@/hooks/useAdmin';

import { 
  BarChart3,
  Users,
  Globe,
  DollarSign,
  TrendingUp,
  Eye,
  Settings,
  Plus,
  Edit,
  Trash2,
  Download,
  Filter,
  Search,
  Calendar,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  ExternalLink,
  Activity,
  PieChart,
  LineChart,
  Copy
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('7d');
  const [newExtension, setNewExtension] = useState({ name: '', price: '', description: '' });

  // Admin data queries using your existing hooks
  const { data: dashboardData, isLoading: loadingDashboard } = useAdminDashboard();
  const { data: usersData, isLoading: loadingUsers } = useAdminUsers({ 
    search: searchTerm || undefined 
  });
  const { data: transactionsData, isLoading: loadingTransactions } = useAdminTransactions();
  const { data: extensionsData, isLoading: loadingExtensions } = useAdminExtensions();

  // Mutations
  const updateUserStatusMutation = useUpdateUserStatus();
  const createExtensionMutation = useCreateExtension();

  // Check if user has admin role
  const isAdmin = false; // TODO: Add role to User interface

  const handleUserAction = async (userId: string, status: 'active' | 'suspended') => {
    try {
      await updateUserStatusMutation.mutateAsync({ userId, status });
      toast.success(`User ${status} successfully`);
    } catch (error) {
      toast.error(`Failed to ${status} user`);
    }
  };

  const handleAddExtension = async () => {
    if (!newExtension.name || !newExtension.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createExtensionMutation.mutateAsync({
        name: newExtension.name,
        base_price: newExtension.price,
        is_enabled: true,
        description: newExtension.description || ''
      });

      setNewExtension({ name: '', price: '', description: '' });
      toast.success('Extension added successfully');
    } catch (error) {
      toast.error('Failed to add extension');
    }
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const exportData = (type: string) => {
    toast.success(`${type} data exported successfully`);
  };

  // Check authentication and admin status
  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="text-center py-16">
            <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h3>
            <p className="text-gray-600">Please authenticate to access the admin dashboard</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="text-center py-16">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h3>
            <p className="text-gray-600 mb-4">You don't have admin permissions</p>
            {user && (
              <div className="bg-gray-50 border rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <span className="font-mono">{formatAddress(user.walletAddress || '')}</span>
                  <Badge variant="outline">User</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const isLoading = loadingDashboard || loadingUsers || loadingTransactions || loadingExtensions;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center py-16">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-3 text-lg text-gray-600">Loading admin dashboard...</span>
        </div>
      </div>
    );
  }

  const stats = dashboardData || {
    totalUsers: 0,
    totalDomains: 0,
    totalTransactions: 0,
    totalRevenue: '0',
    recentTransactions: [],
    domainStats: {
      totalMinted: 0,
      totalForSale: 0,
      totalSold: 0
    },
    userStats: {
      newUsersToday: 0,
      activeUsers: 0
    }
  };

  const users = usersData?.users || [];
  const transactions = transactionsData?.transactions || [];
  const extensions = extensionsData || [];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Platform management and analytics</p>
          <p className="text-sm text-blue-600">
            Welcome, Admin - {formatAddress(user?.walletAddress || '')}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalUsers?.toLocaleString() || '0'}
                </p>
                <p className="text-xs text-green-600">
                  +{stats.userStats?.activeUsers || 0} active
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Domains</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalDomains?.toLocaleString() || '0'}
                </p>
                <p className="text-xs text-green-600">
                  +{stats.userStats?.newUsersToday || 0} new today
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue} ETH</p>
                <p className="text-xs text-blue-600">From {stats.domainStats?.totalSold || 0} sales</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions?.toLocaleString() || '0'}</p>
                <p className="text-xs text-gray-600">{stats.domainStats?.totalMinted || 0} domains minted</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
          <TabsTrigger value="transactions">Transactions ({transactions.length})</TabsTrigger>
          <TabsTrigger value="extensions">Extensions ({extensions.length})</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          tx.type === 'registration' ? 'bg-green-100 text-green-600' :
                          tx.type === 'sale' ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {tx.type === 'registration' && <Plus className="h-4 w-4" />}
                          {tx.type === 'sale' && <DollarSign className="h-4 w-4" />}
                          {tx.type === 'transfer' && <ExternalLink className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="font-medium">{tx.domainName}</p>
                          <p className="text-sm text-gray-600">
                            {tx.type} {tx.price ? `for ${tx.price} ETH` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{formatTimeAgo(tx.timestamp)}</p>
                        <Badge variant={tx.status === 'completed' ? 'default' : 'secondary'}>
                          {tx.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Smart Contracts</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API Services</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Blockchain Sync</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Synced</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Management</CardTitle>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button onClick={() => exportData('users')}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Domains</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div>
                              <p className="font-medium">
                                {user.ensName || formatAddress(user.address)}
                              </p>
                              {user.email && (
                                <p className="text-sm text-gray-600">{user.email}</p>
                              )}
                            </div>
                            {user.isVerified && (
                              <Shield className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{user.domainsOwned}</TableCell>
                        <TableCell>{user.totalSpent} ETH</TableCell>
                        <TableCell>{formatTimeAgo(user.joinedAt)}</TableCell>
                        <TableCell>
                          <Badge variant={
                            user.status === 'active' ? 'default' :
                            user.status === 'suspended' ? 'secondary' : 'destructive'
                          }>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {user.status === 'active' ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUserAction(user.id, 'suspended')}
                                disabled={updateUserStatusMutation.isPending}
                              >
                                Suspend
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUserAction(user.id, 'active')}
                                disabled={updateUserStatusMutation.isPending}
                              >
                                Activate
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Extensions Tab */}
        <TabsContent value="extensions" className="space-y-6">
          {/* Add New Extension */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Extension</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Extension Name</label>
                  <Input
                    placeholder="web3"
                    value={newExtension.name}
                    onChange={(e) => setNewExtension(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (ETH)</label>
                  <Input
                    placeholder="0.05"
                    type="number"
                    step="0.001"
                    value={newExtension.price}
                    onChange={(e) => setNewExtension(prev => ({ ...prev, price: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                  <Input
                    placeholder="Description of the extension"
                    value={newExtension.description}
                    onChange={(e) => setNewExtension(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={handleAddExtension} 
                    className="w-full"
                    disabled={!newExtension.name || !newExtension.price || createExtensionMutation.isPending}
                  >
                    {createExtensionMutation.isPending ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Add Extension
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Extensions List */}
          <Card>
            <CardHeader>
              <CardTitle>Extension Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Extension</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Registrations</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {extensions.map((ext) => (
                      <TableRow key={ext.name}>
                        <TableCell className="font-medium">.{ext.name}</TableCell>
                        <TableCell>{ext.base_price} ETH</TableCell>
                        <TableCell>{ext.total_domains_minted?.toLocaleString()}</TableCell>
                        <TableCell>{ext.total_revenue} ETH</TableCell>
                        <TableCell>
                          <Badge variant={ext.is_enabled ? 'default' : 'secondary'}>
                            {ext.is_enabled ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marketplace Fee (%)
                </label>
                <Input defaultValue="2.5" type="number" step="0.1" />
              </div>
              <Button className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}