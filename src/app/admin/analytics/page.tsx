'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AdminLayout from '@/components/admin/AdminLayout'

export default function AdminAnalytics() {
  return (
    <AdminLayout userRole="super_admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Platform performance and user insights</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                <p className="text-gray-500">Chart placeholder - User growth over time</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                <p className="text-gray-500">Chart placeholder - Revenue trends</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Popular Extensions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { ext: '.moh', count: 245, percentage: 45 },
                  { ext: '.web3', count: 156, percentage: 28 },
                  { ext: '.crypto', count: 89, percentage: 16 },
                  { ext: '.dao', count: 67, percentage: 11 }
                ].map((item) => (
                  <div key={item.ext} className="flex justify-between items-center">
                    <span className="font-medium">{item.ext}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  'New user registered: 0x1234...5678',
                  'Domain sold: premium.moh for 1.5 ETH',
                  'New domain registered: crypto.web3',
                  'User upgraded to premium: 0x9876...4321'
                ].map((activity, index) => (
                  <div key={index} className="text-sm text-gray-600 py-1">
                    {activity}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}