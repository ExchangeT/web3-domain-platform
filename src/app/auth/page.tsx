'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, ArrowLeft } from 'lucide-react'

export default function AuthPage() {
  const router = useRouter()

  useEffect(() => {
    // Auto redirect to home after 3 seconds
    const timer = setTimeout(() => {
      router.push('/')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <CardTitle className="text-xl font-semibold">Authentication Required</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            You need to be authenticated to access this page.
          </p>
          <p className="text-sm text-gray-500">
            You will be redirected to the home page in 3 seconds...
          </p>
          <div className="flex flex-col gap-2">
            <Button 
              onClick={() => router.push('/')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go to Home Page
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}