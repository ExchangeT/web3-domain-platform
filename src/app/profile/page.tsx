'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useWeb3 } from '@/providers/Web3Provider';
import { 
  User, 
  Mail, 
  Globe, 
  Twitter, 
  Github,
  Copy,
  Edit,
  Save,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface UserProfile {
  address: string;
  ensName?: string;
  displayName?: string;
  email?: string;
  website?: string;
  twitter?: string;
  github?: string;
  bio?: string;
  avatar?: string;
}

export default function ProfilePage() {
  const { account, isConnected } = useWeb3();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (account) {
      fetchProfile();
    }
  }, [account]);

  const fetchProfile = async () => {
    if (!account) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/profile/${account}`);
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
        setFormData(data.profile);
      } else {
        // Create default profile
        const defaultProfile: UserProfile = {
          address: account,
          displayName: '',
          email: '',
          website: '',
          twitter: '',
          github: '',
          bio: ''
        };
        setProfile(defaultProfile);
        setFormData(defaultProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!account) return;
    
    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: account,
          ...formData
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
        setEditing(false);
        toast.success('Profile updated successfully');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData(profile || {});
    setEditing(false);
  };

  const handleCopyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      toast.success('Address copied to clipboard');
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Connect Your Wallet
          </h3>
          <p className="text-gray-600">
            Please connect your wallet to view and edit your profile.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your Web3 identity and public information
          </p>
        </div>
        {!editing ? (
          <Button onClick={() => setEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Wallet Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Avatar */}
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                {profile?.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt="Avatar" 
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-white" />
                )}
              </div>
              {editing && (
                <Input
                  placeholder="Avatar URL"
                  value={formData.avatar || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                  className="text-center text-sm"
                />
              )}
            </div>

            {/* Address */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Wallet Address</p>
              <div className="flex items-center justify-center space-x-2">
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {formatAddress(account!)}
                </code>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleCopyAddress}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* ENS Name */}
            {profile?.ensName && (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">ENS Name</p>
                <Badge variant="secondary">{profile.ensName}</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Display Name</label>
              {editing ? (
                <Input
                  placeholder="Your display name"
                  value={formData.displayName || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                />
              ) : (
                <p className="text-gray-900">{profile?.displayName || 'Not set'}</p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              {editing ? (
                <textarea
                  placeholder="Tell us about yourself..."
                  value={formData.bio || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24"
                />
              ) : (
                <p className="text-gray-900">{profile?.bio || 'No bio added'}</p>
              )}
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email
                </label>
                {editing ? (
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                ) : (
                  <p className="text-gray-900">{profile?.email || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <Globe className="h-4 w-4 inline mr-1" />
                  Website
                </label>
                {editing ? (
                  <Input
                    placeholder="https://your-website.com"
                    value={formData.website || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  />
                ) : (
                  <p className="text-gray-900">
                    {profile?.website ? (
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {profile.website}
                      </a>
                    ) : (
                      'Not set'
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Twitter className="h-4 w-4 inline mr-1" />
                  Twitter
                </label>
                {editing ? (
                  <Input
                    placeholder="@username"
                    value={formData.twitter || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, twitter: e.target.value }))}
                  />
                ) : (
                  <p className="text-gray-900">
                    {profile?.twitter ? (
                      <a href={`https://twitter.com/${profile.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {profile.twitter}
                      </a>
                    ) : (
                      'Not set'
                    )}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <Github className="h-4 w-4 inline mr-1" />
                  GitHub
                </label>
                {editing ? (
                  <Input
                    placeholder="username"
                    value={formData.github || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
                  />
                ) : (
                  <p className="text-gray-900">
                    {profile?.github ? (
                      <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {profile.github}
                      </a>
                    ) : (
                      'Not set'
                    )}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
