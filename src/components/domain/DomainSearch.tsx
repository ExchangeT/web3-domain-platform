// src/components/domain/DomainSearch.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useWeb3 } from '@/providers/Web3Provider';
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Sparkles,
  Wallet,
  RefreshCw,
  TrendingUp,
  Zap,
  AlertCircle
} from 'lucide-react';

interface DomainResult {
  name: string;
  extension: string;
  fullName: string;
  isAvailable: boolean;
  price: string;
  premium?: boolean;
  trending?: boolean;
  length: number;
}

interface Extension {
  name: string;
  price: string;
  description: string;
  popular: boolean;
}

export function DomainSearch() {
  const { isConnected, connect } = useWeb3();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<DomainResult[]>([]);
  const [selectedExtensions, setSelectedExtensions] = useState<string[]>(['web3', 'dao', 'defi']);
  const [registering, setRegistering] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Available extensions
  const extensions: Extension[] = [
    { name: 'web3', price: '0.1', description: 'Perfect for Web3 projects', popular: true },
    { name: 'dao', price: '0.15', description: 'Ideal for DAOs and organizations', popular: true },
    { name: 'defi', price: '0.12', description: 'Great for DeFi protocols', popular: true },
    { name: 'nft', price: '0.2', description: 'For NFT collections and creators', popular: false },
    { name: 'crypto', price: '0.25', description: 'Crypto and blockchain projects', popular: false },
    { name: 'meta', price: '0.3', description: 'Metaverse and virtual worlds', popular: false },
  ];

  // Get URL search parameter on load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query) {
      setSearchTerm(query);
      performSearch(query);
    }
  }, []);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      if (term.length >= 2) {
        performSearch(term);
      } else {
        setResults([]);
        setHasSearched(false);
      }
    }, 500),
    [selectedExtensions]
  );

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    } else {
      setResults([]);
      setHasSearched(false);
    }
  }, [searchTerm, debouncedSearch, selectedExtensions]);

  const performSearch = async (term: string) => {
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      // Clean the search term
      const cleanTerm = term.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      if (cleanTerm.length < 2) {
        setResults([]);
        return;
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Generate results for selected extensions
      const searchResults: DomainResult[] = [];
      
      for (const extName of selectedExtensions) {
        const extension = extensions.find(e => e.name === extName);
        if (!extension) continue;

        const fullName = `${cleanTerm}.${extName}`;
        
        // Simulate availability check with realistic logic
        const isAvailable = await checkDomainAvailability(fullName, cleanTerm);
        
        searchResults.push({
          name: cleanTerm,
          extension: extName,
          fullName,
          isAvailable,
          price: cleanTerm.length <= 3 ? (parseFloat(extension.price) * 2).toFixed(2) : extension.price,
          premium: cleanTerm.length <= 3,
          trending: ['crypto', 'defi', 'nft', 'ai', 'meta'].includes(cleanTerm),
          length: cleanTerm.length
        });
      }

      // Add suggestions if original term is taken
      if (searchResults.some(r => !r.isAvailable)) {
        const suggestions = generateSuggestions(cleanTerm);
        for (const suggestion of suggestions.slice(0, 3)) {
          for (const extName of selectedExtensions.slice(0, 2)) {
            const extension = extensions.find(e => e.name === extName);
            if (!extension) continue;

            const fullName = `${suggestion}.${extName}`;
            const isAvailable = await checkDomainAvailability(fullName, suggestion);
            
            if (isAvailable) {
              searchResults.push({
                name: suggestion,
                extension: extName,
                fullName,
                isAvailable: true,
                price: suggestion.length <= 3 ? (parseFloat(extension.price) * 2).toFixed(2) : extension.price,
                premium: suggestion.length <= 3,
                trending: false,
                length: suggestion.length
              });
            }
          }
        }
      }

      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Simulate domain availability check with more realistic logic
  const checkDomainAvailability = async (domain: string, name: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Popular/common names are more likely to be taken
    const popularNames = ['crypto', 'bitcoin', 'ethereum', 'web3', 'defi', 'nft', 'dao', 'meta', 'ai'];
    if (popularNames.includes(name)) {
      return Math.random() > 0.7; // 30% available
    }
    
    // Short names (1-3 chars) are more likely to be taken
    if (name.length <= 3) {
      return Math.random() > 0.8; // 20% available
    }
    
    // Medium names (4-6 chars) 
    if (name.length <= 6) {
      return Math.random() > 0.4; // 60% available
    }
    
    // Long names are usually available
    return Math.random() > 0.2; // 80% available
  };

  const generateSuggestions = (baseName: string): string[] => {
    const prefixes = ['my', 'get', 'the', 'use', 'pro'];
    const suffixes = ['app', 'pro', 'hub', 'lab', 'tech', '2024', 'official'];
    const numbers = ['1', '2', '3', '10', '21'];
    
    const suggestions: string[] = [];
    
    // Add prefixes
    prefixes.forEach(prefix => suggestions.push(`${prefix}${baseName}`));
    
    // Add suffixes
    suffixes.forEach(suffix => suggestions.push(`${baseName}${suffix}`));
    
    // Add numbers
    numbers.forEach(num => suggestions.push(`${baseName}${num}`));
    
    return suggestions.slice(0, 8);
  };

  const handleRegister = async (domain: DomainResult) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      connect();
      return;
    }

    setRegistering(domain.fullName);
    
    try {
      // Simulate registration process
      toast.info(`Starting registration for ${domain.fullName}...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation, this would call your smart contract
      const response = await fetch('/api/domains/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain: domain.fullName,
          price: domain.price,
        }),
      });

      if (response.ok) {
        toast.success(`Successfully registered ${domain.fullName}!`);
        // Update the domain as no longer available
        setResults(prev => prev.map(d => 
          d.fullName === domain.fullName 
            ? { ...d, isAvailable: false }
            : d
        ));
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to register domain. Please try again.');
    } finally {
      setRegistering(null);
    }
  };

  const toggleExtension = (extName: string) => {
    setSelectedExtensions(prev => {
      const newExtensions = prev.includes(extName) 
        ? prev.filter(e => e !== extName)
        : [...prev, extName];
      
      // If we have search results, re-search with new extensions
      if (searchTerm && hasSearched) {
        setTimeout(() => performSearch(searchTerm), 100);
      }
      
      return newExtensions;
    });
  };

  const handleQuickSearch = (term: string) => {
    setSearchTerm(term);
    performSearch(term);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Search Header */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Find Your Perfect Domain
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Search and register Web3 domains instantly. Own your digital identity forever.
        </p>
      </div>

      {/* Search Input */}
      <Card className="shadow-lg border-0">
        <CardContent className="p-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
            <Input
              placeholder="Search for your domain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchTerm && performSearch(searchTerm)}
              className="pl-14 text-lg h-16 border-0 focus:ring-2 focus:ring-blue-500 rounded-xl"
            />
            {isSearching && (
              <RefreshCw className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 animate-spin text-gray-400" />
            )}
          </div>
          
          {/* Quick Search Examples */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-sm text-gray-500 mr-2">Try:</span>
            {['crypto', 'yourname', 'project', 'startup'].map((example) => (
              <button
                key={example}
                onClick={() => handleQuickSearch(example)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Extension Selector */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Zap className="h-5 w-5 mr-2 text-blue-500" />
            Choose Extensions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {extensions.map((ext) => (
              <button
                key={ext.name}
                onClick={() => toggleExtension(ext.name)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedExtensions.includes(ext.name)
                    ? 'border-blue-500 bg-blue-50 shadow-md transform scale-105'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-lg">.{ext.name}</span>
                  <div className="flex items-center gap-2">
                    {ext.popular && <TrendingUp className="h-4 w-4 text-orange-500" />}
                    <span className="text-sm font-semibold text-green-600">{ext.price} ETH</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{ext.description}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {hasSearched && (
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Search className="h-5 w-5 mr-2 text-blue-500" />
                Search Results for "{searchTerm}"
              </div>
              {results.length > 0 && (
                <Badge variant="outline" className="text-sm">
                  {results.filter(r => r.isAvailable).length} available
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isSearching ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-600">Searching domains...</p>
                </div>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-4">
                {results.map((domain, index) => (
                  <div
                    key={`${domain.fullName}-${index}`}
                    className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${
                      domain.isAvailable 
                        ? 'border-green-200 bg-green-50 hover:bg-green-100' 
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      {domain.isAvailable ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-600" />
                      )}
                      
                      <div>
                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-xl">{domain.fullName}</span>
                          {domain.premium && (
                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
                              <Sparkles className="h-3 w-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                          {domain.trending && (
                            <Badge variant="outline" className="border-orange-400 text-orange-600">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Trending
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mt-1">
                          {domain.isAvailable 
                            ? 'Available for registration' 
                            : 'Already registered'
                          }
                          {domain.premium && ' • Premium pricing for short domains'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-bold text-2xl text-green-600">{domain.price} ETH</p>
                        <p className="text-sm text-gray-500">
                          {domain.length <= 3 ? 'Premium rate' : 'Standard rate'}
                        </p>
                      </div>
                      
                      {domain.isAvailable ? (
                        <Button
                          onClick={() => handleRegister(domain)}
                          disabled={registering === domain.fullName || !isConnected}
                          className="min-w-[140px] h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          {registering === domain.fullName ? (
                            <>
                              <Clock className="h-4 w-4 mr-2 animate-spin" />
                              Registering...
                            </>
                          ) : !isConnected ? (
                            <>
                              <Wallet className="h-4 w-4 mr-2" />
                              Connect Wallet
                            </>
                          ) : (
                            <>
                              <Wallet className="h-4 w-4 mr-2" />
                              Register
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button variant="outline" disabled className="min-w-[140px] h-12 rounded-xl">
                          Unavailable
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No domains found
                </h3>
                <p className="text-gray-600">
                  Try a different search term or select more extensions.
                </p>
              </div>
            )}
            
            {/* Search Tips */}
            {hasSearched && searchTerm && results.every(r => !r.isAvailable) && (
              <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Try these suggestions:
                </h3>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• Add numbers or words (e.g., "myproject", "project2024")</li>
                  <li>• Try different extensions (.web3, .dao, .defi)</li>
                  <li>• Use abbreviations or alternative spellings</li>
                  <li>• Consider related terms or synonyms</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Popular Domains Section */}
      {!hasSearched && (
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-orange-500" />
              Trending Searches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {['crypto', 'defi', 'nft', 'dao', 'web3', 'meta', 'ai', 'btc', 'eth', 'bitcoin', 'startup', 'project'].map((name) => (
                <button
                  key={name}
                  onClick={() => handleQuickSearch(name)}
                  className="p-4 text-left border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all hover:scale-105"
                >
                  <span className="font-semibold text-lg">{name}</span>
                  <p className="text-xs text-gray-600 mt-1">Click to search</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wallet Connection Notice */}
      {!isConnected && hasSearched && results.some(r => r.isAvailable) && (
        <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-8 text-center">
            <Wallet className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Connect Your Wallet</h3>
            <p className="text-gray-600 mb-6">
              Connect your wallet to register domains and manage your Web3 identity.
            </p>
            <Button 
              onClick={connect}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl px-8 py-3"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default DomainSearch;