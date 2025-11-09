// src/components/layout/Header.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Search, 
  ShoppingCart, 
  User, 
  Settings,
  Bell,
  Shield,
  ChevronDown,
  LogOut,
  Wallet
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
// Update this import to match your existing WalletSection component location
// Check your project structure and update accordingly:
// import WalletSection from '@/components/WalletSection';
// or
// import WalletSection from '@/components/ui/WalletSection';
// or create a simple inline wallet component if WalletSection doesn't exist

export default function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Check if user has admin access
  const isAdmin = false; // TODO: Add role to User interface

  const navigationItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/marketplace', label: 'Marketplace', icon: ShoppingCart },
    { href: '/domains', label: 'My Domains', icon: User, requireAuth: true },
  ];

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    router.push('/');
  };

  // Simple wallet connection component if WalletSection doesn't exist
  const WalletConnectButton = () => {
    const { authenticate, isAuthenticating } = useAuth();
    
    return (
      <Button 
        onClick={authenticate}
        disabled={isAuthenticating}
        className="bg-blue-600 hover:bg-blue-700"
      >
        {isAuthenticating ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    );
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">W3</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Web3Domains</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              
              // Skip auth-required items if not authenticated
              if (item.requireAuth && !isAuthenticated) {
                return null;
              }
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            {/* Admin Link - Only show for admin users */}
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Shield className="h-4 w-4" />
                <span>Admin</span>
                <Badge variant="secondary" className="ml-1 text-xs">
                  {user.role}
                </Badge>
              </Link>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Notifications - Only show when authenticated */}
            {isAuthenticated && (
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  3
                </Badge>
              </Button>
            )}

            {/* User Menu or Wallet Connection */}
            {isAuthenticated ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user.wallet_address?.slice(0, 6)}...{user.wallet_address?.slice(-4)}
                    </p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.wallet_address?.slice(0, 6)}...{user.wallet_address?.slice(-4)}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {user.role}
                            </Badge>
                            {isAdmin && (
                              <Badge variant="default" className="text-xs bg-blue-600">
                                Admin Access
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="h-4 w-4 mr-3" />
                        My Profile
                      </Link>
                      
                      <Link
                        href="/domains"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Wallet className="h-4 w-4 mr-3" />
                        My Domains
                      </Link>

                      {/* Admin Menu Item - Only for admins */}
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center px-4 py-2 text-sm text-blue-700 hover:bg-blue-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Shield className="h-4 w-4 mr-3" />
                          Admin Dashboard
                          <Badge variant="secondary" className="ml-auto text-xs">
                            {user.role}
                          </Badge>
                        </Link>
                      )}

                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Settings
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <WalletConnectButton />
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200">
          <div className="py-2 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              
              // Skip auth-required items if not authenticated
              if (item.requireAuth && !isAuthenticated) {
                return null;
              }
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            {/* Mobile Admin Link */}
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center space-x-3 px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
              >
                <Shield className="h-4 w-4" />
                <span>Admin Dashboard</span>
                <Badge variant="secondary" className="ml-auto text-xs">
                  {user.role}
                </Badge>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
}