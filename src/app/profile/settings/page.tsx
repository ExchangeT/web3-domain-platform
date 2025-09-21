'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Settings, Shield, Bell, Eye, Trash2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function SettingsPage() {
  const { user, isAuthenticated } = useAuth()
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false
  })
  const [privacy, setPrivacy] = useState({
    profilePublic: false,
    showDomains: true,
    showTransactions: false
  })

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
            <p className="text-gray-600 mb-4">Please connect your wallet to access settings</p>
            <w3m-button />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
        <p className="text-gray-600">Manage your account preferences and security</p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Profile Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Display Name</label>
                <Input defaultValue={user?.name || ''} placeholder="Your display name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input defaultValue={user?.email || ''} placeholder="your@email.com" />
              </div>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-600">Add an extra layer of security</p>
              </div>
              <Badge variant="outline">Disabled</Badge>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Wallet Address</h3>
                <p className="text-sm text-gray-600 font-mono">{user?.walletAddress}</p>
              </div>
              <Button variant="outline" size="sm">Verify</Button>
            </div>
            <Button>Enable 2FA</Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-gray-600">Domain expiry, sale notifications</p>
                </div>
                <Button
                  variant={notifications.email ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNotifications({...notifications, email: !notifications.email})}
                >
                  {notifications.email ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Push Notifications</h3>
                  <p className="text-sm text-gray-600">Browser notifications</p>
                </div>
                <Button
                  variant={notifications.push ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNotifications({...notifications, push: !notifications.push})}
                >
                  {notifications.push ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Privacy</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Public Profile</h3>
                  <p className="text-sm text-gray-600">Make your profile visible to others</p>
                </div>
                <Button
                  variant={privacy.profilePublic ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPrivacy({...privacy, profilePublic: !privacy.profilePublic})}
                >
                  {privacy.profilePublic ? 'Public' : 'Private'}
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Show Domain Portfolio</h3>
                  <p className="text-sm text-gray-600">Display your domain collection</p>
                </div>
                <Button
                  variant={privacy.showDomains ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPrivacy({...privacy, showDomains: !privacy.showDomains})}
                >
                  {privacy.showDomains ? 'Visible' : 'Hidden'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              <span>Danger Zone</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Delete Account</h3>
                <p className="text-sm text-gray-600">Permanently delete your account and data</p>
              </div>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}