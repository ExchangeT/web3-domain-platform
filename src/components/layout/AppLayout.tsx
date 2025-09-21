// src/components/layout/AppLayout.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Globe, 
  Search, 
  ShoppingCart, 
  User, 
  Settings,
  Menu,
  X,
  Home,
  TrendingUp,
  Heart,
  Bell
} from 'lucide-react';
import { WalletConnection } from '@/components/web3/WalletConnection';
import { NetworkStatus } from '@/components/web3/NetworkStatus';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface LayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Search', href: '/search', icon: Search },
    { name: 'Marketplace', href: '/marketplace', icon: ShoppingCart },
    { name: 'My Domains', href: '/domains', icon: Globe },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Web3Domains
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right Side - Wallet & Notifications */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 text-white">
                  3
                </Badge>
              </button>

              {/* Watchlist */}
              <Link href="/watchlist">
                <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                  <Heart className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-blue-500 text-white">
                    5
                  </Badge>
                </button>
              </Link>

              {/* Wallet Connection */}
              <WalletConnection />

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium ${
                      isActive(item.href)
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Network Status */}
      <NetworkStatus />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Web3Domains
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                The leading platform for Web3 domain registration and marketplace. 
                Own your digital identity in the decentralized web.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                Platform
              </h3>
              <ul className="space-y-2">
                <li><Link href="/search" className="text-gray-600 hover:text-gray-900">Search Domains</Link></li>
                <li><Link href="/marketplace" className="text-gray-600 hover:text-gray-900">Marketplace</Link></li>
                <li><Link href="/domains" className="text-gray-600 hover:text-gray-900">My Domains</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                Support
              </h3>
              <ul className="space-y-2">
                <li><Link href="/help" className="text-gray-600 hover:text-gray-900">Help Center</Link></li>
                <li><Link href="/docs" className="text-gray-600 hover:text-gray-900">Documentation</Link></li>
                <li><Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact Us</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-600 text-sm">
                © 2024 Web3Domains. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link href="/privacy" className="text-gray-600 hover:text-gray-900 text-sm">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-600 hover:text-gray-900 text-sm">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Dashboard Stats Component
export function DashboardStats() {
  const stats = [
    { name: 'Total Domains', value: '12,345', change: '+12%', changeType: 'increase' as const },
    { name: 'Active Listings', value: '1,234', change: '+8%', changeType: 'increase' as const },
    { name: 'Total Volume', value: '456.7 ETH', change: '+23%', changeType: 'increase' as const },
    { name: 'Avg. Price', value: '0.15 ETH', change: '-5%', changeType: 'decrease' as const },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`flex items-center ${
              stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">{stat.change}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Quick Actions Component
export function QuickActions() {
  const actions = [
    {
      title: 'Register Domain',
      description: 'Find and register your perfect Web3 domain',
      href: '/search',
      icon: Search,
      color: 'bg-blue-600'
    },
    {
      title: 'Browse Marketplace',
      description: 'Discover premium domains for sale',
      href: '/marketplace',
      icon: ShoppingCart,
      color: 'bg-purple-600'
    },
    {
      title: 'Manage Domains',
      description: 'Configure your existing domains',
      href: '/domains',
      icon: Settings,
      color: 'bg-green-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link key={action.title} href={action.href}>
            <div className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className={`${action.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}