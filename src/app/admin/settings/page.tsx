'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import AdminLayout from '@/components/admin/AdminLayout'

export default function AdminSettings() {
  return (
    <AdminLayout userRole="super_admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-gray-600">Configure platform parameters and features</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Fee Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Platform Fee (%)</label>
                <Input type="number" defaultValue="2.5" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Referral Commission (%)</label>
                <Input type="number" defaultValue="10" />
              </div>
              <Button>Save Fee Settings</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Domain Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Min Domain Length</label>
                <Input type="number" defaultValue="1" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Max Domain Length</label>
                <Input type="number" defaultValue="63" />
              </div>
              <Button>Save Domain Settings</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feature Toggles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Domain Registration</span>
                <Button variant="outline" size="sm">Enabled</Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Marketplace</span>
                <Button variant="outline" size="sm">Enabled</Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Email Verification</span>
                <Button variant="outline" size="sm">Disabled</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Database</span>
                <span className="text-green-600">Healthy</span>
              </div>
              <div className="flex justify-between">
                <span>Blockchain Connection</span>
                <span className="text-green-600">Connected</span>
              </div>
              <div className="flex justify-between">
                <span>API Status</span>
                <span className="text-green-600">Online</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}