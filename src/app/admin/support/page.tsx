'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import AdminLayout from '@/components/admin/AdminLayout'

export default function AdminSupport() {
  const mockTickets = [
    { 
      id: 1, 
      title: 'Cannot connect wallet', 
      user: '0x1234...5678', 
      priority: 'high', 
      status: 'open', 
      created: '2024-01-15 10:30' 
    },
    { 
      id: 2, 
      title: 'Domain transfer issue', 
      user: '0x9876...4321', 
      priority: 'medium', 
      status: 'in_progress', 
      created: '2024-01-14 15:20' 
    },
    { 
      id: 3, 
      title: 'Refund request', 
      user: '0x5555...9999', 
      priority: 'low', 
      status: 'resolved', 
      created: '2024-01-13 09:15' 
    }
  ]

  return (
    <AdminLayout userRole="super_admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
          <p className="text-gray-600">Manage customer support tickets and inquiries</p>
        </div>

        {/* Support Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-red-600">3</div>
              <div className="text-gray-600">Open Tickets</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-yellow-600">1</div>
              <div className="text-gray-600">In Progress</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">15</div>
              <div className="text-gray-600">Resolved Today</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">2.5h</div>
              <div className="text-gray-600">Avg Response</div>
            </CardContent>
          </Card>
        </div>

        {/* Support Tickets */}
        <Card>
          <CardHeader>
            <CardTitle>Support Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">ID</th>
                    <th className="text-left py-2">Title</th>
                    <th className="text-left py-2">User</th>
                    <th className="text-left py-2">Priority</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Created</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTickets.map((ticket) => (
                    <tr key={ticket.id} className="border-b">
                      <td className="py-3">#{ticket.id}</td>
                      <td className="py-3 font-medium">{ticket.title}</td>
                      <td className="py-3 font-mono text-sm">{ticket.user}</td>
                      <td className="py-3">
                        <Badge variant={
                          ticket.priority === 'high' ? 'destructive' : 
                          ticket.priority === 'medium' ? 'default' : 'secondary'
                        }>
                          {ticket.priority}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Badge variant={
                          ticket.status === 'open' ? 'destructive' :
                          ticket.status === 'in_progress' ? 'default' : 'secondary'
                        }>
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 text-gray-600">{ticket.created}</td>
                      <td className="py-3">
                        <button className="text-blue-600 hover:underline mr-2">View</button>
                        <button className="text-green-600 hover:underline">Respond</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}